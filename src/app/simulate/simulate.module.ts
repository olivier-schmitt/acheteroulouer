import { NgModule }      from '@angular/core';
import { RouterModule }   from '@angular/router';
import { ReactiveFormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { SimulationComponent } from './simulation.component';
import { ResultsComponent } from "./results.component";

@NgModule({
  imports:  [ 
      BrowserModule,
      ReactiveFormsModule,
      RouterModule.forChild([
        {path: 'simulate', component : SimulationComponent},
         {path: 'results', component : ResultsComponent}
      ])
      ],  
  exports : [],
  declarations: [SimulationComponent,ResultsComponent],
})
export class SimulateModule { }