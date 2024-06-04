import { Component, ElementRef, ViewChild,OnInit,ChangeDetectorRef } from '@angular/core';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
// import * as jspdf from 'jspdf';
import { PdfServiceService } from '../service/pdf-service.service';
import { NgForm } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { WebengageService } from '../service/webengage.service';
import { style } from '@angular/animations';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild('mobileInput') mobileInput!: ElementRef;
  mobile: string = '';
  mobileValidateMessage: any = "";
  otpValidateMessage: any = "";
  counter = 1;
  mobile2:boolean = false;
  mobile1:boolean = true;
  mobile3:boolean = false;
  otp: any = "";
  rmcode: any = "";
  rmcodeValidateMessage: any = "";
  isAssisted?: boolean;
  visitorId: any = '0';
  leadId: any = '';
  otpVerify2: string = '';
  otpVerifiedStatus2: boolean = true; 
  isTimer2: boolean=false;
  intervalId2: any;
  timeleft2: any;
  isResend2: boolean = false;
  clickedResend2:any;
  resendBtnTimer2: any;
  otpVerified: boolean = false;
  isChecked: boolean = true;
  rmdetails: any;
  continuebtn: boolean=true;
  UserDetail: any;
  cookingSlide : boolean = false;
  otpimg1:boolean=true;
  otpimg2:boolean=false;


  constructor(private pdfService: PdfServiceService,private apiService: ApiService,private router: Router,private cdr: ChangeDetectorRef, private webengageService: WebengageService){}
  ngOnInit(): void {
    this.UserDetail = JSON.parse(sessionStorage.getItem('FINAL_global_data')||'{}')
  }

  enableButton() {
    console.log('here in enable button')
    if(this.isChecked == true){
      this.isChecked = false;
    } else if(this.isChecked == false){
      this.isChecked = true;
    }
    // this.isChecked = !this.isChecked;
    this.cdr.detectChanges(); 
  }

  // numbersOnlyott($event: any) {
  //   return /^[0-9]$/.test($event.key);
  // };

  numbersOnlyott($event: any) {
    if ($event.target.value.length === 0) {
        if ($event.key === '0') {
            return false;
        }
    }
    var reg = /^[0-9]+$/;
    return (reg.test($event.key));
  };

  focusMobileInput() {
    this.continuebtn=true;
    this.otpVerified = false;
    this.isChecked=true;
    this.mobile1=true;
    this.mobile2=false;
    this.otp="";
    this.otpVerifiedStatus2=true
    this.counter--;
  }

  startTimer2() {
    clearInterval(this.intervalId2);
    this.timeleft2 = 20;
    this.isTimer2 = true;
    this.isResend2 = false;
    this.intervalId2 = setInterval(() => {
      if (this.timeleft2 === 0) {
        clearInterval(this.intervalId2);
        this.isTimer2 = false;
        if (this.clickedResend2 === this.resendBtnTimer2) {
          this.isResend2 = true;
        } else {
          this.isResend2 = true;
        }
      }
      this.timeleft2 -= 1;
    }, 1000);
  }

  resendOTP2() {
    console.log('ResendOTP2')
    this.sendOtp2();
    this.startTimer2()
    this.clickedResend2++;

  }





  createLead2() {
    let leadid = sessionStorage.getItem('leadId');
    let visitor= sessionStorage.getItem('visitorId')
    let FINAL_global_data = JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}')

    let obj = {
      
        "lead_id": leadid ? leadid :0,
        "visitor_id": FINAL_global_data.visitor_id,
        "gender":FINAL_global_data.gender,
        "member_count":FINAL_global_data.member_count,
        "annual_income":FINAL_global_data.annual_income,
        "medical_history": FINAL_global_data.medical_history,
        "international_treatment":FINAL_global_data.international_treatment,
        "maternity_cover":FINAL_global_data.maternity_cover,
        "mobileno": this.mobile,
        "members":FINAL_global_data.member

    }

    this.apiService.createLead(obj).subscribe((data:any) => {
      if(!sessionStorage.getItem('leadId')){
        sessionStorage.setItem('leadId', data['leadid'])
      }
      this.leadId = data['leadid'];
      //console.log('leadid:', this.leadId);
      this.sendOtp2();
    }, err => {
      console.log(err);
    })
  }


  sendOtp2() {

    this.webengageService.webengageTrackEvent("OTP Initiated", {
      "Platform": "health-insurance-second-opinion"
    });

    this.apiService.sendOtp({ leadid: this.leadId, mobile: this.mobile }).subscribe((data:any) => {
    }, err => {
      console.log(err);
    })
  }


  VerifyOTP2() { 
    if(this.otp.length>=6){
      this.apiService.verifyOtp({ leadid: sessionStorage.getItem('leadId'),otp: this.otp }).subscribe((data:any) => {
        if (data["success"]) {    
          this.otpVerify2 = 'OTP Verified'; 
          this.mobile3 = true;
          this.mobile2=false;
          this.counter++;
          this.otpimg1=false;
          this.otpimg2=true;
          this.continuebtn=true;
          if (this.otpVerify2) {
            document.getElementById("timer2")!.style.display = 'none';
          }
          this.isTimer2 = false; 
          this.otpValidateMessage='';
          this.otpVerifiedStatus2 = true;
          this.otpVerified = true;
          let that = this;
          setTimeout(function () {
            that.otpVerify2 = "";
          }, 5000);
          //  this.isTimer2 = false; 

          this.webengageService.webengageTrackEvent("OTP Submitted", {
            "Platform": "health-insurance-second-opinion"
          });
          
        } else {
          this.otpVerifiedStatus2 = false;
          if(this.otpVerifiedStatus2 === false){
            this.isTimer2 = false;
            // document.getElementById('timer2')!.style.display = 'none';
            this.isResend2=true;
          }
          this.otpValidateMessage='';
        }
      }, err => {
      })
    }
  }

 


  GetParameterValues(param: string) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
      var urlparam = url[i].split('=');
      if (urlparam[0] == param) {
        return urlparam[1];
      }
    }
    return
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 32) {
        const inputValue = (event.target as HTMLInputElement).value;
        if (inputValue.endsWith(' ')) {
            event.preventDefault();
        }
    }
}

