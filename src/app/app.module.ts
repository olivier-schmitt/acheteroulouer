import { NgModule }      from '@angular/core';
import { RouterModule }   from '@angular/router';

import { SimulatorModule } from './simulator/simulator.module';
import { SimulateModule } from './simulate/simulate.module';

import { MainModule } from './main/main.module';
import { MainComponent } from "./main/main.component";

import {HypothesisService} from './service/hypothesis.service';


@NgModule({
  imports: [   
    SimulateModule,
    MainModule
   
    ],  
  providers: [ HypothesisService ],  
  bootstrap:    [ MainComponent ]
})
export class AppModule { }
