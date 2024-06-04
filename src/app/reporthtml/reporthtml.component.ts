import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { SharedDataService } from '../service/shared-data.service';

@Component({
  selector: 'app-reporthtml',
  templateUrl: './reporthtml.component.html',
  styleUrls: ['./reporthtml.component.css']
})
export class ReporthtmlComponent {
  pdfData: any;
  UserDetail: any;
  planDetail: any;
  converted_total_coverage: any;
  Base_amount: any;
  topUp: any;
  OtherPlan_details:any;
  output_2: any;
  output_3: any;
  rm_name:any;
  rm_mobile: any;
  rm_email: any;
  branch_code: any;
  currentTime:Date = new Date();
  constructor(private elementRef: ElementRef, private sharedDataService: SharedDataService,private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentTime = new Date();
    this.sharedDataService.data$.subscribe(data => {
      // Use data received from the first component
      if (data) {
        this.pdfData = data;
        this.rm_name = data.rm_name;
        this.rm_mobile = data.rm_mobile;
        this.rm_email = data.rm_email
        this.branch_code = data.branch_code
        this.UserDetail = data.UserDetail;
        this.planDetail  = data.PlanDetail;
        this.output_2  = data.output_2;
        this.output_3 = data.output_3;
        this.converted_total_coverage = data.converted_total_coverage;
        this.Base_amount = data.Base_amount;
        this.topUp = data.topUp;
        this.OtherPlan_details = data.OtherPlan_details?data.OtherPlan_details.map((item:any) => {
          if (item[0]?.pck === 'FatherInLaw') {
            item[0].pck = 'Father-In-Law';
          }
          if (item[0]?.pck === 'MotherInLaw') {
            item[0].pck = 'Mother-In-Law';
          }
          return item;
        }):data.OtherPlan_details;

        this.cdr.detectChanges();
      }
    });
  }

  calculateBaseTopUp(familyCombination:any,output_2:any, type:string){
    const Total_coverage = parseFloat(output_2);
    const converted_total_coverage = Total_coverage * 100000; 
    if(familyCombination!==1 && familyCombination!==2 && familyCombination!==5 && familyCombination!==6){
      var Base_amount = 1000000
      var topUp = converted_total_coverage - Base_amount;
      if(type=="base"){
        return Base_amount
      }
      else return topUp;
    }else{
      var Base_amount = 500000
      var topUp = converted_total_coverage - Base_amount;
      if(type=="base"){
        return Base_amount
      }
      else return topUp;
    }
  }
  
  getInnerHtml(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
