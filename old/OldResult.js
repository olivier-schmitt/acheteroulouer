function ResultsCtrl($scope, $location) {

    $scope.simulator = new Simulator();

    $scope.refresh = function() {
        $scope.simulator.computeParams($scope.params);
        $scope.computeDatas();
        $scope.computeSynthesis();
        $scope.niveauvieTotal($scope.params);
        $scope.save();
    };

    $scope.save = function() {
        var jsonStream = JSON.stringify($scope.params);
        localStorage.setItem("simu.current", jsonStream);
    };

    $scope.toggleGlobal = function() {
        $scope.params.visible = !$scope.params.visible;
        $scope.save();
    };

    $scope.toggleGraph = function() {
        $scope.params.graphSectionVisible = !$scope.params.graphSectionVisible;
        $scope.save();
        if ($scope.params.graphSectionVisible) {
            $scope.createGraphs();
        }
    };

    $scope.toggleVie = function() {
        $scope.params.vieVisible = !$scope.params.vieVisible;
        $scope.save();
    };

    $scope.toggleSynth = function() {
        $scope.params.synthVisible = !$scope.params.synthVisible;
        $scope.save();
    };

    $scope.toggleAchat = function() {
        $scope.params.achat.visible = !$scope.params.achat.visible;
        $scope.save();
    };
    
    $scope.toggleAchatEvols = function() {
        $scope.params.achat.evols = !$scope.params.achat.evols;
        $scope.save();
    };
    
    $scope.toggleAchatCharges = function() {
        $scope.params.achat.chargesVisible = !$scope.params.achat.chargesVisible;
        $scope.save();
    };

    $scope.toggleAchatEpargne = function() {
        $scope.params.achat.epargneVisible = !$scope.params.achat.epargneVisible;
        $scope.save();
    };

    $scope.toggleLocation = function() {
        $scope.params.location.visible = !$scope.params.location.visible;
        $scope.save();
    };

    $scope.toggleLocationCharges = function() {
        $scope.params.location.chargesVisible = !$scope.params.location.chargesVisible;
        $scope.save();
    };

    $scope.toggleLocationEpargne = function() {
        $scope.params.location.epargneVisible = !$scope.params.location.epargneVisible;
        $scope.save();
    };

    $scope.computeDatas = function() {

        $scope.params.graphSectionVisible = false;

        var params = $scope.params;
        var achat = $scope.params.achat;
        var location = $scope.params.location;

        var last = params.duree;
        var i = 1;
        var series = new Array();

        var categories = new Array();
        // Calcul des évolutions pour la location

        var locationData = new Array();
        var locationElectData = new Array();
        var locationCarbData = new Array();
        var locationEntretienData = new Array();
        var locationCoutAnnuelData = new Array();

        var loyerCourant = location.loyerA;
        var elecCourant = location.chargeElecA;
        var carbCourant = location.chargeCarbA;
        var entretienCourant = location.entretienA;

        for (i = 1; i <= last; i++) {
            var cout = loyerCourant + entretienCourant + elecCourant + carbCourant;
            locationData.push(Math.round(loyerCourant));
            locationElectData.push(Math.round(elecCourant));
            locationCarbData.push(Math.round(carbCourant));
            locationEntretienData.push(Math.round(entretienCourant));
            locationCoutAnnuelData.push(Math.round(cout));
            loyerCourant = loyerCourant * (1 + (params.evolLoyer / 100));
            entretienCourant = loyerCourant * (params.location.entretien / 100);
            elecCourant = elecCourant * (1 + (params.evolKwhPrix / 100));
            carbCourant = carbCourant * (1 + (params.evolCarburantPrix / 100));
        }

        var achatData = new Array();
        var achatElectData = new Array();
        var achatCarbData = new Array();
        var achatEntretienData = new Array();
        var achatSyndicData = new Array();
        var achatTaxeFoncData = new Array();
        var achatCoutAnnuelData = new Array();

        var mensCourant = achat.chargePretA;
        elecCourant = achat.chargeElecA;
        carbCourant = achat.chargeCarbA;
        var syndicCourant = achat.chargeSyndicA;
        var taxeFoncCourant = achat.chargeTaxeFoncA;
        var entretienCourant = achat.entretienMaisonA;

        for (i = 1; i <= last; i++) {
            // Ajout des coûts de syndic et taxe foncière
            var cout = mensCourant + elecCourant + carbCourant + syndicCourant + taxeFoncCourant + entretienCourant;

            achatData.push(Math.round(mensCourant));
            achatElectData.push(Math.round(elecCourant));
            achatCarbData.push(Math.round(carbCourant));
            achatSyndicData.push(Math.round(syndicCourant));
            achatTaxeFoncData.push(Math.round(taxeFoncCourant));
            achatEntretienData.push(Math.round(entretienCourant));

            achatCoutAnnuelData.push(Math.round(cout));

            if ((i + 1) > achat.pretDuree) {
                mensCourant = 0;
            }

            elecCourant = elecCourant * (1 + (params.evolKwhPrix / 100));
            carbCourant = carbCourant * (1 + (params.evolCarburantPrix / 100));
            syndicCourant = syndicCourant * (1 + (achat.evolSyndic / 100));
            taxeFoncCourant = taxeFoncCourant * (1 + (achat.evolTaxeFonc / 100));
            entretienCourant = achat.entretienMaisonA;
        }

        var diffLocationAchatData = new Array();
        for (i = 1; i <= last; i++) {
            var achatAnnuel = achatCoutAnnuelData[i - 1];
            var locationAnnuel = locationCoutAnnuelData[i - 1];
            diffLocationAchatData.push(locationAnnuel - achatAnnuel);
        }
        params.achat.diffMensFin = diffLocationAchatData[diffLocationAchatData.length - 1];
        params.location.diffLoyerFin = diffLocationAchatData[diffLocationAchatData.length - 1] * -1;

        params.diffLocationAchat = diffLocationAchatData;

        for (i = 1; i <= last; i++) {
            categories.push(i);
        }

        var locationSerie = {
            name: 'Loyer',
            data: locationData,
            stack: 'Location'
        };

        var locationElecSerie = {
            name: 'Electricité',
            data: locationElectData,
            stack: 'Location'
        };

        var locationCarbSerie = {
            name: 'Carburant',
            data: locationCarbData,
            stack: 'Location'
        };
        var locationEntretienSerie = {
            name: 'Entretien',
            data: locationEntretienData,
            stack: 'Location'
        };
        var locationCoutAnnuelSerie = {
            name: 'Σ',
            data: locationCoutAnnuelData,
            stack: 'Location'
        };

        var achatSerie = {
            name: 'Prêt',
            data: achatData,
            stack: 'Achat'
        };


        var achatElecSerie = {
            name: 'Electricité',
            data: achatElectData,
            stack: 'Achat'
        };
        var achatCarbSerie = {
            name: 'Carburant',
            data: achatCarbData,
            stack: 'Achat'
        };
        var achatSyndicSerie = {
            name: 'Copropriété',
            data: achatSyndicData,
            stack: 'Achat'
        };
        var achatTaxeFoncSerie = {
            name: 'Taxe foncière',
            data: achatTaxeFoncData,
            stack: 'Achat'
        };

        var achatEntretienSerie = {
            name: 'Entretien',
            data: achatEntretienData,
            stack: 'Achat'
        };
        var achatCoutAnnuelSerie = {
            name: 'Σ',
            data: achatCoutAnnuelData,
            stack: 'Achat'
        };

        var achatDatas = [
            achatSerie, achatElecSerie, achatCarbSerie,
            achatSyndicSerie, achatTaxeFoncSerie, achatEntretienSerie, achatCoutAnnuelSerie];

        params.achat.datas = achatDatas;

        $scope.createTable($("#achat"), achatDatas);
        $scope.achatEpargne(params);
        $scope.achatTotal(params, achat, achatDatas);


        /////////////////////////////////////

        var locationDatas = [
            locationSerie, locationElecSerie, locationCarbSerie, locationEntretienSerie, locationCoutAnnuelSerie
        ];

        params.location.datas = locationDatas;

        $scope.createTable($("#location"), locationDatas);
        $scope.locationEpargne(params);
        $scope.locationTotal(location, locationDatas);

    };

    $scope.createGraphs = function() {

        var params = $scope.params;
        var achatCoutAnnuelSerie = params.achat.datas[6];
        var locationCoutAnnuelSerie = params.location.datas[4];

        $scope.draw(params,
                achatCoutAnnuelSerie,
                locationCoutAnnuelSerie);

    };

    $scope.computeSynthesis = function() {

        var achat = $scope.params.achat;
        var location = $scope.params.location;

        // Achat
        var synthAchat = $("#synth-achat");
        synthAchat.empty();
        var clonedAchatDatas = $("#achat-total").clone();
        synthAchat.append(clonedAchatDatas);

        if (achat.epargneTotal > 0) {
            // Estimation rente
            achat.rente = true;
            // Estimation rente
            achat.renteA = Math.round(achat.epargneTotal * ($scope.params.eparRendement / 100));
            achat.renteM = Math.round(achat.renteA / 12);
        }
        else {
            achat.rente = false;
        }

        // Loca
        var synthLoca = $("#synth-loca");
        synthLoca.empty();

        var clonedLocationDatas = $("#location-total").clone();
        synthLoca.append(clonedLocationDatas);
        if (location.epargneTotal > 0) {
            location.rente = true;
            // Estimation rente
            location.renteA = Math.round(location.epargneTotal * ($scope.params.eparRendement / 100));
            location.renteM = Math.round(location.renteA / 12);
        }
        else {
            location.rente = false;
        }
        achat.isBest = (achat.bilan > location.bilan);
    };

    $scope.achatTotal = function(params, achat, achatDatas) {

        var achatTotaltbody = $("#achat-total > tbody");
        achatTotaltbody.empty();
        var total = achat.fraisTotalMnt;
        for (i = 0; i < achatDatas.length - 1; i++) {
            var serie = achatDatas[i];
            var html = "";
            html = html + "<tr>";
            html = html + "<td>" + serie.name + "</td>";
            html = html + "<td>" + serie.total + "</td><td></td>";
            html = html + "</tr>";
            achatTotaltbody.append(html);
            total = total + serie.total;
        }
        achat.coutTotalCharges = total;
        if (params.duree > achat.pretDuree) {
            achat.restantDu = 0;

        } else {
            var dureeSimu = params.duree * 12;
            var dureePret = achat.pretDuree * 12;
            var taux = achat.pretTauxEff / 100;
            //605,98 × [1 − (1 + 0,04/12)-(240—120) ] ÷ (0,04/12)
            var part = Math.pow((1 + taux / 12), -(dureePret - dureeSimu));
            achat.restantDu = Math.round(achat.chargePretM * ((1 - part) / (taux / 12)));
            //achat.restantDu = achat.pretMnt - (achat.pretMnt / achat.pretDuree);
        }
        achat.coutTotal = Math.round(achat.coutTotalCharges + achat.restantDu);
        achat.recetteTotal = Math.round(achat.epargneTotal + achat.valorisation);
        achat.bilan = achat.recetteTotal - achat.coutTotal;

        html = "<tr>";
        html = html + "<td>Frais achat</td>";
        html = html + "<td>" + achat.fraisTotalMnt + "</td><td></td>";
        html = html + "</tr>";
        achatTotaltbody.append(html);

        html = "<tr>";
        html = html + "<td>Epargne</td><td></td>";
        html = html + "<td>" + achat.epargneTotal + "</td>";
        html = html + "</tr>";
        achatTotaltbody.append(html);

        html = "<tr>";
        html = html + "<td>Valeur du bien</td><td></td>";
        html = html + "<td>" + achat.valorisation + "</td>";
        html = html + "</tr>";
        achatTotaltbody.append(html);

        html = "<tr>";
        html = html + "<td>Restant dû</td>";
        html = html + "<td>" + achat.restantDu + "</td><td></td>";
        html = html + "</tr>";
        achatTotaltbody.append(html);


        var achatTotaltfooter = $("#achat-total > tfoot");
        achatTotaltfooter.empty();
        html = "<tr>";
        html = html + "<td>Σ</td>";
        html = html + "<td>" + achat.coutTotal + "</td>";
        html = html + "<td>" + achat.recetteTotal + "</td>";
        html = html + "</tr>";
        achatTotaltfooter.append(html);

    };
    $scope.locationTotal = function(location, locationDatas) {

        var locationTotaltbody = $("#location-total > tbody");
        locationTotaltbody.empty();
        var total = location.fraisAgenceMnt;
        for (i = 0; i < locationDatas.length - 1; i++) {
            var serie = locationDatas[i];
            var html = "";
            html = html + "<tr>";
            html = html + "<td>" + serie.name + "</td>";
            html = html + "<td>" + serie.total + "</td><td></td>";
            html = html + "</tr>";
            locationTotaltbody.append(html);
            total = total + serie.total;
        }
        location.coutTotalCharges = total;
        location.coutTotal = Math.round(location.coutTotalCharges);
        location.recetteTotal = Math.round(location.epargneTotal);
        location.bilan = location.recetteTotal - location.coutTotal ;

        html = "<tr>";
        html = html + "<td>Frais location</td>";
        html = html + "<td>" + location.fraisAgenceMnt + "</td><td></td>";
        html = html + "</tr>";
        locationTotaltbody.append(html);

        html = "<tr>";
        html = html + "<td>Epargne</td><td></td>";
        html = html + "<td>" + location.epargneTotal + "</td>";
        html = html + "</tr>";
        locationTotaltbody.append(html);

        var locationTotaltfooter = $("#location-total > tfoot");
        locationTotaltfooter.empty();
        html = "<tr>";
        html = html + "<td>Σ</td>";
        html = html + "<td>" + location.coutTotal + "</td>";
        html = html + "<td>" + location.recetteTotal + "</td>";
        html = html + "</tr>";
        locationTotaltfooter.append(html);

    };

    $scope.niveauvieTotal = function(params) {

        // TODO récup de l'épargne liquide annuelle disponible
        var last = params.duree;
        var i = 1;

        var tbody = $("#nvieachat > tbody");
        tbody.empty();

        var achatDatas = params.achat.datas;
        var achatEpargneDatas = params.achat.epargneDatas;
        var coutAnnuelAchatArray = achatDatas[achatDatas.length - 1];

        for (i = 1; i <= last; i++) {
            var coutAchat = coutAnnuelAchatArray.data[i - 1];
            var epargneAchat = achatEpargneDatas[i - 1];
            var html = "";
            html = html + "<tr>";
            html = html + "<td>" + i + "</td>";
            html = html + "<td>" + Math.round(coutAchat / 12) + "</td>";
            html = html + "<td>" + Math.round(epargneAchat) + "</td>";
            html = html + "</tr>";
            tbody.append(html);
        }
        // Fin

        tbody = $("#nvielocation > tbody");
        tbody.empty();

        var locationDatas = params.location.datas;
        var coutsLocation = locationDatas[locationDatas.length - 1];
        var locationEpargneDatas = params.location.epargneDatas;
        for (i = 1; i <= last; i++) {
            var coutLocation = coutsLocation.data[i - 1];
            var epargneLocation = locationEpargneDatas[i - 1];
            var html = "";
            html = html + "<tr>";
            html = html + "<td>" + i + "</td>";
            html = html + "<td>" + Math.round(coutLocation / 12) + "</td>";
            html = html + "<td>" + Math.round(epargneLocation) + "</td>";
            html = html + "</tr>";
            tbody.append(html);
        }
    };

    $scope.locationEpargne = function(params) {

        var achat = params.achat;
        var location = params.location;
        location.epargneDatas = new Array();
        var locationEpargneTotaltbody = $("#location-epargne > tbody");
        locationEpargneTotaltbody.empty();
        var capital = achat.apportMnt;

        var diffLoyerSum = 0;

        for (i = 0; i < params.duree; i++) {

            var diffLoyerAnnee = params.diffLocationAchat[i];
            diffLoyerSum = diffLoyerSum + -1*diffLoyerAnnee;

            if (diffLoyerAnnee < 0) {
                capital = capital + diffLoyerAnnee * -1;
            }
            else {
                //capital = capital - diffLoyerAnnee;
            }

            capital = capital * (1 + (params.eparRendement / 100));

            var html = "";
            html = html + "<tr>";
            html = html + "<td>" + (i + 1) + "</td>";
            html = html + "<td>" + Math.round(diffLoyerAnnee*-1) + "</td>";

            if (capital < 0) {
                html = html + "<td>0</td>";
            }
            else {
                html = html + "<td>" + Math.round(capital) + "</td>";
            }

            html = html + "</tr>";
            location.epargneDatas.push(Math.round(capital));
            locationEpargneTotaltbody.append(html);
        }
        var locationEpargneTotaltfooter = $("#location-epargne > tfoot");
        locationEpargneTotaltfooter.empty();
        html = "<tr>";
        html = html + "<td>Σ</td>";
        html = html + "<td>" + Math.round(diffLoyerSum) + "</td>";
        html = html + "<td>" + Math.round(capital) + "</td>";
        html = html + "</tr>";
        locationEpargneTotaltfooter.append(html);
        location.epargneTotal = Math.round(capital);
    };

    $scope.achatEpargne = function(params) {

        var achat = params.achat;
        var prix = achat.prix;
        achat.epargneDatas = new Array();
        var achatEpargneTotaltbody = $("#achat-epargne > tbody");
        achatEpargneTotaltbody.empty();
        var capital = 0;
        var diffLocationAchatSum = 0;

        for (i = 0; i < params.duree; i++) {

            diffLocationAchatSum = diffLocationAchatSum + params.diffLocationAchat[i];

            if(params.diffLocationAchat[i] > 0){
                capital = capital + params.diffLocationAchat[i];
                capital = capital * (1 + (params.eparRendement / 100));
            }
            else {
                
            }
            prix = prix * (1 + (params.evolMarche / 100));

            var html = "";
            html = html + "<tr>";
            html = html + "<td>" + (i + 1) + "</td>";
            html = html + "<td>" + Math.round(params.diffLocationAchat[i]) + "</td>";

            if (capital < 0) {
                html = html + "<td>0</td>";
            }
            else {
                html = html + "<td>" + Math.round(capital) + "</td>";
            }

            html = html + "<td>" + Math.round(prix) + "</td>";
            html = html + "</tr>";
            achat.epargneDatas.push(Math.round(capital));
            achatEpargneTotaltbody.append(html);
        }
        var achatEpargneTotaltfooter = $("#achat-epargne > tfoot");
        achatEpargneTotaltfooter.empty();
        html = "<tr>";
        html = html + "<td>Σ</td>";
        html = html + "<td>" + Math.round(diffLocationAchatSum) + "</td>";
        html = html + "<td>" + Math.round(capital) + "</td>";
        html = html + "<td>" + Math.round(prix) + "</td>";
        html = html + "</tr>";
        achatEpargneTotaltfooter.append(html);
        achat.epargneTotal = Math.round(capital);
        achat.valorisation = Math.round(prix);
    };

    // Calculer le cout de la totalité dans tableau
    $scope.createTable = function(tableSelector, datas) {

        tableSelector.hide();

        var last = $scope.params.duree;
        var i = 1;

        var tableHeadSelector = tableSelector.find("thead");
        var tableBodySelector = tableSelector.find("tbody");
        var tableFootSelector = tableSelector.find("tfoot");

        tableHeadSelector.empty();
        tableBodySelector.empty();
        tableFootSelector.empty();

        var html = "<tr><th></th>";
        for (i = 0; i < datas.length; i++) {
            var serie = datas[i];
            html = html + "<th>" + serie.name + "</th>";
        }
        //html = html + "<th>Σ</th></tr>";
        tableHeadSelector.append(html);

        var html = "";
        for (i = 1; i <= last; i++) {
            html = html + "<tr>";
            html = html + "<td>" + i + "</td>";
            var j = 0;
            var total = 0;
            for (; j < datas.length; j++) {
                var serie = datas[j];
                value = serie.data[i - 1];
                var title = "Coût mensuel : " + Math.round(value / 12);
                html = html + "<td title='" + title + "'>" + value + "</td>";
                //total = total + value;

            }
            //html = html + "<td>" + total + "</td>";
            html = html + "</tr>";
        }
        tableBodySelector.append(html);

        var j = 0;
        html = "<tr><td>Σ</td>";
        var total = 0;
        for (j = 0; j < datas.length; j++) {
            var serie = datas[j];
            var totalSerie = 0;
            for (i = 0; i < serie.data.length; i++) {
                totalSerie = totalSerie + serie.data[i];
            }
            serie.total = totalSerie;
            html = html + "<td>" + totalSerie + "</td>";
            //total = total + totalSerie;
        }
        //html = html + "<td>" + total + "</td></tr>";
        tableFootSelector.append(html);

        tableSelector.show();
    };

    // Calculer le produit de l'épargne

    $scope.initialize = function() {
        var jsonStream = localStorage.getItem("simu.current");
        if ((jsonStream !== undefined) && (jsonStream !== null)) {
            $scope.params = JSON.parse(jsonStream);
            $scope.refresh();
        }
        else {
            alert("Pas de paramètres mémorisés, allez sur la page d'accueil.");
        }
    };

    $scope.draw = function(params, achatCoutAnnuelSerie, locationCoutAnnuelSerie) {

        // create the chart
        $('#graph1').highcharts({
            title: {
                text: 'Dépenses annuelles selon votre choix'
            },
            xAxis: {
                tickInterval: 1
            },
            yAxis: [{
                    title: {
                        text: 'Dépenses annuelles'
                    },
                    height: 680,
                    lineWidth: 2
                }
            ],
            series: [
                {
                    name: "Achat",
                    type: 'bar',
                    data: achatCoutAnnuelSerie.data,
                    color: "#5F1EC0"
                },
                {
                    name: "Location",
                    type: 'bar',
                    data: locationCoutAnnuelSerie.data,
                    color: "#C01E1E"
                }]
        });

        // create the chart
        $('#graph2').highcharts({
            title: {
                text: 'Epargne cumulée sur la durée'
            },
            xAxis: {
                tickInterval: 1
            },
            yAxis: [{
                    title: {
                        text: 'Epargne cumulée'
                    },
                    height: 680,
                    lineWidth: 2
                }
            ],
            series: [
                {
                    name: "Achat",
                    type: 'bar',
                    data: params.achat.epargneDatas,
                    color: "#5F1EC0"
                },
                {
                    name: "Location",
                    type: 'bar',
                    data: params.location.epargneDatas,
                    color: "#C01E1E"
                }]
        });
    };


    $scope.initialize();
}
