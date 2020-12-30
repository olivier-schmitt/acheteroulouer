import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule }   from '@angular/router';
import { NavbarComponent }  from './navbar.component';
import { AboutComponent }  from './about.component';
import { HelpComponent }  from './help.component';

@NgModule({
  imports: [BrowserModule, RouterModule.forChild([
        {path: 'about', component : AboutComponent},
        {path: 'help', component : HelpComponent}        
      ])],
  declarations: [ NavbarComponent,AboutComponent,HelpComponent],
  exports : [NavbarComponent]
})
export class SharedModule { }