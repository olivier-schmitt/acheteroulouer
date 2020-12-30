import {Serie} from '../simulator/serie.model';

export class BuyResults {

    buyPerYearSerie:Serie;
    landTaxPerYearSerie:Serie;
    councilTaxPerYearSerie:Serie;
    elecPerYearSerie:Serie;
    gasolinePerYearSerie:Serie;
    maintenanceSerie:Serie;
    totalCostPerYearSerie:Serie;
    overallCostsData: Array<Array<number>>;

    constructor(){}
}