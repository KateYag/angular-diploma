import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import { TermsComponent } from './components/terms/terms.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [ TermsComponent],
  exports: [
    TermsComponent,


  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ]
})
export class SharedModule { }
