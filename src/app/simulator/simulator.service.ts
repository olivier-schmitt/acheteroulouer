
import { Injectable } from "@angular/core";
import { Simulation } from "./simulation.model";

@Injectable()
export class Simulator {

    simulation:Simulation = new Simulation();

    constructor(){

    }
}