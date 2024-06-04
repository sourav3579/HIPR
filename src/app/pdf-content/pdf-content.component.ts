import { DOCUMENT } from '@angular/common';

import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { PdfServiceService } from '../service/pdf-service.service';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import {ReporthtmlComponent} from'../reporthtml/reporthtml.component'
import { SharedDataService } from '../service/shared-data.service';
import { WebengageService } from '../service/webengage.service';
import { PremiumRangeFormatPipe } from '../premium-range-format.pipe';
declare var $: any;

@Component({
  selector: 'app-pdf-content',
  templateUrl: './pdf-content.component.html',
  styleUrls: ['./pdf-content.component.css']
})
export class PdfContentComponent implements OnInit {
  dynamicData: any;
  @ViewChild (ReporthtmlComponent,{static:false}) reporthtml!:ReporthtmlComponent


  planObj:any;
  planDetail:any[]=[];
  otherPlans: boolean = false
  OtherPlan_details:any;
  Base_amount:any;
  topUp:any;
  UserDetail:any;
  Members:any;
  MemberIcons:any;
  converted_total_coverage:any;
  iconIds:any;
  insureOptions:any;
  sessionStorageData:any
  iconDetails: string[] = [];
  rm_name : string ='';

  sonCount: number = 0;
  daughterCount: number = 0
  whatsappNumber: any;
  mobileValidateMessage: string='';
  closeDiv: boolean =false;
  selectedOption: string='Morning(09:30am - 12pm)';
  options: { value: string, label: string }[];
  show_loader:boolean = false;
  name: string ='';
  total_assuredval:any;
  finalPremium_Range1 : any;
  finalPremium_Range2:any;
  premiumRange:any
  
  planTYpe:any;
  objPlans: any[] = [];
  responseArray: any[] = [];
  finaldata:any;
  showPlanCards:boolean=false;
  plantopUp:any;
  planBase_amount:any;
  responses:any;
  templanss:any;
  getplan_outputs:any;
  TotalBaseTopup={'baseAmount':0,'totalTopUp':0}; 
  coverValue1: any;
  coverValue2: any;
  coverValue3: any;

  otherPlanCoverValues:any ={};
  showSpinner: boolean=true;
  
  constructor(@Inject(DOCUMENT) private document: Document, private premiumRangeFormat: PremiumRangeFormatPipe,private pdfService: PdfServiceService, private router: Router, private service:ApiService, private sharedDataService: SharedDataService, private webengageService: WebengageService){
    this.options = [
      { value: this.generateOptionValue("09:30:00"), label: 'Morning(09:30am - 12pm)' },
      { value: this.generateOptionValue("12:00:00"), label: 'Afternoon(12pm - 3pm)' },
      { value: this.generateOptionValue("15:00:00"), label: 'Late Afternoon(3pm - 5pm)' },
      { value: this.generateOptionValue("17:00:00"), label: 'Evening(5pm -8pm)' }
    ];
    this.selectedOption = this.options[0].value;
  }
  
  generateOptionValue(time: string): string {
    const today = new Date().toISOString().slice(0, 10);
    return `${today} ${time}`;
  }
  
