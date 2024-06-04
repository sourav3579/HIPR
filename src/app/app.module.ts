import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeadFormComponent } from './lead-form/lead-form.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { ReviewComponent } from './review/review.component';
import { MemberFormComponent } from './member-form/member-form.component';
import { PdfContentComponent } from './pdf-content/pdf-content.component';
import { PremiumRangeFormatPipe } from './premium-range-format.pipe';
import { ReporthtmlComponent } from './reporthtml/reporthtml.component';
import { NameFormatterPipe } from './pipe/name-formatter.pipe';
import { TestparentComponent } from './testparent/testparent.component';
import { AlphaOnlyDirective } from './alpha-only.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LeadFormComponent,
    HomeComponent,
    ReportComponent,
    ReviewComponent,
    MemberFormComponent,
    PdfContentComponent,
    PremiumRangeFormatPipe,
    ReporthtmlComponent,
    NameFormatterPipe,
    TestparentComponent,
    AlphaOnlyDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [PremiumRangeFormatPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
