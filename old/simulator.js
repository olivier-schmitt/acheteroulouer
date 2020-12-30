function Simulator() {
    
        this.defaultParams = function() {
            return {
                duree: 25,
                energie: true,
                evolMarche: 1,
                evolLoyer: 1,
                prixKwh: 0.14,
                evolKwhPrix: 2,
                surface: 90,
                carburantPrix: 1.38,
                evolCarburantPrix: 1.0,
                eparRendement: 4,
                carburantConso: 7,
                visible:false,
                vieVisible:false,
                synthVisible:false,
                graphSectionVisible:false,
                achat: {
                    pm2: 2600,
                    entretienMaisonTaux: 1,
                    fraisDossier: 800,
                    fraisNotaire: 7,
                    fraisAgence: 4,
                    fraisGarantie: 0.94,
                    fraisDiversMnt: 0,
                    pretAss: 0.34,
                    pretAssHors: 3.2,
                    pretDuree: 20,
                    pretApport: 15,
                    dpe: 230,
                    chargeTaxeFoncA: 961,
                    chargeTaxeHabA: 961,
                    evolTaxeFonc: 2,
                    syndicSurface: 23,
                    evolSyndic: 2,
                    kmAn: 15000,
                    visible:false,
                    rente:false,
                    chargesVisible : false,
                    epargneVisible : false,
                },
                location: {
                    pm2: 12.8,
                    entretien:2,
                    fraisAgence: 7,
                    dpe: 230,
                    kmAn: 15000,
                    visible:false,
                    chargeTaxeHabA:961,
                    rente:false,
                    chargesVisible : false,
                    epargneVisible : false,
                }
            };
        };
    
        this.pret = function(params) {
            var achat = params.achat;
            achat.pretTauxEff = achat.pretAss + achat.pretAssHors;
            achat.apportMnt = Math.round((achat.pretApport / 100) * achat.prixAvecFraisMnt);
            achat.pretMnt = Math.round(achat.prixAvecFraisMnt - achat.apportMnt);
    
            // Capital emprunté * (TEG/12)
            var C = achat.pretMnt;
            var t = (achat.pretTauxEff / 100) / 12;
            var n = achat.pretDuree * 12;
            var m = (C * t);
            m = m / (1 - (1 / Math.pow((1 + t), n)));
            achat.chargePretM = Math.round(m);
            achat.chargePretA = Math.round(m * 12);
        };
    
        this.achatFrais = function(params) {
            var achat = params.achat;
            achat.prix = Math.round(achat.pm2 * params.surface);
            var prixAchat = achat.prix;
            achat.fraisNotaireMnt = Math.round(prixAchat * (achat.fraisNotaire / 100));
            achat.fraisAgenceMnt = Math.round(prixAchat * (achat.fraisAgence / 100));
            achat.fraisGarantieMnt = Math.round(prixAchat * (achat.fraisGarantie / 100));
    
            achat.fraisTotalMnt = Math.round(achat.fraisDossier
                    + achat.fraisNotaireMnt
                    + achat.fraisAgenceMnt
                    + achat.fraisGarantieMnt
                    + achat.fraisDiversMnt);
    
            achat.prixAvecFraisMnt = Math.round(prixAchat + achat.fraisTotalMnt);
        };
    
        this.achatCharges = function(params) {
            
            var achat = params.achat;
            
            achat.chargePretA = Math.round(12 * achat.chargePretM);
            achat.chargeSyndicA = Math.round(achat.syndicSurface * params.surface);
            achat.chargeSyndicM = Math.round(achat.chargeSyndicA / 12);
    
            achat.chargeTaxeHabM = Math.round(achat.chargeTaxeHabA / 12);
            achat.chargeTaxeFoncM = Math.round(achat.chargeTaxeFoncA / 12);
            achat.chargeDiversM = Math.round(achat.chargeDiversA / 12);
    
            var prixKwh = params.prixKwh;
            achat.chargeElecA = Math.round(achat.dpe * prixKwh * params.surface);
            achat.chargeElecM = Math.round((achat.dpe * prixKwh * params.surface) / 12);
    
            var carburantPrixKm = params.carburantPrix;
            var consoAuKm = params.carburantConso / 100;
    
            achat.chargeCarbA = Math.round(achat.kmAn * consoAuKm * carburantPrixKm);
            achat.chargeCarbM = Math.round(achat.chargeCarbA / 12);
    
            achat.chargePretA = Math.round(achat.chargePretM * 12);
            achat.chargeSyndicA = Math.round(achat.chargeSyndicM * 12);
            achat.chargesTaxeHabM = Math.round(achat.chargeTaxeHabA / 12);
            achat.chargesTaxeFoncM = Math.round(achat.chargeTaxeFoncM / 12);
            achat.chargesDiversM = Math.round(achat.chargeDiversA / 12);
    
            achat.entretienMaisonA = Math.round((achat.entretienMaisonTaux / 100) * achat.prix);
            achat.entretienMaisonM = Math.round(achat.entretienMaisonA / 12);
    
        };
    
        this.computeParams = function(params) {
            this.achatFrais(params);
            this.pret(params);
            this.achatCharges(params);
            this.location(params);
            this.diffCoutLoyerAchat(params);
        };
    
        this.diffCoutLoyerAchat = function(params) {
    
            var achat = params.achat;
            var location = params.location;
    
            var chargesAchat = achat.chargePretA + achat.chargeTaxeFoncA + achat.chargeSyndicA
                    + achat.chargeCarbA + achat.chargeElecA;
    
            var chargesLoyer = location.loyerA + location.entretienA  + location.chargeCarbA + location.chargeElecA;
    
            params.coutLocationA = chargesLoyer;
            params.coutAchatA = chargesAchat;
    
            achat.diffMens = Math.round(chargesLoyer - chargesAchat);
    
            location.diffLoyer = Math.round(chargesAchat - chargesLoyer);
        };
    
        this.location = function(params) {
    
            var location = params.location;
            var achat = params.achat;
            // Loyer
            location.loyerM = Math.round(location.pm2 * params.surface);
            location.loyerA = Math.round(location.pm2 * params.surface * 12);
            // Taxe
            location.chargeTaxeHabM = Math.round(location.chargeTaxeHabA / 12);
            // Entretien location
            location.entretienA = Math.round(location.loyerA * (location.entretien/100));
            location.entretienM = Math.round(location.entretienA/12);
            
            location.fraisAgenceMnt = Math.round(location.loyerA * (location.fraisAgence / 100));
            // Electricité
            var prixKwh = params.prixKwh;
            location.chargeElecA = Math.round(location.dpe * prixKwh * params.surface);
            location.chargeElecM = Math.round((location.dpe * prixKwh * params.surface) / 12);
    
            // Carburant
            var carburantPrixKm = params.carburantPrix;
            var consoAuKm = params.carburantConso / 100;
            location.chargeCarbA = Math.round(location.kmAn * consoAuKm * carburantPrixKm);
            location.chargeCarbM = Math.round(location.chargeCarbA / 12);
        };
    
    }