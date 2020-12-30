import {Component,OnInit} from '@angular/core';
import {FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';
import {Router} from "@angular/router";
import {HypothesisService} from '../service/hypothesis.service';
import {Simulation} from '../simulator/simulation.model';
import {Serie} from '../simulator/serie.model';
import {RentResults} from '../simulator/rentresults.model';
import {BuyResults} from '../simulator/buyresults.model';
import { LoanHypothesis } from "../simulator/loan.model";

@Component({
  moduleId : module.id,
  selector: 'aol-result',  
  templateUrl : 'results.html',
  styleUrls : ['results.css']
})
export class ResultsComponent  implements OnInit  {

  simulation:Simulation = null;
  resultForm: FormGroup;
  rentResults:RentResults = new RentResults();
  buyResults:BuyResults = new BuyResults();

  constructor(private _router:Router, private _fb:FormBuilder) {}
  

  ngOnInit(): void {

    this.simulation = JSON.parse(localStorage.getItem("acheteroulouer.current"));

    let energy = this.simulation.energyHypothesis;    
    let buy = this.simulation.buyCase;    
    let rent = this.simulation.rentCase;

    this.resultForm = this._fb.group({
        
        commonsControls:this._fb.group({        
          duration:[this.simulation.duration,[Validators.required] ],
          surface:[this.simulation.surface,[Validators.required] ],
          gasolineConsumptionPer100Km : [energy.gasolineConsumptionPer100Km,[Validators.required] ],
          savingsReturn: [this.simulation.savingsReturn,[Validators.required] ],
          kwhPrice : [energy.kwhPrice,[Validators.required] ],
          kwhPriceEvol : [energy.kwhPriceEvol,[Validators.required] ],
          gasolinePrice : [energy.gasolinePrice,[Validators.required] ],
          gasolinePriceEvol : [energy.gasolinePriceEvol,[Validators.required] ]
        }),
        rentControls:this._fb.group({        
            kilometerPerYear:[rent.housingUnit.impliedKmsPerYear,[Validators.required] ],
            squareMeterPrice:[rent.housingUnit.squareMeterPrice,[Validators.required] ],
            costEvolution : [rent.housingUnit.costEvolution,[Validators.required] ],
            maintenanceCostRatio: [rent.housingUnit.maintenanceCostRatio,[Validators.required] ],
            energyDiagnosis : [rent.housingUnit.energyDiagnosis,[Validators.required]]
          }),
        buyControls:this._fb.group({        
            kilometerPerYear:[buy.housingUnit.impliedKmsPerYear,[Validators.required] ],
            squareMeterPrice:[buy.housingUnit.squareMeterPrice,[Validators.required] ],
            costEvolution : [buy.housingUnit.costEvolution,[Validators.required] ],
            maintenanceCostRatio: [buy.housingUnit.maintenanceCostRatio,[Validators.required] ],
            energyDiagnosis : [buy.housingUnit.energyDiagnosis,[Validators.required]]
        })
    });

    this.resultForm.valueChanges.subscribe(val => {            
        this.compute();
    });
        
    this.compute();
  }

  computeRentData() {

    let energyHypothesis = this.simulation.energyHypothesis;    
    let location = this.simulation.rentResults;

    let last = this.simulation.duration;
    let surface = this.simulation.surface;
    let i = 1;
    let series = new Array();

    let categories = new Array();
    // Calcul des évolutions pour la location
    let rentCase = this.simulation.rentCase;
    let rentHU = rentCase.housingUnit;
    
    let rentCostPerYearData = new Array();
    let rentElectPerYearData = new Array();
    let rentGasolinePerYearData = new Array();
    let rentMaintenancePerYearData = new Array();
    let rentTotalCostPerYearData = new Array();
    
    let currentRentCostPerYear = surface*rentHU.squareMeterPrice*12;
    let currentElectricityCostPerYear = surface * rentHU.energyDiagnosis * energyHypothesis.kwhPrice ;
    let currentGasolineCostPerYear = ((rentHU.impliedKmsPerYear / 100.0 ) * energyHypothesis.gasolineConsumptionPer100Km) * energyHypothesis.gasolinePrice ;
    let currentMaintenanceCostPerYear = currentRentCostPerYear * (rentHU.maintenanceCostRatio/100.0);

    let overallCostsData = new Array<Array<number>>();

    for (i = 1; i <= last; i++) {

        let totalCost = currentRentCostPerYear 
          + currentMaintenanceCostPerYear 
          + currentElectricityCostPerYear 
          + currentGasolineCostPerYear;
        
        let lineOfOverallCosts = new Array();

        lineOfOverallCosts.push(Math.round(currentRentCostPerYear));
        lineOfOverallCosts.push(Math.round(currentElectricityCostPerYear));
        lineOfOverallCosts.push(Math.round(currentGasolineCostPerYear));
        lineOfOverallCosts.push(Math.round(currentMaintenanceCostPerYear));
        lineOfOverallCosts.push(Math.round(totalCost));

        overallCostsData.push(lineOfOverallCosts);

        rentCostPerYearData.push(Math.round(currentRentCostPerYear));
        rentElectPerYearData.push(Math.round(currentElectricityCostPerYear));
        rentGasolinePerYearData.push(Math.round(currentGasolineCostPerYear));
        rentMaintenancePerYearData.push(Math.round(currentMaintenanceCostPerYear));
        rentTotalCostPerYearData.push(Math.round(totalCost));
        
        currentRentCostPerYear = currentRentCostPerYear * (1 + (rentHU.costEvolution / 100));
        currentMaintenanceCostPerYear = currentRentCostPerYear * (rentHU.maintenanceCostRatio / 100.0);
        currentElectricityCostPerYear = currentElectricityCostPerYear * (1 + (energyHypothesis.kwhPriceEvol / 100));
        currentGasolineCostPerYear = currentGasolineCostPerYear * (1 + (energyHypothesis.gasolinePriceEvol / 100));
    }

    this.rentResults.rentPerYearSerie= new Serie(
        'Loyer',
        rentCostPerYearData,
        'Location'
    );

    this.rentResults.elecPerYearSerie = new Serie(
        'Electricité',
        rentElectPerYearData,
        'Location'
    );

    this.rentResults.gasolinePerYearSerie  =  new Serie(
        'Carburant',
        rentGasolinePerYearData,
        'Location'
    );

    this.rentResults.maintenanceSerie =  new Serie(
        'Entretien',
        rentMaintenancePerYearData,
        'Location'
    );

    this.rentResults.totalCostPerYearSerie =  new Serie(
        'Σ',
        rentTotalCostPerYearData,
        'Location'
    );

    this.rentResults.overallCostsData = overallCostsData;
    // *ngFor="let hero of heroes"
  }

  computeLoan(price:number,loanHypo:LoanHypothesis):number {
    
    let realRate = loanHypo.loanInsuranceRate + loanHypo.loanRateWithoutInsurance;
    let starter = Math.round((loanHypo.loanStarterRatio / 100) * price);
    let loanValue = Math.round(price - starter);

    // Capital emprunté * (TEG/12)
    var C = loanValue;
    var t = (realRate / 100) / 12;
    var n = loanHypo.durationInYear* 12;
    var m = (C * t);
    m = m / (1 - (1 / Math.pow((1 + t), n)));    
    return Math.round(m * 12);
};

monthly(value:number):number{
 return Math.round((value/12));
}

  computeBuyData() {
    
        let energyHypothesis = this.simulation.energyHypothesis;    
        let buy = this.simulation.buyResults;
    
        let last = this.simulation.duration;
        let surface = this.simulation.surface;
        let i = 1;
        let series = new Array();
    
        let categories = new Array();
        // Calcul des évolutions pour la location
        let buyCase = this.simulation.buyCase;
        let buyHU = buyCase.housingUnit;
        
        let buyCostPerYearData = new Array();
        let buyCouncilTaxPerYearData = new Array();
        let buyLandTaxPerYearData = new Array();
        let buyElectPerYearData = new Array();
        let buyGasolinePerYearData = new Array();
        let buyMaintenancePerYearData = new Array();
        let buyTotalCostPerYearData = new Array();
        
        //buyCase.loan.compute(buyCase.housingUnit.cost);
        buyCase.housingUnit.cost = buyHU.squareMeterPrice*surface;
        let currentBuyCostPerYear = this.computeLoan(buyCase.housingUnit.cost,buyCase.loan);
        let currentBuyLandTaxPerYear = buyHU.landTax;
        let currentBuyCouncilTaxPerYear = buyHU.councilTax;
        let currentElectricityCostPerYear = surface * buyHU.energyDiagnosis * energyHypothesis.kwhPrice ;
        let currentGasolineCostPerYear = ((buyHU.impliedKmsPerYear / 100.0 ) * energyHypothesis.gasolineConsumptionPer100Km) * energyHypothesis.gasolinePrice ;
        let currentMaintenanceCostPerYear = buyCase.housingUnit.cost  * (buyHU.maintenanceCostRatio/100.0);
    
        let overallCostsData = new Array<Array<number>>();
    
        for (i = 1; i <= last; i++) {
    
            let totalCost = currentBuyCostPerYear 
                + currentBuyCouncilTaxPerYear
                + currentBuyLandTaxPerYear
                + currentMaintenanceCostPerYear 
                + currentElectricityCostPerYear 
                + currentGasolineCostPerYear;
            
            let lineOfOverallCosts = new Array();
    
            lineOfOverallCosts.push(Math.round(currentBuyCostPerYear));
            lineOfOverallCosts.push(Math.round(currentBuyLandTaxPerYear));
            lineOfOverallCosts.push(Math.round(currentBuyCouncilTaxPerYear));            
            lineOfOverallCosts.push(Math.round(currentElectricityCostPerYear));
            lineOfOverallCosts.push(Math.round(currentGasolineCostPerYear));
            lineOfOverallCosts.push(Math.round(currentMaintenanceCostPerYear));
            lineOfOverallCosts.push(Math.round(totalCost));
    
            overallCostsData.push(lineOfOverallCosts);
    
            buyCostPerYearData.push(Math.round(currentBuyCostPerYear));
            buyCouncilTaxPerYearData.push(Math.round(currentBuyLandTaxPerYear));
            buyLandTaxPerYearData.push(Math.round(currentBuyCouncilTaxPerYear));
            buyElectPerYearData.push(Math.round(currentElectricityCostPerYear));
            buyGasolinePerYearData.push(Math.round(currentGasolineCostPerYear));
            buyMaintenancePerYearData.push(Math.round(currentMaintenanceCostPerYear));
            buyTotalCostPerYearData.push(Math.round(totalCost));
                        
            //currentMaintenanceCostPerYear = currentMaintenanceCostPerYear * (buyHU.maintenanceCostRatio / 100.0);
            currentElectricityCostPerYear = currentElectricityCostPerYear * (1 + (energyHypothesis.kwhPriceEvol / 100));
            currentGasolineCostPerYear = currentGasolineCostPerYear * (1 + (energyHypothesis.gasolinePriceEvol / 100));
            currentBuyLandTaxPerYear = currentBuyLandTaxPerYear * (1 + (buyHU.landTaxEvolution / 100));
            currentBuyCouncilTaxPerYear = currentBuyCouncilTaxPerYear * (1 + (buyHU.councilTaxEvolution / 100));
        }
    
        this.buyResults.buyPerYearSerie= new Serie(
            'Remboursement',
            buyCostPerYearData,
            'Achat'
        );
        this.buyResults.landTaxPerYearSerie = new Serie(
            'Taxe foncière',
            buyLandTaxPerYearData,
            'Achat'
        );
        this.buyResults.councilTaxPerYearSerie= new Serie(
            'Copropriété',
            buyCouncilTaxPerYearData,
            'Achat'
        );
    
        this.buyResults.elecPerYearSerie = new Serie(
            'Electricité',
            buyElectPerYearData,
            'Achat'
        );
    
        this.buyResults.gasolinePerYearSerie  =  new Serie(
            'Carburant',
            buyGasolinePerYearData,
            'Achat'
        );
    
        this.buyResults.maintenanceSerie =  new Serie(
            'Entretien',
            buyMaintenancePerYearData,
            'Achat'
        );
    
        this.buyResults.totalCostPerYearSerie =  new Serie(
            'Σ',
            buyTotalCostPerYearData,
            'Achat'
        );
    
        this.buyResults.overallCostsData = overallCostsData;
        // *ngFor="let hero of heroes"
    }

    compute() {    
        this.computeRentData();
        this.computeBuyData();  
    };

}