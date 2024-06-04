import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestlifeComponent } from './testlife/testlife.component';

const routes: Routes = [
  {path:'',component:TestlifeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LifeinsuranceRoutingModule { }
