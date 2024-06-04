import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LeadFormComponent } from './lead-form/lead-form.component';
import { ReportComponent } from './report/report.component';
import { ReviewComponent } from './review/review.component';
import { PdfContentComponent } from './pdf-content/pdf-content.component';
import { ReporthtmlComponent } from './reporthtml/reporthtml.component';
import { MemberFormComponent } from './member-form/member-form.component';
import { TestparentComponent } from './testparent/testparent.component';

const routes: Routes = [
  // {path: '', component: HomeComponent},
  // {path: 'home', component: HomeComponent},
  // {path: 'basic-details', component: LeadFormComponent},
  // {path:'review',component:ReviewComponent},
  // {path:'recommendation-report',component:PdfContentComponent},
  // {path:'lifestyle-details',component:MemberFormComponent},
  // {path:'verification', component:ReportComponent},
  // {path:'test', component:ReporthtmlComponent}
  { path:'health-insurance-second-opinion',loadChildren: () => import('./insurance/insurance.module').then(m => m.InsuranceModule)},
  { path:'life-insurance',loadChildren: () => import('./lifeinsurance/lifeinsurance.module').then(m => m.LifeinsuranceModule)},
  // {path:'',component:TestparentComponent}
  {path:'',redirectTo:'health-insurance-second-opinion',pathMatch: "full"},
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
