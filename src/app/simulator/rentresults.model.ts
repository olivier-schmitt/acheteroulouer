import {Serie} from '../simulator/serie.model';

export class RentResults {

    rentPerYearSerie:Serie;
    elecPerYearSerie:Serie;
    gasolinePerYearSerie:Serie;
    maintenanceSerie:Serie;
    totalCostPerYearSerie:Serie;
    overallCostsData: Array<Array<number>>;

    constructor(){        
    }

}