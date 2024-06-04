import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LeadFormComponent } from '../lead-form/lead-form.component';
import { ReviewComponent } from '../review/review.component';
import { PdfContentComponent } from '../pdf-content/pdf-content.component';
import { MemberFormComponent } from '../member-form/member-form.component';
import { ReportComponent } from '../report/report.component';
import { ReporthtmlComponent } from '../reporthtml/reporthtml.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'basic-details',component:LeadFormComponent},
  {path:'review',component:ReviewComponent},
  {path:'recommendation-report',component:PdfContentComponent},
  {path:'lifestyle-details',component:MemberFormComponent},
  {path:'verification',component:ReportComponent},
  {path:'test',component:ReporthtmlComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