toggleAssistance(assisted: boolean) {
  this.isAssisted = assisted;
}

numbersOnly($event: any) {
  if ($event.target.value.length === 0) {
      if ($event.key === '0' || $event.key === '1' || $event.key === '2' || $event.key === '3' || $event.key === '4' || $event.key === '5') {
          return false;
      }
  }
  var reg = /^[0-9]+$/;
  return (reg.test($event.key));
};

removeErrorMsg(fieldname: string) {

  if (fieldname == "mobile") {
      this.mobileValidateMessage = "";
  }

  if (fieldname == "otp") {
      this.otpValidateMessage = "";
  }
  if(fieldname == 'rmcode'){
    this.rmcodeValidateMessage = "";
  }
}


tooglevalue(){
  console.log('isAssiated',this.isAssisted) 
  if(this.isAssisted===true){
    this.continuebtn=true;
  }
  else if(this.isAssisted===false){
    this.continuebtn=false;
   this.mobile3=false;
   this.cookingSlide=true;
   sessionStorage.setItem('RMMobile', this.mobile);
    this.notAissted();
  }

  this.webengageService.webengageTrackEvent("Relationship Manager Assistance", {
    "Assigned": this.isAssisted
  });

}

notAissted(){
  var finalObject = {
    rm: 'no',
    rm_name: "",
    rm_mobile: "",
    branch_code : "",
    rm_email : "",
  }
  this.apiService.setFinalGlobalObject(finalObject);

  this.postdata({});
  this.mobile1=false;
  this.mobile2=false;
  this.mobile3=false;
  this.continuebtn=false;
  this.cookingSlide=true;
  // document.getElementById('awesome')!.style.display = 'flex';

  setTimeout(() => {
    this.router.navigateByUrl('health-insurance-second-opinion/recommendation-report');
  }, 7000);
}
async checkValidationMsgStep1(leadForm: NgForm) {
    let num = 0;
  if(this.counter == 1){
    this.mobile = leadForm.value.mobile.trim();
    if (this.isMobileWrong() == 0) {
      this.mobileValidateMessage = "invalid";
      num += 1;
  }
  
  if (!this.mobile) {
      this.mobileValidateMessage = "required";
      num += 1;
  }
  if (this.mobile && this.mobile.length != 10) {
      this.mobileValidateMessage = "lengthError";
      num += 1;
  }

  if (num === 0) {
    this.createLead2();
    this.startTimer2();
    this.otpValidateMessage='';
      this.mobileValidateMessage = '';
      this.mobile2=true;
      this.mobile1=false;
      this.continuebtn=false;
      // this.counter++;
  }
  }
  if(this.counter == 2){
    this.otp = leadForm.value.otp;
        if (!this.otp) {
        this.otpValidateMessage = "required";
        this.otpVerifiedStatus2=true
        num += 1
    }

    if(this.otpVerifiedStatus2===false){
      num+=1;
    }

    if (this.otp && this.otp.length != 6) {
      this.otpValidateMessage = "lengthError";
      this.otpVerifiedStatus2=true
      this.isTimer2 = false;
      num += 1;
    } 

    if(num === 0){
        this.otpValidateMessage='';
        this.mobile3=true;
        this.mobile2=false;
        //  this.counter++;
    }
  }
 
  if(this.counter == 3){
    if( this.isAssisted && !this.rmcode) {
      this.rmcodeValidateMessage = "required"
      num += 1;
    }else if (this.isAssisted && this.rmcode && this.rmcode.length < 5) {
      this.rmcodeValidateMessage = "lengthError";
      num += 1;
    }
  }
  if(num === 0 ){
    this.counter++;
  }
 
  if (this.counter == 4) {
    sessionStorage.setItem('RMMobile', this.mobile);

    try {
      let rmdetails = null;

      if (this.isAssisted) {
        this.webengageService.webengageTrackEvent("Relationship Manager Assistance", {
          "Assigned": this.isAssisted
        });
        
        this.onRMCodeChange().then(data => {
          rmdetails = data;
          if (rmdetails) {
            this.postdata(rmdetails);
          } else {
            this.postdata({});
          }
        }).catch(error => {
          console.log("Error occurred while fetching RM code details:", error);
          this.postdata({});
        });
      } else {

        var finalObject = {
          rm: 'no',
          rm_name: "",
          rm_mobile: "",
          branch_code : "",
          rm_email : "",
        }
        this.apiService.setFinalGlobalObject(finalObject);

        this.webengageService.webengageTrackEvent("Relationship Manager Assistance", {
          "Assigned": false
        });

        this.postdata({});
      }
      this.mobile1=false;
      this.mobile2=false;
      this.mobile3=false;
      this.continuebtn=false;
      this.cookingSlide=true;
      // document.getElementById('awesome')!.style.display = 'flex';

      setTimeout(() => {
        this.router.navigateByUrl('health-insurance-second-opinion/recommendation-report');
      }, 7000);
    } catch (error) {
      console.error('Error in checkValidationMsgStep1:', error);
    }
  }

    var finalObject2 = {
      mobile: this.mobile
    }
    this.apiService.setFinalGlobalObject(finalObject2);
  
  
 

}


