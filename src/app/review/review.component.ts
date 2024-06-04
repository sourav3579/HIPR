import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { WebengageService } from '../service/webengage.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  total_members: any;
  familyIcome: any;
  internationTreatment: any;
  maternityCover: any;
  iconDetails: string[] = [];
  iconIds: number[] = [];
  sonCount: any;
  daughterCount: any;
  cookingSlide : boolean = false;
  memberFormData : any;
  members: string[] = [];
  memberDeatils: string[] = [];
  name: any;
  pincode: any;

  ngOnInit(): void {
    if(sessionStorage.getItem('reviewPageData')){
      var reviewData = JSON.parse(sessionStorage.getItem('reviewPageData')  || '{}');

      this.apiService.setFinalGlobalObject(reviewData);

      this.total_members = reviewData.total_members;
      this.iconDetails = reviewData.iconDetails;
      this.name = reviewData.name;
      this.pincode = reviewData.pincode;
      this.iconIds = reviewData.iconIds;
      this.familyIcome = reviewData.familyIcome;
      this.internationTreatment = reviewData.internationTreatment;
      this.maternityCover =reviewData.maternityCover;
      // console.log('reviewPageData - iconDetails',this.iconDetails);
      // console.log('reviewPageData - iconIds',this.iconIds)
      this.sonCount = reviewData.sonCount;
      this.daughterCount = reviewData.daughterCount;
      this.memberFormData = reviewData.memberFormData
      for (let i = 0; i < this.memberFormData.length; i++) {
        this.members.push(this.memberFormData[i].memberType);
      }
      // console.log('reviewPageData-  memberFormData',this.sonCount, this.daughterCount)
    } else {
      var global_data = JSON.parse(sessionStorage.getItem("global_data") || '{}'); 
      var gender = global_data.gender;
      this.total_members = global_data.member_count;
      this.iconDetails = global_data.iconDetails;
      this.iconIds = global_data.iconIds;
      this.familyIcome = global_data.annualIncomeRange;
      this.internationTreatment = global_data.international_treatment;
      this.maternityCover =global_data.maternity_cover;
      var medical_history = global_data.medical_history
      var annual_income = global_data.annual_income
      var name = global_data.name;
      var pincode = global_data.pincode
      // console.log('iconDetails',this.iconDetails);
      // console.log('iconIds',this.iconIds)
      this.sonCount = global_data.son_count;
      this.daughterCount = global_data.daughter_count;
      this.memberFormData = global_data.member
      for (let i = 0; i < this.memberFormData.length; i++) {
        this.members.push(this.memberFormData[i].memberType);
      }
      
      var reviewPageData = {
        "visitor_id": sessionStorage.getItem('visitorId'),
        "gender": gender,
        "name": name,
        "pincode": pincode,
        "total_members": this.total_members,
        "memberData": global_data.memberData,
        "iconDetails": this.iconDetails,
        "iconIds": this.iconIds,
        "medical_history": medical_history,
        "annual_income": annual_income,
        "familyIcome": this.familyIcome,
        "internationTreatment": this.internationTreatment,
        "maternityCover": this.maternityCover,
        "sonCount": this.sonCount,
        "daughterCount": this.daughterCount,
        "memberFormData": this.memberFormData
      }
      sessionStorage.setItem("reviewPageData", JSON.stringify(reviewPageData));
      this.apiService.setFinalGlobalObject(reviewPageData);
    }
    sessionStorage.removeItem('editDeatils')

    sessionStorage.removeItem('backFromPage')


    console.log('members',this.members)
    console.log('memberFormData',this.memberFormData)

    sessionStorage.removeItem("form1Changed");

  }

  constructor(private apiService: ApiService, private router: Router, private webengageService: WebengageService){}

  editDetails(editDetail: any){
    if(editDetail=='basic'){
      sessionStorage.setItem('editDeatils', 'fromReviewPage-basic')
      this.router.navigateByUrl('health-insurance-second-opinion/basic-details');
    } 
    else if(editDetail=='lifestyle'){
      sessionStorage.setItem('editDeatils', 'fromReviewPage-lifestyle')
      this.router.navigateByUrl('health-insurance-second-opinion/lifestyle-details');
    }
  }

  backBtn(){
    sessionStorage.setItem('backFromPage', 'reviewPage')
    this.router.navigateByUrl('health-insurance-second-opinion/lifestyle-details');
  }

  generateReport(){

    this.cookingSlide = true;
    document.getElementById('awesome')!.style.display = 'flex';

    this.webengageService.webengageTrackEvent("Review Details Submitted", {
      "Total members covered": this.total_members,
      "Members": this.formatMemberArr(this.members),
      "Family Annual Income": this.familyIcome,
      "International treatmen": this.internationTreatment==1?true:false,
      "Maternity Cover": this.maternityCover==1?true:false
    });

    setTimeout(() => {
      if(!sessionStorage.getItem('leadId')){
        this.router.navigateByUrl('health-insurance-second-opinion/verification');
        }
        else{
          this.createLead2();
          this.updatecrm();
          this.router.navigateByUrl('health-insurance-second-opinion/recommendation-report')
        }
    }, 2000); 

   
  }

  createLead2() {
    // console.log('createLead2')
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
        "international_treatment":FINAL_global_data.international_treatment == 'Yes'? 1 : 0,
        "maternity_cover":FINAL_global_data.maternity_cover == 'Yes'? 1 : 0,
        "mobileno": sessionStorage.getItem('RMMobile'),
        "RM_code":sessionStorage.getItem('rm_code'),
        "members":FINAL_global_data.member

    }

    this.apiService.createLead(obj).subscribe((data:any) => {
      if(!sessionStorage.getItem('leadId')){
        sessionStorage.setItem('leadId', data['leadid'])
      }
    }, err => {
      console.log(err);
    })
  }

  updatecrm(){
    var globaldata=JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}');
    var obj={
      globaldata:globaldata.member,
      Name: globaldata.name,
      Mobile: sessionStorage.getItem('RMMobile'),
      marketing_id: sessionStorage.getItem('marketing_id'),
      journey_continuation_link: sessionStorage.getItem('latest_pdf'),
      remarks_c:sessionStorage.getItem('old_pdf')
    }
    this.apiService.updatecrm(obj).subscribe((data:any)=>{
    })
  }

  capitalizeFirstLetter(member: string): string {
    if(member=='fatherInLaw' || member=='motherInLaw'){
      return member.replace(/([A-Z])/g, '-$1').replace(/(^|-)([a-z])/g, (_, a, b) => a + b.toUpperCase());
    }else{
      return member.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
    }
  }

  formatPED(arr: string[]): string {
    return arr.map(item => {
        // Capitalize the first letter of each item
        let formattedItem = item.charAt(0).toUpperCase() + item.slice(1);
        for (let i = 1; i < formattedItem.length; i++) {
            if (formattedItem[i] === formattedItem[i].toUpperCase()) {
                formattedItem = formattedItem.slice(0, i) + ' ' + formattedItem.slice(i);
                i++;
            }
        }
        return formattedItem;
    }).join(', ');
}


  capitalizeAndAddSpace(str: string): string {
    // Capitalize the first letter
    let capitalizedString = str.charAt(0).toUpperCase() + str.slice(1);
    for (let i = 1; i < capitalizedString.length; i++) {
      if (capitalizedString[i] === capitalizedString[i].toUpperCase()) {
        capitalizedString = capitalizedString.slice(0, i) + ' ' + capitalizedString.slice(i);
          i++;
      }
    }
    
    // Add a space before a number starts
    capitalizedString = capitalizedString.replace(/(\d)/g, ' $1');
    
    return capitalizedString;
  }

  formatMemberArr(arr: string[]): string {
    return arr.map(item => {
      let formattedItem;
      if(item == 'fatherInLaw' || item == 'motherInLaw') {
        formattedItem = item.replace(/([A-Z])/g, '-$1').replace(/^\w/, c => c.toUpperCase());
      }else{
        formattedItem =  item.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase());
      }
  
      return formattedItem;
    }).join(', ');
  }
  
  formatMemberType(member:string){
    if(member=='fatherInLaw' || member=='motherInLaw'){
      return member.replace(/([A-Z])/g, '-$1').replace(/(^|-)([a-z])/g, (_, a, b) => a + b.toUpperCase());
    }else{
      return member.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
    }
  }
  
}