  ngOnInit(){
    // if (storedMobileNumber) {
    //   this.whatsappNumber = storedMobileNumber.substring(0, 4) + '-' +
    //   storedMobileNumber.substring(4, 7) + '-' +
    //   storedMobileNumber.substring(7);
    // }
    const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

    accordionItemHeaders.forEach((accordionItemHeader: Element) => {
      const headerElement = accordionItemHeader as HTMLElement;
      headerElement.addEventListener("click", (event) => { 
        headerElement.classList.toggle("active");
        const accordionItemBody = headerElement.nextElementSibling as HTMLElement;
        if (headerElement.classList.contains("active")) {
          accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
        } else {
          accordionItemBody.style.maxHeight = '0';
        }
      });
    });

    setTimeout(() => {
      var accordion = (function () { 

        var $accordion = $('.js-accordion');
        var $accordion_header = $accordion.find('.closetab');
        var $accordion_item = $('.js-accordion-item');

        // default settings 
        var settings = {
            // animation speed
            speed: 400,

            // close all other accordion items if true
            oneOpen: false
        };

        return {
          // pass configurable object literal
          init: function ($settings: any) {
            $accordion_header.on('click', (event:any) => {
              var $header = $(event.currentTarget); // Get the clicked accordion header
              accordion.toggle($header); // Toggle the corresponding accordion content
              
              // Toggle the text of the clicked accordion's "showtext" element
              var $showText = $header.find('.showtext');
              var showtxt = $showText.text();
              $showText.text(showtxt === 'Show' ? 'Hide' : 'Show');
          });
              $.extend(settings, $settings);
              // ensure only one accordion is active if oneOpen is true
              if (settings.oneOpen && $('.js-accordion-item.active').length > 1) {
                  $('.js-accordion-item.active:not(:first)').removeClass('active');
                  
              }
              // reveal the active accordion bodies
              $('.js-accordion-item.active').find('> .js-accordion-body').show();
          },
          toggle: function ($this: any) {
              var $accordionItem = $this.closest('.js-accordion-item');
              if (settings.oneOpen && !$accordionItem.hasClass('active')) {
                  $accordion_item.removeClass('active');
                  $accordion_item.find('.js-accordion-body').slideUp();
              }
              // show/hide the clicked accordion item
              $accordionItem.toggleClass('active');
              $accordionItem.find('.js-accordion-body').stop().slideToggle(settings.speed);
          }
      };
    })();
    
    $(document).ready(function () {
        accordion.init({ speed: 300, oneOpen: true });
    });

    $('#copyemailid').click( () => {
      // alert(this)
      $('#copyemailid').hide();
      $('#copied_txt').show()
      reverse()
    })
    
    $('#copynumber').click( () => {
      // alert(this)
      $('#phoneid').hide();
      $('#phoneidicon').show();
      reverse2()
    })

    }, 2000)

    function reverse() {
      setTimeout(() => {
        $('#copyemailid').show();
        $('#copied_txt').hide()
      },2500)
     
    }
    
    function reverse2() {
      setTimeout(() => {
        $('#phoneid').show();
        $('#phoneidicon').hide();
      },2500)
     
    }

    
  $('#sharepopclose').click(function () {
    // $('#sharesubmit').removeAttr('disabled')
  })

 
    this.planObj = JSON.parse(sessionStorage.getItem('FINAL_global_data')||'{}');
    this.UserDetail = JSON.parse(sessionStorage.getItem('FINAL_global_data')||'{}')
    this.rm_name = this.UserDetail.rm_name

    this.name = this.UserDetail.name;
    const storedMobileNumber = this.UserDetail.mobile;
    this.whatsappNumber = storedMobileNumber
    this.sonCount = this.UserDetail.son_count;
    this.daughterCount = this.UserDetail.daughter_count;

    this.iconIds = this.UserDetail['iconIds']
    this.iconDetails = this.UserDetail['iconDetails']
    this.service.getplandetails(this.planObj).subscribe((res:any)=>{
      this.planDetail =res.data
      if(this.planDetail){
      const familyCombination= this.planDetail[0][0].family_combination

      //TotalCoverage Conversion-------
      const Total_coverage = parseFloat(this.planDetail[0][0].output_2);
      sessionStorage.setItem('sum_assured', this.planDetail[0][0].output_2);
      this.converted_total_coverage = Total_coverage * 100000; 

      //check for COMB plan & IND plan
      if(familyCombination!==1 && familyCombination!==2 && familyCombination!==5 && familyCombination!==6){
        this.Base_amount = 1000000
        this.topUp = this.converted_total_coverage- this.Base_amount;

      }else{
        this.Base_amount = 500000
        this.topUp = this.converted_total_coverage- this.Base_amount;
      }

        if(this.planDetail.length > 1){
          this.OtherPlan_details = this.planDetail.slice(1)
          this.otherPlans = true;
        } else{
          this.otherPlans = false;
        }

        var data = {
          "UserDetail": this.UserDetail,
          "planDetail": this.planDetail,
          "rm_name": this.UserDetail.rm_name,
          "rm_mobile": this.UserDetail.rm_mobile,
          "rm_email": this.UserDetail.rm_email,
          "branch_code": this.UserDetail.branch_code,
          "output_2": this.planDetail[0][0]?.output_2,
          "output_3": this.planDetail[0][0]?.output_3,
          "converted_total_coverage": this.converted_total_coverage,
          "Base_amount": this.Base_amount,
          "topUp": this.topUp,
          "OtherPlan_details": this.OtherPlan_details,
        }
        sessionStorage.setItem('planoutputs',JSON.stringify(data))
        this.getplan_outputs = JSON.parse(sessionStorage.getItem('planoutputs')||'{}')
      
        //process for IC_plan crads
        this.processData()
        var totalOutput2 = 0;
        data.planDetail.forEach(function(plan) {
            totalOutput2 += parseFloat(plan[0].output_2);
        });
        this.total_assuredval= totalOutput2+" "+"Lacs"
        sessionStorage.setItem('Total SumAssured',this.total_assuredval)

        //logic for common premiumRange ---
        var PremiumDetailsArr = JSON.parse(sessionStorage.getItem('planoutputs')||'{}')
        this.finalPremium_Range1 = this.calculateFinalPremium(PremiumDetailsArr.planDetail);
        this.TotalBaseTopup = this.calculateFinalBaseTopUp(PremiumDetailsArr.planDetail);
        this.finalPremium_Range2 = this.finalPremium_Range1+5000;
        this.premiumRange = `${this.finalPremium_Range1}-${this.finalPremium_Range2}`;

        this.sendDataToOtherComponent(data)

      }else{
        console.log("NO data found...")
      }

      this.webengageService.webengageTrackEvent("Report Generated", {
        "Ideal Total Coverage": this.total_assuredval,
        "Average annual premium": this.premiumRangeFormat.transform(this.premiumRange),
        "Health cover Base Amount": this.TotalBaseTopup.baseAmount,
        "Top-up": this.TotalBaseTopup.totalTopUp,
        "Health Add Ons": "Pre and Post-Hospitalization Coverage, Hospitalization Expenses, Pre-existing Diseases, No Claim Bonus, Free Health Check-up",
        "Report Link":"",
        "Top Recommended Plans": ""
      });

    }) 
    
  }

