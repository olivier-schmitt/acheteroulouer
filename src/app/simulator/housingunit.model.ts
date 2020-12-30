

export class HousingUnitHypothesis {

    surface:number = 90;
    cost:number;
    costEvolution:number = 0.5;
    energyDiagnosis:number =  230;
    impliedKmsPerYear:number = 15000;

    maintenanceCostRatio:number = 1;
    squareMeterPrice:number;

    managingAgentPerSquareCost:number =  23;
    managingAgentCostEvolution:number =  2;

    councilTax:number = 961;
    councilTaxEvolution:number = 1.0
    landTax:number = 961;
    landTaxEvolution:number = 1.0;
}
