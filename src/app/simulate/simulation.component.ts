import { Component,OnInit } from '@angular/core';
import { FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';
import { Router } from "@angular/router";
import {Simulation} from '../simulator/simulation.model';
import {HypothesisService} from '../service/hypothesis.service';

@Component({
  moduleId : module.id,
  selector: 'aol-simulation',  
  templateUrl : 'simulation.html',
  styleUrls : ['simulation.css']
})
export class SimulationComponent implements OnInit  {

  simulationForm: FormGroup;
  simulation: Simulation = new Simulation();

  constructor(
    private _router : Router,
    private _fb:FormBuilder, 
    private _hypothesisService: HypothesisService) {}

  
  ngOnInit(): void {
    let previousSimulation = localStorage.getItem("acheteroulouer.current");
    if(previousSimulation != null){
      this.simulation = JSON.parse(previousSimulation);
    }
    
    
    let energy = this.simulation.energyHypothesis;    
    let buy = this.simulation.buyCase;    
    let rent = this.simulation.rentCase;
    
    rent.housingUnit.cost = rent.housingUnit.squareMeterPrice * this.simulation.surface;
    buy.housingUnit.cost = buy.housingUnit.squareMeterPrice * this.simulation.surface;
    
    this.simulationForm = this._fb.group({
      
      commonsControls:this._fb.group({        
        duration:[this.simulation.duration,[Validators.required] ],
        surface:[this.simulation.surface,[Validators.required] ],
        gasolineConsumptionPer100Km : [energy.gasolineConsumptionPer100Km,[Validators.required] ],
        savingsReturn: [this.simulation.savingsReturn,[Validators.required] ],
      }),
      
      energyControls:this._fb.group({        
        kwhPrice : [energy.kwhPrice,[Validators.required] ],
        kwhPriceEvol : [energy.kwhPriceEvol,[Validators.required] ],
        gasolinePrice : [energy.gasolinePrice,[Validators.required] ],
        gasolinePriceEvol : [energy.gasolinePriceEvol,[Validators.required] ]
      }),
      
      buyControls:this._fb.group({        
        squareMeterPrice :  [buy.housingUnit.squareMeterPrice,[Validators.required] ],
        cost:  [buy.housingUnit.cost],   
        costEvolution:  [buy.housingUnit.costEvolution],
        notaryTaxRate:  [buy.notaryTaxRate,[Validators.required] ],
        agencyTaxRate:  [buy.agencyTaxRate,[Validators.required] ],
        bankCaseCost:  [buy.loan.bankCaseCost,[Validators.required] ],
        garanteeCost:  [buy.garanteeCost,[Validators.required] ],
        miscCosts:  [buy.miscCosts,[Validators.required] ],
        loanInsuranceRate:  [buy.loan.loanInsuranceRate,[Validators.required] ],
        loanRateWithoutInsurance:  [buy.loan.loanRateWithoutInsurance,[Validators.required] ],
        loanDuration:  [buy.loan.loanDuration,[Validators.required] ],
        loanStarterRatio:  [buy.loan.loanStarterRatio,[Validators.required] ],
        energyDiagnosis:  [buy.housingUnit.energyDiagnosis,[Validators.required] ],
        impliedKmsPerYear:  [buy.housingUnit.impliedKmsPerYear,[Validators.required] ]
        
      }),
      
      rentControls:this._fb.group({        
        squareMeterPrice :  [rent.housingUnit.squareMeterPrice,[Validators.required] ],
        cost:  [rent.housingUnit.cost],
        costEvolution:  [rent.housingUnit.costEvolution],   
        maintenanceCostRatio: [rent.housingUnit.maintenanceCostRatio ],
        agencyCost:  [rent.agencyCost,[Validators.required] ],
        miscCosts:  [rent.miscCosts,[Validators.required] ],
        garanteeCost:  [rent.garanteeCost,[Validators.required] ],
        energyDiagnosis:  [rent.housingUnit.energyDiagnosis,[Validators.required] ],
        impliedKmsPerYear:  [rent.housingUnit.impliedKmsPerYear,[Validators.required] ]
      })
    });    

    
  }

   reset():void{
     /*
      this.simulationForm.patchValue({
        'commonsControls.duration':20
      });
      */
      this.simulation = new Simulation();
     
  }

  compute():void{
      let jsonStream = JSON.stringify(this.simulation);
      localStorage.setItem("acheteroulouer.current", jsonStream);
      this._router.navigate(['/results']);
  }
}