  //format number (20000000 => 20,00,0000)
  formatNumber(number: number): string {
    const formatter = new Intl.NumberFormat('en-IN');
    return formatter.format(number);
}
  ///plan crads processs
  async processData() {
    try {
      const userid = sessionStorage.getItem('leadId');
      const campaignLogs:any[] = []; 
      const objPlanArray: any[] = [];
      this.planDetail.forEach((dataArray: any) => {
        const plan = dataArray[0];
        const members= plan.combomembers;
        const familyCombination=dataArray[0].family_combination;
        const Total_coverage = parseFloat(plan.output_2);
        const converted_total_coverage = Total_coverage * 100000; 
        if(familyCombination!==1 && familyCombination!==2 && familyCombination!==5 && familyCombination!==6){
          this.planTYpe="F",
          this.planBase_amount = 1000000,
          this.plantopUp = converted_total_coverage - this.planBase_amount;
        }
        else{
          this.planTYpe="I",
          this.planBase_amount = 500000,
          this.plantopUp = converted_total_coverage - this.planBase_amount;
        }
        var randomNumber = Math.floor(100000 + Math.random() * 900000);
        const campaign_lead= "BCL_" + randomNumber;
        const obj_plan = {
          "name": this.name,
          "gender": this.UserDetail.gender == "Male" ? "M" : "F",
          "mobile": this.UserDetail.mobile,
          "section": "health",
          "section_top_up": "top_up",
          "params": {
              "journey_type": "B2C",
              "sum_insured_range": this.planBase_amount,
              "deductible_range": this.planBase_amount,
              "sum_insured_deductible":this.plantopUp,
              "health_companies": {
                  [plan.base_ic1_alias]: [this.planTYpe == "I" ? plan.baseplan_1_PC_IndV : plan.baseplan_1_PC_Family],
                  // [plan.base_ic2_alias]: [this.planTYpe == "I" ? plan.baseplan_2_PC_IndV : plan.baseplan_2_PC_Family],
                  // [plan.base_ic3_alias]: [this.planTYpe == "I" ? plan.baseplan_3_PC_IndV : plan.baseplan_3_PC_Family],
                  [plan.base_ic2_alias === plan.base_ic1_alias ? `${plan.base_ic2_alias}_2` : plan.base_ic2_alias]: [this.planTYpe == "I" ? plan.baseplan_2_PC_IndV : plan.baseplan_2_PC_Family],
                  [plan.base_ic3_alias === plan.base_ic1_alias || plan.base_ic3_alias === plan.base_ic2_alias ? `${plan.base_ic3_alias}_3` : plan.base_ic3_alias]: [this.planTYpe == "I" ? plan.baseplan_3_PC_IndV : plan.baseplan_3_PC_Family]
              },
              "top_up_companies": {
                [plan.topup_ic1_alias]: [this.planTYpe == "I" ? plan.topupplan_1_PC_IndV : plan.topupplan_1_PC_Family],
                [plan.topup_ic2_alias === plan.topup_ic1_alias ? `${plan.topup_ic2_alias}_2` : plan.topup_ic2_alias]: [this.planTYpe == "I" ? plan.topupplan_2_PC_IndV : plan.topupplan_2_PC_Family],
                [plan.topup_ic3_alias === plan.topup_ic1_alias || plan.topup_ic3_alias === plan.topup_ic2_alias ? `${plan.topup_ic3_alias}_3` : plan.topup_ic3_alias]: [this.planTYpe == "I" ? plan.topupplan_3_PC_IndV : plan.topupplan_3_PC_Family]
              }
          },
          "type": "new",
          "from_campaign_page": "Yes",
          "members": members.split(',').map((member: string) => ({
            type: member,
            age: this.UserDetail.member.find((detail: any) => detail.memberType === member).age  // You need to fill in the correct age here
        })),
          "plan_type": this.planTYpe,
          "pincode": this.UserDetail.pincode,
          "campaign_lead": campaign_lead,
          "additional_fields": {
              "campaign_id": "BCL1236",
              "campaign_name": "bcl"
          }
        };

        //populate TopUpCompanies for same company_alias
        let updatedTopUpCompanies: { [key: string]: string[] } = {};
        for (const key in obj_plan.params.top_up_companies) {
            const newKey = key.replace(/_2$|_3$/, '');
            if (!updatedTopUpCompanies[newKey]) {
                updatedTopUpCompanies[newKey] = [];
            }
            updatedTopUpCompanies[newKey].push(...obj_plan.params.top_up_companies[key]);
        }
        obj_plan.params.top_up_companies = updatedTopUpCompanies;

        //populate HealthCompanies for same company_alias
        let updatedBaseCompanies: { [key: string]: string[] } = {};
        for (const key in obj_plan.params.health_companies) {
            const newKey = key.replace(/_2$|_3$/, '');
            if (!updatedBaseCompanies[newKey]) {
              updatedBaseCompanies[newKey] = [];
            }
            updatedBaseCompanies[newKey].push(...obj_plan.params.health_companies[key]);
        }
        obj_plan.params.health_companies = updatedBaseCompanies;
        // Push the Obj_plan object to the array
        objPlanArray.push(obj_plan);
            });

      // Array to hold all promises
      const promises = [];
      for (const item of objPlanArray) {
        // Send data_campaign and push the promise into the array
        promises.push(this.service.sendData_campaign(item).toPromise().then(response => {
          campaignLogs.push({
            userid: userid,
            campaign_Lead:item.campaign_lead,
            request: item,
            response: response
          });
          return response;
        })
        );
      }
      // Wait for all promises to resolve
      this.responses = await Promise.all(promises);
      // Process each response
      // console.log("Responses.....",this.responses);
      for (const response of this.responses) {
        console.log("DATATATTA.....", response['data']);
        this.responseArray.push(response['data']);
      }
      for (const log of campaignLogs) {
        console.log("logs.....",log);
        await this.service.Campaignlogs(log).subscribe((data:any)=>{
          console.log("this.service......",data);
        });
      }

      const finalObject = { planResp: this.responseArray };
      this.service.setFinalGlobalObject(finalObject);
      this.finaldata = JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}');
      
      this.showPlanCards=true;
        const othercards= this.finaldata.planResponse
        this.templanss= othercards.slice(1)
        this.showSpinner= false;
        
    // this.getCoverValues(1,this.planDetail[0][0].planType, this.planDetail[0][0].planType=='I'?this.planDetail[0][0].TopUp1_PD_INDV: this.planDetail[0][0].TopUp1_PD_Family, '500000')
    // this.getCoverValues(2,this.planDetail[0][0].planType, this.planDetail[0][0].planType=='I'?this.planDetail[0][0].TopUp1_PD_INDV: this.planDetail[0][0].TopUp1_PD_Family, '500000')
    // this.getCoverValues(3,this.planDetail[0][0].planType, this.planDetail[0][0].planType=='I'?this.planDetail[0][0].TopUp1_PD_INDV: this.planDetail[0][0].TopUp1_PD_Family, '500000')

    // if(this.OtherPlan_details.length > 0){
    //   for(let i = 0; i < this.OtherPlan_details.length; i++){
    //     this.getCoverValuesOtherPlan(i,1,this.OtherPlan_details[i][0]?.planType, this.OtherPlan_details[i][0]?.planType=='I'?this.OtherPlan_details[i][0]?.TopUp1_PD_INDV: this.OtherPlan_details[i][0]?.TopUp1_PD_Family, '500000')
    //     this.getCoverValuesOtherPlan(i,2,this.OtherPlan_details[i][0]?.planType, this.OtherPlan_details[i][0]?.planType=='I'?this.OtherPlan_details[i][0]?.TopUp1_PD_INDV: this.OtherPlan_details[i][0]?.TopUp1_PD_Family, '500000')
    //     this.getCoverValuesOtherPlan(i,3,this.OtherPlan_details[i][0]?.planType, this.OtherPlan_details[i][0]?.planType=='I'?this.OtherPlan_details[i][0]?.TopUp1_PD_INDV: this.OtherPlan_details[i][0]?.TopUp1_PD_Family, '500000')
    //   }
    // }
    

    } catch (error) {
      console.error('Error occurred while sending data to API:', error);
    }
  }

  getFormattedValue(value: number): string {
    const lacsValue = value / 100000;
    return `${lacsValue} Lacs`;
  }
  getFormattedValueDrop(value: number): string {
    const lacsValue = value / 100000;
    return `${lacsValue} L`;
  }
  //function for getting common PremiumRange1
  calculateFinalPremium(plans:any) {
    let totalPremium = 0;
    plans.forEach((plan:any) => {
        const premiumRange = plan[0].output_3.split('-');
        const minPremium = parseInt(premiumRange[0], 10);
        const maxPremium = parseInt(premiumRange[1], 10);
        // console.log("min",minPremium,"max",maxPremium);
        const averagePremium = (minPremium + maxPremium) / 2;
        totalPremium += averagePremium;
    });
    return totalPremium;
}

  generatePDF() {
    // this.show_loader=true;
    // var pdfinput=JSON.parse(sessionStorage.getItem('planoutputs') || '{}');
    // this.service.genpdf(pdfinput).subscribe((data:any)=>{
    //   console.log("data,,,,,",data);
    //   // console.log("pdfinput..name",pdfinput.UserDetail.name)
    //   var globaldata=JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}');
    //   var filename="Tiger Report for"+globaldata.name
    //   this.pdfService.downloadPdf(data,filename).subscribe((loader:any)=> {
    //     if (loader == 'hideloader'){
    //       this.show_loader=false;
    //       sessionStorage.setItem('pdfdownload','true')
    //     }
    //   });
    // })
    // this.webengageService.webengageTrackEvent("Download Report");
    if (this.reporthtml) {
         this.show_loader=true;
      const htmlContent = this.reporthtml.getInnerHtml();
      // console.log('htmlContent', htmlContent)
      var globaldata=JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}');
      var filename="Tiger Report for "+globaldata.name
      // console.log("Filename",filename);
      this.pdfService.generatePdf(htmlContent, filename).then((loader:any) => {
        // Use the loader value here...
        if (loader == 'hideloader'){
          this.show_loader=false;
          sessionStorage.setItem('pdfdownload','true')
        }
      })
      this.webengageService.webengageTrackEvent("Download Report");
    } else {
      console.error('ReporthtmlComponent not found.');
    }
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

  calculateFinalBaseTopUp(plans: any) {
    // console.log("plans....",plans);
    let totalBaseAmount = 0;
    let totalTopUp = 0;
    let baseAmount = 0;
    let topUp = 0;
    plans.forEach((plan: any) => {
      const Total_coverage = parseFloat(plan[0].output_2);
      const convertedTotalCoverage = Total_coverage * 100000;
      const familyCombination=plan[0].family_combination;
      if (familyCombination !== 1 && familyCombination !== 2 && familyCombination !== 5 && familyCombination !== 6) {
        baseAmount += 1000000;
        topUp += convertedTotalCoverage - 1000000;
      } else {
        baseAmount += 500000;
        topUp += convertedTotalCoverage - 500000;
      }
      // totalBaseAmount += baseAmount;
      totalTopUp = topUp;
    });
    return {
      baseAmount,
      totalTopUp
    };
  }

  toggleAccordion(event: MouseEvent): void {
    const accordionItemHeader = event.currentTarget as HTMLElement;
    accordionItemHeader.classList.toggle('active');

    const accordionItemBody = accordionItemHeader.nextElementSibling as HTMLElement;
    if (accordionItemHeader.classList.contains('active')) {
        accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + 'px';
    } else {
        accordionItemBody.style.maxHeight = '0';
    }
  }

  copyEmail() {
    const tempInput = document.createElement('input');
    tempInput.value = this.UserDetail.rm_email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  copyMobile(){
    const tempInput = document.createElement('input');
    tempInput.value = this.UserDetail.rm_mobile;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }
  
  whatsappNumbersOnly(event: any) {
    const pattern = /[0-9+-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  checkValidation() { // Clear any previous error messages
    const mobileNumber = this.whatsappNumber.replace(/\D/g, '');
    // console.log(mobileNumber, 'mobileNumber');
    if (!mobileNumber) {
      this.mobileValidateMessage = 'required';
      // console.log("mobileValidateMessage",this.mobileValidateMessage)
    } else if (mobileNumber.length < 10) {
      this.mobileValidateMessage = 'Invalid';
    } else {

      
      const sum_assured = this.planDetail[0][0].output_2;
      // $('#sharesubmit').attr('disabled', 'true');
      setTimeout(function() {
        $('#sharepop').modal('toggle');
        // $('#sharesubmit').attr('disabled', 'true');
    }, 2000);

      if(!sessionStorage.getItem('latest_pdf')){
        const htmlContent = this.reporthtml.getInnerHtml();
        this.pdfService.getPdfURL_share(htmlContent,mobileNumber,sum_assured,this.Base_amount,this.topUp);
        
      }else{
        var globaldata=JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}');

        var obj={
          mobile : mobileNumber,
          name :  globaldata.name,
          pdfurl : sessionStorage.getItem('latest_pdf'),
          sum_assured : sum_assured,
          base_amount: this.Base_amount,
          topup:this.topUp
        }
        this.service.sendWhatsapp(obj).subscribe((data:any)=>{
          // console.log("datata...",data);
          this.mobileValidateMessage = 'Whatsapp sent'
        });
  
      }
      this.mobileValidateMessage = 'Whatsapp sent';
      
    }
  }
  closeshare(){
    this.mobileValidateMessage = '';
    // $('#sharesubmit').attr('disabled', 'false')

    this.webengageService.webengageTrackEvent("Share Clicks");

  }

  
  
  getCallSubmit(){    
    
    // var helpThanks = document.getElementById("helpthanks");
    // $(helpThanks).css({ 'opacity': '1', 'visibility': 'visible' })

    // var helpThanksClose = document.getElementById("helpthanksclose");
    // $(helpThanksClose).click(function () {
    //   $(helpThanks).css({ 'opacity': '0', 'visibility': 'hidden' })
    // })
    var obj={
      marketing_id: sessionStorage.getItem('marketing_id'),
      Mobile: sessionStorage.getItem('RMMobile'),
      // prefered_date_time :this.selectedOption
    }
    this.service.getCallbackCrm(obj).subscribe((data:any)=>{
      // console.log("datata...",data);

    })
    setTimeout(function() {
          $('#helppop').modal('toggle');
          // $(helpThanks).css({ 'opacity': '0', 'visibility': 'hidden' })
      }, 3000);

    this.webengageService.webengageTrackEvent("Get a Call Now");

  }
  editDetails(){
    this.webengageService.webengageTrackEvent("Edit Details Clicks");
    sessionStorage.removeItem('pdfdownload');
    sessionStorage.setItem('editDeatils', 'fromVerification-basic')
    this.router.navigateByUrl('health-insurance-second-opinion/basic-details');
  }
  capitalizeFirstLetter(member: string): string {
    if(member=='fatherInLaw' || member=='motherInLaw'){
      return member.replace(/([A-Z])/g, '-$1').replace(/(^|-)([a-z])/g, (_, a, b) => a + b.toUpperCase());
    }else{
      return member.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
    }
  }

  sendDataToOtherComponent(data: any) {
    this.sharedDataService.setData(data);
  }

  formatPlanMembers(planMembers: any) {
    const membersArray = planMembers.split(',');
    const uniqueMembersArray = Array.from(new Set(membersArray.map((member: string) => member.startsWith("son") ? "Son" : member.startsWith("daughter") ? "Daughter" :member.includes("fatherInLaw")?"Father-In-Law":member.includes("motherInLaw")?"Mother-In-Law": member.includes("grandFather")?"Grand Father": member.includes("grandMother")?"Grand Mother": this.capitalize(member))));

    return uniqueMembersArray.join(', ').replace(/,([^,]*)$/, ' and$1');
  }

  sortComboMembers(comboMembers: string) {
        // Split the combomembers string into an array
    const membersArray = comboMembers.split(',');
      // Create a new array to store unique members
    const uniqueMembersArray: string[] = [];
  
    // Iterate over the membersArray
    for (let member of membersArray) {
      if (member.startsWith("son")) {
        member = "Son";
      } else if (member.startsWith("daughter")) {
        member = "Daughter";
      } else {
        member = this.capitalize(member);
      }
  
      // Check if the member is not already in the uniqueMembersArray
      if (!uniqueMembersArray.includes(member)) {
        // Push the member into the uniqueMembersArray
        uniqueMembersArray.push(member);
      }
    }  
    // Return the uniqueMembersArray
    return uniqueMembersArray;
  }
  

  capitalize(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  matchPlanData(inputAlias:any, Product_id:any,Plansection:any,type:any){
    const keys = Object.keys(this.finaldata.planResponse[0]);
    const length = keys.length;
    let value ;
    for(let i = 0; i < length-1; i++){ 
      if(this.finaldata.planResponse[0][i]){
      if( this.finaldata.planResponse[0][i].product_id &&  this.finaldata.planResponse[0][i].product_id == Product_id){

        if(type == 'link' &&  this.finaldata.planResponse[0][i].section == Plansection){
          if(!this.finaldata.planResponse[0][i].product_id ){
            value = ''
          } else{
            value =  this.finaldata.planResponse[0][i].product_details_page_link
          }
        }else if(type == 'premium' &&  this.finaldata.planResponse[0][i].section == Plansection){
          if(!this.finaldata.planResponse[0][i].product_id ){
            value = ''
          } else{
          value =  this.finaldata.planResponse[0][i].total_premium
          }
        }
        break;
      }
    }
    }
    return value;
  }

  matchOtherPlanData(inputAlias:any, Product_id:any,Plansection:any,index:any, type:any,){
    const keys = Object.keys(this.templanss[index]);
    const length = keys.length;
    let value; 
    for(let i = 0; i < length-1; i++){
      if(this.templanss[index][i]){
      if(this.templanss[index][i].product_id && this.templanss[index][i].product_id == Product_id){
        if(type == 'link' && this.templanss[index][i].section == Plansection){
          value = this.templanss[index][i].product_details_page_link
        }else if(type == 'premium' && this.templanss[index][i].section == Plansection){
          value = this.templanss[index][i].total_premium
        }
        break;
      }
    }
    }
    return value;
  }
  
  getCoverValues(value:any,planType:any,product_id:any,event:any){
    if(event.target){
      var deductible = event.target.value
    }else{
      var deductible = event
    }

    var obj = {
      "planType":planType,
      "product_id":product_id,
      "deductible_amount":deductible
   }

   this.service.getCoverValues(obj).subscribe((res:any)=>{
    console.log(res.data)
    if(value == 1){
      this.coverValue1 = res.data;
    }else if(value ==2){
      this.coverValue2 = res.data;
    }else if(value ==3){
      this.coverValue3 = res.data;
    }
   })

  }

  getCoverValuesOtherPlan(index:any,value:any,planType:any,product_id:any,event:any){

    if(event.target){
      var deductible = event.target.value
    }else{
      var deductible = event
    }
   

    var obj = {
      "planType":planType,
      "product_id":product_id,
      "deductible_amount":deductible
   }

   if (!this.otherPlanCoverValues[index]) {
    this.otherPlanCoverValues[index] = {};
  }

   this.service.getCoverValues(obj).subscribe((res:any)=>{
    if(value == 1){
      this.otherPlanCoverValues[index][1] = [res.data]
    }else if(value ==2){
      this.otherPlanCoverValues[index][2] = [res.data]
    }else if(value ==3){
      this.otherPlanCoverValues[index][3] = [res.data]
    }
   })

  }

  webEngageTrackBuy(Product_id:any,Plansection:any,planName:any, cover:any, logo:any){
    const keys = Object.keys(this.finaldata.planResponse[0]);
    const length = keys.length;
    let PlanName ;
    let InsurerName;
    let InsuranceCover;
    let PremiumInclGST;
    let InsurerLogo;
    for(let i = 0; i < length-1; i++){ 
      if(this.finaldata.planResponse[0][i]){
        if( this.finaldata.planResponse[0][i].product_id &&  this.finaldata.planResponse[0][i].product_id == Product_id){
        if(this.finaldata.planResponse[0][i].section == Plansection){
            if(!this.finaldata.planResponse[0][i].product_id ){
                PlanName=""
                InsurerName=""
                InsuranceCover=""
                PremiumInclGST=""
                InsurerLogo=""
            } else{
              PlanName=planName
              InsurerName=this.finaldata.planResponse[0][i].company_alias
              InsuranceCover='₹'+this.getFormattedValue(cover)
              PremiumInclGST=this.finaldata.planResponse[0][i].total_premium
              InsurerLogo="https://dev.tigerinsurance.in/assets/images/IC_Logo/"+logo
            }
          }
          break;
        }
      }
    }

    this.webengageService.webengageTrackEvent("Buy Initiated", {
      "Plan Name": PlanName,
      "Insurer Name": InsurerName,
      "Insurance Cover": InsuranceCover,
      "Premium incl GST": PremiumInclGST,
      "Insurer Logo": [InsurerLogo]
    });
  }

  webEngageTrackBuyOther(Product_id:any,Plansection:any,index:any, planName:any, logo:any, fCom:any, output:any, type:any){
    const keys = Object.keys(this.templanss[index]);
    const length = keys.length;
    let PlanName ;
    let InsurerName;
    let InsuranceCover;
    let PremiumInclGST;
    let InsurerLogo; 
    for(let i = 0; i < length-1; i++){
      if(this.templanss[index][i]){
      if(this.templanss[index][i].product_id && this.templanss[index][i].product_id == Product_id){
        if(this.templanss[index][i].section == Plansection){
          PlanName=planName
          InsurerName=this.templanss[index][i].company_alias
          InsuranceCover='₹'+this.getFormattedValue(this.calculateBaseTopUp(fCom, output, type))          
          PremiumInclGST=this.templanss[index][i].total_premium
          InsurerLogo="https://dev.tigerinsurance.in/assets/images/IC_Logo/"+logo
        }
        break;
      }
    }
    }

    this.webengageService.webengageTrackEvent("Buy Initiated", {
      "Plan Name": PlanName,
      "Insurer Name": InsurerName,
      "Insurance Cover": InsuranceCover,
      "Premium incl GST": PremiumInclGST,
      "Insurer Logo": [InsurerLogo]
    });
  }

  webEngageTrack(faq:string) {
    this.webengageService.webengageTrackEvent("FAQ Viewed", {
      "FAQ Name": faq
    });
  }

}
