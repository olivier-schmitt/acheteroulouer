
import { BuyHypothesis } from "./buy.model";
import { RentHypothesis } from "./rent.model";
import { HousingUnitHypothesis } from "./housingunit.model";
import { EnergyHypothesis } from "./energy.model";
import { BuyResults } from "./buyresults.model";
import { RentResults } from "./rentresults.model";

export class Simulation {

    duration:number = 25;
    surface:number = 90;
    savingsReturn:number = 1;

    energyHypothesis:EnergyHypothesis = new EnergyHypothesis();
    housingUnit:HousingUnitHypothesis = new HousingUnitHypothesis();
    
    buyCase:BuyHypothesis = new BuyHypothesis();
    rentCase:RentHypothesis = new RentHypothesis();

    buyResults: BuyResults = new BuyResults();
    rentResults: RentResults = new RentResults();
}