import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LifeinsuranceRoutingModule } from './lifeinsurance-routing.module';
import { TestlifeComponent } from './testlife/testlife.component';


@NgModule({
  declarations: [
    TestlifeComponent
  ],
  imports: [
    CommonModule,
    LifeinsuranceRoutingModule
  ]
})
export class LifeinsuranceModule { }
