import { NgModule }      from '@angular/core';


import { HypothesisService } from './hypothesis.service';


@NgModule({   
  exports : [HypothesisService],
  declarations: [HypothesisService],
})
export class ServiceModule { }