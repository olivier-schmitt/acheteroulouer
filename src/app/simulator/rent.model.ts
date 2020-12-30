
import { HousingUnitHypothesis } from "./housingunit.model";

export class RentHypothesis {

    kilometerPerYear:number = 15000;   
    housingUnit:HousingUnitHypothesis = new HousingUnitHypothesis();
    agencyCost:number = 800;
    garanteeCost:number =  800;
    miscCosts:number =  0;
    
    visible:boolean = false;
    returns:boolean = false;
    costsVisible :boolean =  false;
    savingsVisible :boolean =  false;

    constructor(){
        this.housingUnit.squareMeterPrice = 12;
        this.housingUnit.maintenanceCostRatio = 2;
    }
}