postdata(rmdetails: any){
  let utm_source = this.GetParameterValues("utm_source");
  let utm_medium = this.GetParameterValues("utm_medium");
  let lead_source = this.GetParameterValues("lead_source");
  let utm_campaign = this.GetParameterValues("utm_campaign");
  var globaldata=JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}');
  var obj={
    rmdetails: rmdetails,
    Name: globaldata.name,
    Mobile: this.mobile,
    RmPayrollId:this.rmcode,
    leadid:sessionStorage.getItem('leadId'),
    Product: "Insurance Review",
    product_sub_category_c : "Health Insurance Review",
    LeadSource: utm_source ? utm_source : 'Website',
    Campaign_Name: utm_campaign ? utm_campaign : 'health_insurance_second_opinion',
    Utm_Source: utm_source ? utm_source : '',
    Utm_Medium: utm_medium ? utm_medium : '',
    Utm_Campaign: utm_campaign ? utm_campaign : 'health_insurance_second_opinion',
    journey_continuation_link:'',
    remarks_c:'',
    globaldata:globaldata.member
  }
  // sessionStorage.setItem('journey_continuation_link',obj.journey_continuation_link)
  this.apiService.pushLeadToSF(obj).subscribe((data:any)=>{
sessionStorage.setItem('crm_id',data['data'].crm_id)
sessionStorage.setItem('marketing_id',data['data'].marketing_id)
    var crmObject = {
      crm_id : sessionStorage.getItem('crm_id'),
    }
    this.apiService.setFinalGlobalObject(crmObject);
  })
}



