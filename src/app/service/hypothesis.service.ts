import { Injectable } from '@angular/core';
import {Simulation} from '../simulator/simulation.model'

@Injectable()
export class HypothesisService {
  
  simulation:Simulation;

  setData(data:Simulation): void {
    this.simulation = data;
  }

  getData(): Simulation {
    return this.simulation;
  }
}