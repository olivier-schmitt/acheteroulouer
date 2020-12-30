import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BuyHypothesis } from "./buy.model";
import { RentHypothesis } from "./rent.model";
import { Simulation } from "./simulation.model";
import { Simulator } from "./simulator.service";

@NgModule({
  imports: [BrowserModule,RouterModule],
  exports : [BuyHypothesis,RentHypothesis,Simulation,Simulator]
})
export class SimulatorModule { }