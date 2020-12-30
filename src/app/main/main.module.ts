import { NgModule }      from '@angular/core';
import { RouterModule }   from '@angular/router';

import { SharedModule }  from '../shared/shared.module';
import { MainComponent }  from './main.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot([     
      {path: '', redirectTo : 'simulate', pathMatch : 'full'}
    ])
    ],
  declarations: [ MainComponent]
})
export class MainModule { }