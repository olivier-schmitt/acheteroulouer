

import { LoanHypothesis } from "./loan.model";
import { HousingUnitHypothesis } from "./housingunit.model";

export class BuyHypothesis {

    loan:LoanHypothesis = new LoanHypothesis();
    housingUnit:HousingUnitHypothesis = new HousingUnitHypothesis();
    notaryTaxRate:number =  7.0;
    agencyTaxRate:number =  4.0;
    garanteeCost:number =  0.94;
    miscCosts:number =  0;
    
    
    visible:boolean = false;
    returns:boolean = false;
    costsVisible :boolean =  false;
    savingsVisible :boolean =  false;

    constructor(){
        this.housingUnit.squareMeterPrice = 1800;
    }
}