async onRMCodeChange(): Promise<any> {
  return new Promise((resolve, reject) => {
    var obj = {
      RMCode: this.rmcode
    };

    this.apiService.rmcodedetail(obj).subscribe((res: any) => {
      var rmdetails;
      var finalObject

      if(res.success == true){
         rmdetails = {
          RMMobile: res.data.Data[0]?.RMMobile ? res.data.Data[0]?.RMMobile : (res.data.Data[0]?.SubBrokerMobile?res.data.Data[0]?.SubBrokerMobile:''),
          RMName: res.data.Data[0]?.RMName? res.data.Data[0]?.RMName: '',
          BranchCode: res.data.Data[0]?.BranchCode? res.data.Data[0]?.BranchCode : '',
          BranchName:res.data.Data[0]?.BranchName? res.data.Data[0]?.BranchName: '',
          RMEmail: res.data.Data[0]?.RMEmail ? res.data.Data[0]?.RMEmail : (res.data.Data[0]?.SubBrokerEmail?res.data.Data[0]?.SubBrokerEmail: '')
        };
        finalObject = {
          rm: 'yes',
          rm_name: res.data.Data[0].RMName? res.data.Data[0].RMName:'',
          rm_mobile: res.data.Data[0].RMMobile ? res.data.Data[0].RMMobile : (res.data.Data[0].SubBrokerMobile?res.data.Data[0].SubBrokerMobile:''),
          branch_code : res.data.Data[0].BranchCode? res.data.Data[0].BranchCode: '',
          rm_email : res.data.Data[0].RMEmail ? res.data.Data[0].RMEmail : (res.data.Data[0].SubBrokerEmail? res.data.Data[0].SubBrokerEmail: '')
        }
      } else {
         rmdetails = {
          RMMobile: '',
          RMName: '',
          BranchCode: '',
          BranchName: '',
          RMEmail: ''
        };
        finalObject = {
          rm: 'no',
          rm_name: '',
          rm_mobile: '',
          branch_code : '',
          rm_email : ''
        }
      }

      sessionStorage.setItem('rm_code',this.rmcode)

      this.apiService.setFinalGlobalObject(finalObject);


      resolve(rmdetails);
    }, error => {
      reject(error);
    });
  });
}


isMobileWrong() {
  let firstDigit = this.mobile.substr(0, 1);
  if (firstDigit != '6' && firstDigit != '7' && firstDigit != '8' && firstDigit != '9') {
      return 0;
  }
  else if (this.mobile.match(/^(\d)\1+$/g)) {
      return 0;
  }
  else {
      return 1;
  }
}
}
