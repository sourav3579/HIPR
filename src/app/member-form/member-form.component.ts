import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { WebengageService } from '../service/webengage.service';
declare var $: any

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit{
  @ViewChildren('myForm') formRefs!: QueryList<NgForm>;

  s_count:any;
  d_count:any;
  memberTypes: any[]=[];
  selectedDiseases: string[] = [];
  iconDetails: string[] = [];
  iconIds: number[] = [];
  total_members: any;

  // --------------------------------------------------------PHASE 2---------------------------------------
  newprogressWidth: string = '25%';
  newProgressWithMedical = true;
  currentDiv: string = 'physicalexerciseDiv';
  showAlcoholMembers: boolean = false;
  showTobaccoMembers: boolean = false;
  showMedicalMembers: boolean = false;
  MemberDisease: boolean = false;
  medicalhistory :any;
  InsuranceOptions:any;
  // finalInsureOptions:any={}
  finalInsureOptions: { [key: string]: boolean } = {} as { [key: string]: boolean };
  finalInsureOptionsKeys: any = {};
  AlcoholMembers: any = {};
  TobaccoMembers: any = {};
  MedicalMembers:any = {};
  physicalExercise:any;
  AlcoholAns:any;
  TobaccoAns:any;
  MedicalAns:any;
  memberArr:any = [];

  selectedDisease:any=[];
  selectionStates: any = {};

  alcoholFrequency:  any = {};
  // tobaccoFrequency: any = {}; //TEST

  errorNoAlcoholCheckboxSelected = false;
  errorNoTobaccoCheckboxSelected = false;
  errorNoMedicalCheckboxSelected = false;
  errorNoDiseaseSelected: boolean = false;
  errorNoAlcoholFrequencySelected: boolean = false;
  // errorNoTobaccoFrequencySelected: boolean = false; //TEST

  memberDetailObject: any [] = [];

  constructor(private service:ApiService, private router: Router, private webengageService: WebengageService){}
  
  ngOnInit(): void {

    var showTiger = sessionStorage.getItem('showTiger')

    if(showTiger && showTiger==='true'){

      document.getElementById('awesome')!.style.display = 'flex';

      setTimeout(() => {
        // var awesomeId =  document.getElementById('awesome');
        // awesomeId.addClassList();
        // $(awesomeId).addClass('d-none')
        document.getElementById('awesome')!.style.display = 'none';
      },2000)

      sessionStorage.removeItem('showTiger')
    }

    // setTimeout(() => {
    //   $('#submit1').click(function () {
    //     alert('Hii')
    //   $(window).scrollTop(0);
    //   })
      
    //   $('#submit2').click(function () {
    //   $(window).scrollTop(0);
    //   })
    // },1000)


    var editFromPage = sessionStorage.getItem("editDeatils");
    var backFromPage = sessionStorage.getItem("backFromPage");
    var form1Changed = sessionStorage.getItem("form1Changed");
        if(editFromPage == 'fromReviewPage-lifestyle' || backFromPage == 'reviewPage' || form1Changed =='false'){
            console.log('editFromPage',editFromPage)
      var FINAL_global_data = JSON.parse(sessionStorage.getItem('FINAL_global_data')  || '{}');

      if(FINAL_global_data.iconIds == undefined){
                var global_data = JSON.parse(sessionStorage.getItem("global_data") || '{}'); 
        this.total_members = global_data.member_count;
    
        this.iconDetails = global_data.iconDetails;
        this.iconIds = global_data.iconIds;

    
        this.InsuranceOptions= this.service.getFormData();
        // console.log("this.....",this.InsuranceOptions)
        this.finalInsureOptions=this.InsuranceOptions['insureOptions']
        this.medicalhistory = this.InsuranceOptions['medicalHistory']
        this.s_count=this.finalInsureOptions['son'];
        this.d_count=this.finalInsureOptions['daughter'];

        this.memberDetailObject = global_data.member
        this.physicalExercise = global_data.member[0].physical_activity
        for (let i = 0; i < global_data.member.length; i++) {
          if (global_data.member[i].consume_alcohol == "1") {
              this.AlcoholAns = "1";
              this.selectAlcohol(this.AlcoholAns);
              break;
          } else {
            this.AlcoholAns = "0";
          }
        }
        for (let i = 0; i < global_data.member.length; i++) {
          if (global_data.member[i].consume_tobacco == "1") {
              this.TobaccoAns = "1";
              this.selectTobacco(this.TobaccoAns);
              break;
          } else {
            this.TobaccoAns = "0";
          }
        }
        for (let i = 0; i < global_data.member.length; i++) {
          if (global_data.member[i].PED_status == "1") {
              this.MedicalAns = "1";
              this.selectMedicalHistory(this.MedicalAns)
              break;
          } else {
            this.MedicalAns = "0";
          }
        }
        
        
        
      } else {
                // console.log("eslefrj")
      var otherFormChanged = sessionStorage.getItem('otherFormChanged')
      sessionStorage.removeItem('otherFormChanged')
      if(otherFormChanged =='true'){
                // console.log("otherFormChanged")
        var global_data = JSON.parse(sessionStorage.getItem('global_data')  || '{}');
        var obj = {
          "gender": FINAL_global_data.gender,
          "member_count":FINAL_global_data.member_count,
          "memberData":FINAL_global_data.memberData,
          "son_count":FINAL_global_data.son_count,
          "daughter_count":FINAL_global_data.daughter_count,
          "iconDetails":FINAL_global_data.iconDetails,
          "iconIds":FINAL_global_data.iconIds,
          "medical_history":FINAL_global_data.medical_history,
          "annual_income":global_data.annual_income,
          "annualRange":global_data.annualIncomeRange,
          "international_treatment":global_data.international_treatment,
          "maternity_cover":global_data.maternity_cover,
          "name": global_data.name,
          "pincode": global_data.pincode,
          "memberDetail": FINAL_global_data.member,
        }

        this.memberDetailObject = FINAL_global_data.member

        this.physicalExercise = FINAL_global_data.member[0].physical_activity
        for (let i = 0; i < FINAL_global_data.member.length; i++) {
          if (FINAL_global_data.member[i].consume_alcohol == "1") {
              this.AlcoholAns = "1";
              this.selectAlcohol(this.AlcoholAns);
              break;
          } else {
            this.AlcoholAns = "0";
          }
        }
        for (let i = 0; i < FINAL_global_data.member.length; i++) {
          if (FINAL_global_data.member[i].consume_tobacco == "1") {
              this.TobaccoAns = "1";
              this.selectTobacco(this.TobaccoAns);
              break;
          } else {
            this.TobaccoAns = "0";
          }
        }
        for (let i = 0; i < FINAL_global_data.member.length; i++) {
          if (FINAL_global_data.member[i].PED_status == "1") {
              this.MedicalAns = "1";
              this.selectMedicalHistory(this.MedicalAns)
              break;
          } else {
            this.MedicalAns = "0";
          }
        }
        

      } else {
                var obj = {
          "gender": FINAL_global_data.gender,
          "member_count":FINAL_global_data.member_count,
          "memberData":FINAL_global_data.memberData,
          "son_count":FINAL_global_data.son_count,
          "daughter_count":FINAL_global_data.daughter_count,
          "iconDetails":FINAL_global_data.iconDetails,
          "iconIds":FINAL_global_data.iconIds,
          "medical_history":FINAL_global_data.medical_history,
          "annual_income":FINAL_global_data.annual_income,
          "annualRange":FINAL_global_data.annualIncomeRange,
          "international_treatment":FINAL_global_data.international_treatment,
          "maternity_cover":FINAL_global_data.maternity_cover,
          "name": FINAL_global_data.name,
          "pincode": FINAL_global_data.pincode,
          "memberDetail": FINAL_global_data.member,
        }

        this.memberDetailObject = FINAL_global_data.member
        
        this.physicalExercise = FINAL_global_data.member[0].physical_activity
        for (let i = 0; i < FINAL_global_data.member.length; i++) {
          if (FINAL_global_data.member[i].consume_alcohol === "1") {
              this.AlcoholAns = "1";
              this.selectAlcohol(this.AlcoholAns);
              break;
          } else {
            this.AlcoholAns = "0";
          }
        }
        for (let i = 0; i < FINAL_global_data.member.length; i++) {
          if (FINAL_global_data.member[i].consume_tobacco === "1") {
              this.TobaccoAns = "1";
              this.selectTobacco(this.TobaccoAns);
              break;
          } else {
            this.TobaccoAns = "0";
          }
        }
        for (let i = 0; i < FINAL_global_data.member.length; i++) {
          if (FINAL_global_data.member[i].PED_status == "1") {
              this.MedicalAns = "1";
              this.selectMedicalHistory(this.MedicalAns)
              break;
          } else {
            this.MedicalAns = "0";
          }
        }
        
      }
      this.service.setGlobalData(obj);

      this.total_members = FINAL_global_data.member_count;

      this.iconDetails = FINAL_global_data.iconDetails;
      this.iconIds = FINAL_global_data.iconIds;

      this.finalInsureOptions = FINAL_global_data.memberData;
      this.medicalhistory = FINAL_global_data.medical_history == '1'?1:0
      // console.log("this.....",this.iconDetails)
          }
      if(this.medicalhistory == 1){
        this.newprogressWidth = '25%';
        this.newProgressWithMedical = true;
      } else {
        this.newprogressWidth = '33%';
        this.newProgressWithMedical = false
      }
        } else{
          var global_data = JSON.parse(sessionStorage.getItem("global_data") || '{}'); 
      this.total_members = global_data.member_count;
  
      this.iconDetails = global_data.iconDetails;
      this.iconIds = global_data.iconIds;
  
      this.memberDetailObject = global_data.member
      this.physicalExercise = global_data.member[0].physical_activity ? global_data.member[0].physical_activity : "";
      for (let i = 0; i < global_data.member.length; i++) {
        if (global_data.member[i].consume_alcohol == "1") {
            this.AlcoholAns = "1";
            this.selectAlcohol(this.AlcoholAns);
            break;
        } else {
          this.AlcoholAns = "0";
        }
      }
      for (let i = 0; i < global_data.member.length; i++) {
        if (global_data.member[i].consume_tobacco == "1") {
            this.TobaccoAns = "1";
            this.selectTobacco(this.TobaccoAns);
            break;
        } else {
          this.TobaccoAns = "0";
        }
      }
      for (let i = 0; i < global_data.member.length; i++) {
        if (global_data.member[i].PED_status == "1") {
            this.MedicalAns = "1";
            this.selectMedicalHistory(this.MedicalAns)
            break;
        } else {
          this.MedicalAns = "0";
        }
      }
      
      

      this.InsuranceOptions= this.service.getFormData();
      // console.log("this.....",this.InsuranceOptions)
      this.finalInsureOptions=this.InsuranceOptions['insureOptions']
       this.medicalhistory = global_data.medical_history == '1'?1:0
      // this.medicalhistory = this.InsuranceOptions['medicalHistory']
      this.s_count=this.finalInsureOptions['son'];
      this.d_count=this.finalInsureOptions['daughter'];
      this.finalInsureOptionsKeys = Object.keys(this.finalInsureOptions);
    }

    this.InsuranceOptions= this.service.getFormData();
      // console.log("this.....",this.InsuranceOptions)
      this.finalInsureOptions=this.InsuranceOptions['insureOptions']
      //  this.medicalhistory = global_data.medical_history == '1'?1:0
      this.medicalhistory = this.InsuranceOptions['medicalHistory']
      this.s_count=this.finalInsureOptions['son'];
      this.d_count=this.finalInsureOptions['daughter'];
      this.finalInsureOptionsKeys = Object.keys(this.finalInsureOptions);

      var prefilledDisease = this.memberDetailObject
      for (const member of prefilledDisease) {
        const memberType = member.memberType;
        const category = memberType === 'son1' ? 'son' : memberType === 'daughter1' ? 'daughter' : memberType;
        
        for (const disease of member.PED_text) {
            this.prefilledDisease(category, disease, member.PED_value);
            if( member.PED_text.length>0){
              this.MedicalMembers[category] = true;
            }
        }
      }
      

      //NEW CHANGES-------------------
      var preSelectedFrequency = this.memberDetailObject
      for (const member of preSelectedFrequency) {
        const memberType = member.memberType;
        const category = memberType === 'son1' ? 'son' : memberType === 'daughter1' ? 'daughter' : memberType;
        
          this.preSelectedAlchoholFrequency(category, member.consume_alcohol_frequency);
          if( member.consume_alcohol_frequency !=""){
            this.AlcoholMembers[category] = true;
          }

        // this.preSelectedTobaccoFrequency(category, tobaccoFrequency);//TEST
      }
      //NEW CHANGES-------------------
        
    if(form1Changed=='true'){
      this.InsuranceOptions= this.service.getFormData();
      // console.log("this.....",this.InsuranceOptions)
      this.finalInsureOptions=this.InsuranceOptions['insureOptions']
      // this.medicalhistory = this.InsuranceOptions['medicalHistory']
      this.medicalhistory = global_data.medical_history == '1'?1:0
      this.s_count=this.finalInsureOptions['son'];
      this.d_count=this.finalInsureOptions['daughter'];
      this.finalInsureOptionsKeys = Object.keys(this.finalInsureOptions);

      this.physicalExercise = '';
      this.AlcoholAns = '';
      this.TobaccoAns = '';
      this.MedicalAns = '';
      this.AlcoholMembers = {};
      this.TobaccoMembers= {};
      this.MedicalMembers = {};
      this.selectedDisease=[];
      this.selectionStates = {};
      this.alcoholFrequency = {};
      // this.tobaccoFrequency = {}; //TEST

    }

    var backFromPage = sessionStorage.getItem('backFromPage');
    if(backFromPage=='reviewPage'){
      
    }

    console.log('medicalhistory',this.medicalhistory)

    if(this.medicalhistory == 1){
      this.newprogressWidth = '25%';
      this.newProgressWithMedical = true;
      this.selectMedicalHistory('1');
    } else {
      this.newprogressWidth = '33%';
      this.newProgressWithMedical = false;
    }


    var form1Changed = sessionStorage.getItem("form1Changed");
    sessionStorage.removeItem('form1Changed');
    // console.log('form1Changed',form1Changed)
    var backFromPage = sessionStorage.getItem('backFromPage');
    var editFromPage = sessionStorage.getItem('editDeatils');
    if(backFromPage=='reviewPage'){
      this.AlcoholMembers = JSON.parse(sessionStorage.getItem('lifestyle-AlcoholMembers') || '{}');
      this.TobaccoMembers = JSON.parse(sessionStorage.getItem('lifestyle-TobaccoMembers') || '{}');
      this.MedicalMembers = JSON.parse(sessionStorage.getItem('lifestyle-MedicalMembers') || '{}');
    } else if(editFromPage=='fromReviewPage-lifestyle' || form1Changed=='false'){
      this.AlcoholMembers = JSON.parse(sessionStorage.getItem('lifestyle-AlcoholMembers') || '{}');
      this.TobaccoMembers = JSON.parse(sessionStorage.getItem('lifestyle-TobaccoMembers') || '{}');
      this.MedicalMembers = JSON.parse(sessionStorage.getItem('lifestyle-MedicalMembers') || '{}');
    }
    else{
      this.AlcoholMembers = JSON.parse(sessionStorage.getItem('lifestyle-AlcoholMembers') || '{}');
      this.TobaccoMembers = JSON.parse(sessionStorage.getItem('lifestyle-TobaccoMembers') || '{}');
      this.MedicalMembers = JSON.parse(sessionStorage.getItem('lifestyle-MedicalMembers') || '{}');
      const dataFromPage = sessionStorage.getItem('dataFromPage');
      if (dataFromPage != 'basicDetailsForm') {
      }
    }


    if(this.medicalhistory == 0){
      for (const key in this.MedicalMembers) {
        this.MedicalMembers[key] = false;
        if (this.MedicalMembers.hasOwnProperty(key) && this.MedicalMembers[key] === false) {
          if (key === 'son' || key === 'daughter') {
            const member = this.memberDetailObject.find((m: any) => m.memberType === `${key}1`.toString());
            member.PED_status = "0";
            member.PED_text = "";
            member.PED_value = "";
          } else{
          const member = this.memberDetailObject.find((m: any) => m.memberType == key.toString());
            member.PED_status = "0";
            member.PED_text = "";
            member.PED_value = "";
          }
  
        }
      }
    }
    

    if(!sessionStorage.getItem('FINAL_global_data')){
      this.AlcoholAns = '';
      this.TobaccoAns = '';
      this.MedicalAns = '';
    }
    if(form1Changed=='true'){
      this.InsuranceOptions= this.service.getFormData();
      // console.log("this.....",this.InsuranceOptions)
      this.finalInsureOptions=this.InsuranceOptions['insureOptions']
      // this.medicalhistory = this.InsuranceOptions['medicalHistory']
      this.medicalhistory = global_data.medical_history == '1'?1:0
      this.s_count=this.finalInsureOptions['son'];
      this.d_count=this.finalInsureOptions['daughter'];
      this.finalInsureOptionsKeys = Object.keys(this.finalInsureOptions);

      this.physicalExercise = '';
      this.AlcoholAns = '';
      this.showAlcoholMembers = false;
      this.TobaccoAns = '';
      this.showTobaccoMembers = false;
      if(this.medicalhistory == '1'){
        this.MedicalAns = '1';
        this.selectMedicalHistory('1');
      }else {
        this.MedicalAns = '';
      }
      this.showMedicalMembers = false;
      this.AlcoholMembers = {};
      this.TobaccoMembers= {};
      this.MedicalMembers = {};
      this.selectedDisease=[];
      this.selectionStates = {};
      this.alcoholFrequency = {};
      // this.tobaccoFrequency = {}; //TEST
   
  }
  }

  ngAfterViewInit() {}


capitalizeFirstLetter(word: string): string {
  let result = word.charAt(0).toUpperCase() + word.slice(1);
  for (let i = 1; i < result.length; i++) {
      if (result[i] === result[i].toUpperCase()) {
          result = result.slice(0, i) + ' ' + result.slice(i);
          i++;
      }
  }
  return result;
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


isSelected(category: string, condition: string): boolean {
  return this.selectionStates[category] && this.selectionStates[category][condition];
}


//NEW CHANGES-------------------
isAlcoholFrequency(category: string, frequency: string): boolean {
  return this.alcoholFrequency[category] && this.alcoholFrequency[category][frequency];
}

// isTobaccoFrequency(category: string, frequency: string): boolean {
//   return this.tobaccoFrequency[category] && this.tobaccoFrequency[category][frequency]; //TEST
// }
//NEW CHANGES-------------------


prefilledDisease(category: string, condition: string, pedValue: number){
  if (!this.selectionStates[category]) {
    this.selectionStates[category] = {};
  }
  this.selectionStates[category][condition] = !this.selectionStates[category][condition];
}

//NEW CHANGES-------------------
 preSelectedAlchoholFrequency(category: any, frequency: any, ){
  // if (!this.alcoholFrequency[category]) {
    this.alcoholFrequency[category] = {};
  // }
  this.alcoholFrequency[category][frequency] = !this.alcoholFrequency[category][frequency];
}

// preSelectedTobaccoFrequency(category: any, frequency: any, ){
//   this.TobaccoMembers[category] = true;
//   // if (!this.tobaccoFrequency[category]) {
//   //   this.tobaccoFrequency[category] = {};
//   // }
//   // this.tobaccoFrequency[category][frequency] = !this.tobaccoFrequency[category][frequency];
  
// } //TEST
//NEW CHANGES-------------------

toggleSelection(category: string, condition: string, pedValue: number): void {
  console.log('category', category);
  console.log('condition', condition);
  console.log('pedValue', pedValue);
  
  if (!this.selectionStates[category]) {
    this.selectionStates[category] = {};
  }
  this.selectionStates[category][condition] = !this.selectionStates[category][condition];
  // let member_data = JSON.parse(sessionStorage.getItem("global_data") || '{}');

  // this.memberDetailObject = member_data.member
  // console.log('member_data', this.memberDetailObject)

  this.MedicalMembers[category] = true;

  let member;
  if (category === 'son' || category === 'daughter') {
    member = this.memberDetailObject.find((m: any) => m.memberType === `${category}1`);
  } else {
    member = this.memberDetailObject.find((m: any) => m.memberType === category);
  }
  if (member) {
    const selectedDiseases = Object.keys(this.selectionStates[category])
                                  .filter(condition => this.selectionStates[category][condition]);
    member.PED_text = selectedDiseases;
    member.PED_status = selectedDiseases.length > 0 ? 1 : 0;
    if (selectedDiseases.length === 0) { 
      member.PED_value = ''; 
    } else {
      member.PED_value = pedValue;
    }
  }
// console.log('yamiim',this.memberDetailObject)
}



selectAlcohol(option: string) {
  setTimeout(() => {
    $(window).scrollTop(0);
  }, 300)
  // console.log("question2:",option)
  
  //     $('#submit1').click(function () {
  //       // alert('Hii')
  //     $(window).scrollTop(0);
  //     })
      
      
  this.AlcoholAns = option;
  if (this.AlcoholAns === '1') {
    // Proceed to choose family members who consume alcohol
    this.showAlcoholMembers = true;
    this.AlcoholMembers = {}
    // Set AlcoholMembers[member] to true if total_members is 1
    if (this.total_members == 1) {
      for (const member in this.memberDetailObject) {
        if (this.memberDetailObject.hasOwnProperty(member)) {
          const key = this.memberDetailObject[member].memberType;
          this.AlcoholMembers[key] = true;
          this.webengageService.webengageTrackEvent("Alcohol Consumption Submitted", {
            "Response": true,
            "Member Selected": key
          });
        }
      }
    }
  } else {

    if(this.newProgressWithMedical){
      this.newprogressWidth='75%'
    } else {
      this.newprogressWidth='99%'
    }

    this.alcoholFrequency = {};

    this.showAlcoholMembers = false;
    for (const key in this.AlcoholMembers) {
      this.AlcoholMembers[key] = false;
      if (this.AlcoholMembers.hasOwnProperty(key) && this.AlcoholMembers[key] === false) {
        if (key === 'son' || key === 'daughter') {
          const member = this.memberDetailObject.find((m: any) => m.memberType === `${key}1`.toString());
          member.consume_alcohol = "0";
          member.consume_alcohol_frequency = "";
        } else{
        const member = this.memberDetailObject.find((m: any) => m.memberType == key.toString());
          member.consume_alcohol = "0";
          member.consume_alcohol_frequency = "";
        }

      }
    }
    
    let Dataobj= {
      "visitor_id":sessionStorage.getItem('visitorId'),
      "step_number":"step6",
      "formdata": {
        "AlcoholAns":this.AlcoholAns,
        "AlcoholMembers": [""]
      }
    }
    this.service.createStepData(Dataobj).subscribe((data: any) => {
      var dataSuccess = data["success"];
    });

    if (this.total_members == 1) {
      this.showTobaccoMembers = false;
    }
    // Proceed to the next question
    this.currentDiv = 'tobaccoDiv';

    this.webengageService.webengageTrackEvent("Alcohol Consumption Submitted", {
      "Response": false,
      "Member Selected": ""
    });
  }
}

checkboxChanged(member: string) {
  console.log('Checkbox value changed for member:', member);
  console.log('New value:', this.MedicalMembers[member]);
  if(this.MedicalMembers[member]==true){
    this.errorNoMedicalCheckboxSelected = false
  }
  if(this.MedicalMembers[member]==false){
    this.selectionStates[member] = {};
  }
 
}


//NEW CHANGES-------------------
checkboxChangedAlcohol(member: string) {
  console.log('Checkbox value changed for member:', member);
  console.log('New value:', this.AlcoholMembers[member]);
  if(this.AlcoholMembers[member]==true){
    this.errorNoAlcoholCheckboxSelected = false;
  }
  if(this.AlcoholMembers[member]==false){
    this.alcoholFrequency[member] = {};
  }
  this.errorNoAlcoholFrequencySelected = false
}

checkboxChangedTobacco(member: string) {
  console.log('Checkbox value changed for member:', member);
  console.log('New value:', this.TobaccoMembers[member]);
  if(this.TobaccoMembers[member]==true){
    this.errorNoTobaccoCheckboxSelected = false;
  }
} //TEST
//NEW CHANGES-------------------

selectTobacco(option: string) {
  setTimeout(() => {
    $(window).scrollTop(0);
  }, 300)
  // console.log("question3:",option)

  // $('#submit2').click(function () {
  //   $(window).scrollTop(0);
  //   }) 

  this.TobaccoAns = option;

  if (this.TobaccoAns == '1') {
    // Proceed to choose family members who consume alcohol
    this.showTobaccoMembers = true;
    this.TobaccoMembers = {}
    if (this.total_members == 1) {
      this.showTobaccoMembers = false;
      for (const member in this.memberDetailObject) {
        if (this.memberDetailObject.hasOwnProperty(member)) {
          const key = this.memberDetailObject[member].memberType;
          this.TobaccoMembers[key] = true;
          this.webengageService.webengageTrackEvent("Tobacco Use Submitted", {
            "Response": true,
            "Member Selected": key
          });
        }
      }
      this.selectTobaccoMembers()
    }
  } else {
    if(this.newProgressWithMedical){
      this.newprogressWidth='99%'
    } else {
      this.newprogressWidth='99%'
    }
    this.showTobaccoMembers = false;
    for (const key in this.TobaccoMembers) {
      this.TobaccoMembers[key]=false;
      if (this.TobaccoMembers.hasOwnProperty(key) && this.TobaccoMembers[key] === false) {
        if (key === 'son' || key === 'daughter') {
          const member = this.memberDetailObject.find((m: any) => m.memberType == `${key}1`.toString());
          member.consume_tobacco = "0";
          // member.consume_tobacco_frequency = ""; //TEST
        }else {
        const member = this.memberDetailObject.find((m: any) => m.memberType == key.toString());
          member.consume_tobacco = "0";
          // member.consume_tobacco_frequency = ""; //TEST
        }
  
      }
    }
    
    let Dataobj= {
      "visitor_id":sessionStorage.getItem('visitorId'),
      "step_number":"step7",
      "formdata": {
        "TobaccoAns":this.TobaccoAns,
        "TobaccoMembers": [""]
      }
    }

    this.service.createStepData(Dataobj).subscribe((data: any) => {
      var dataSuccess = data["success"];
    });

    this.webengageService.webengageTrackEvent("Tobacco Use Submitted", {
      "Response": false,
      "Member Selected": ""
    });

    if(this.medicalhistory==1){
      this.currentDiv = 'medicalhistoryDiv';
      this.MedicalAns = '1';  
      this.showMedicalMembers = true;
      if (this.total_members == 1) {
        for (const member in this.memberDetailObject) {
          if (this.memberDetailObject.hasOwnProperty(member)) {
            const key = this.memberDetailObject[member].memberType;
            this.MedicalMembers[key] = true;
          }
        }
      }
    }else{
      var obj ={
        "memberDetail": this.memberDetailObject
      }
      this.service.setGlobalData(obj);
      sessionStorage.removeItem('reviewPageData')
      this.router.navigateByUrl('health-insurance-second-opinion/review');
    }

  }
}

selectMedicalHistory(option: any){
  this.errorNoMedicalCheckboxSelected = false;
  this.MedicalAns =option;
  if (option == '1') {
    // Proceed to choose family members who consume alcohol
    this.showMedicalMembers = true;
    this.MedicalMembers = {};
    this.MemberDisease =  true;
  } else {
    this.showMedicalMembers = false;
    this.MemberDisease =  false;
    for (const key in this.MedicalMembers) {
      this.MedicalMembers[key] = false;
      if (this.MedicalMembers.hasOwnProperty(key) && this.MedicalMembers[key] === false) {
        if (key === 'son' || key === 'daughter') {
          const member = this.memberDetailObject.find((m: any) => m.memberType === `${key}1`.toString());
          member.PED_status = "0";
          member.PED_text = "";
          member.PED_value = "";
        } else{
        const member = this.memberDetailObject.find((m: any) => m.memberType == key.toString());
          member.PED_status = "0";
          member.PED_text = "";
          member.PED_value = "";
        }

      }
    }
    sessionStorage.setItem('lifestyle-MedicalMembers', JSON.stringify(this.MedicalMembers));
    let Dataobj= {
      "visitor_id":sessionStorage.getItem('visitorId'),
      "step_number":"step8",
      "formdata": {
        "MedicalAns":this.MedicalAns,
        "MedicalMembers": [""]
      }
    }

    this.service.createStepData(Dataobj).subscribe((data: any) => {
      var dataSuccess = data["success"];
    });

    var objj ={
      "medical_history": "0"
    }
    this.service.setGlobalData(objj);
    this.service.setMedicalHistory(0)

    var obj ={
      "memberDetail": this.memberDetailObject
    }
    this.service.setGlobalData(obj);
    sessionStorage.removeItem('reviewPageData')
    this.router.navigateByUrl('health-insurance-second-opinion/review');
  }
}



selectOption(option: string) {
  setTimeout(() => {
    $(window).scrollTop(0);
  }, 300)
      // Process answer for question 1
      // console.log("Question 1:", option);
      if(this.newProgressWithMedical){
        this.newprogressWidth='50%'
      } else {
        this.newprogressWidth='66%'
      }
      
      this.physicalExercise= option;
      // Proceed to next question
      
      let Dataobj= {
        "visitor_id":sessionStorage.getItem('visitorId'),
        "step_number":"step5",
        "formdata": {"physicalExercise":this.physicalExercise}
      }

      // Loop through memberDetailObject
      for (let i = 0; i < this.memberDetailObject.length; i++) {
        // Set physical_activity for each member in medicalhistory
        this.memberDetailObject[i]["physical_activity"] = this.physicalExercise;
      }

      this.service.createStepData(Dataobj).subscribe((data: any) => {
        var dataSuccess = data["success"];
      });

      if(this.AlcoholAns == '1'){
        this.showAlcoholMembers = true;
        if (this.total_members == 1) {
          for (const member in this.memberDetailObject) {
            if (this.memberDetailObject.hasOwnProperty(member)) {
              const key = this.memberDetailObject[member].memberType;
              this.AlcoholMembers[key] = true;
            }
          }
        }
      }

      this.webengageService.webengageTrackEvent("Family Engagement Submitted", {
        "Response": this.physicalExercise,
      });
      
      this.currentDiv = 'alcoholDiv';
}



selectAlcoholMembers() {
  setTimeout(() => {
    $(window).scrollTop(0);
  }, 300)
  // Check if at least one checkbox is checked
  const atLeastOneChecked = Object.values(this.AlcoholMembers).some(member => member);
  
  if (!atLeastOneChecked) {
    // Set error state to true
    this.errorNoAlcoholCheckboxSelected = true;
    this.errorNoAlcoholFrequencySelected = false;
    return; // Exit function if no checkbox is checked
  }

  if(this.newProgressWithMedical){
    this.newprogressWidth='75%'
  } else {
    this.newprogressWidth='99%'
  }
  // Reset error state if checkboxes are checked
  this.errorNoAlcoholCheckboxSelected = false;


  //NEW CHANGES-------------------
  let allMembersHaveFrequency = true;
  // Check if at least one family member with a medical history is selected
  for (const memberType of Object.keys(this.AlcoholMembers)) {
    if (this.AlcoholMembers[memberType]) {

      // Check if at least one disease is selected for the selected family member
      const frequency = Object.keys(this.alcoholFrequency[memberType] || {}).filter(frequency => this.alcoholFrequency[memberType][frequency]);
      
      // Check if frequency array is empty or contains only empty strings
      if (frequency.length === 0 || (frequency.length === 1 && frequency[0] === "")) {
        allMembersHaveFrequency = false;
        break;
      }
    }
  }


  if (!allMembersHaveFrequency) {
    this.errorNoAlcoholFrequencySelected = true;
    this.errorNoAlcoholCheckboxSelected = false;
    return;
  } else {
    this.errorNoAlcoholFrequencySelected = false;
  }
//NEW CHANGES-------------------

  // console.log("Family members who consume alcohol:", this.AlcoholMembers);
  // console.log("Family members who consume alcohol:", this.memberDetailObject);

  var AlcoholMembers = [];
    for (const key in this.AlcoholMembers) {
      const memberType = key
        if (this.AlcoholMembers.hasOwnProperty(key) && this.AlcoholMembers[key] === true) {
          if (key === 'son' || key === 'daughter') {
            const member = this.memberDetailObject.find((m: any) => m.memberType === `${key}1`.toString());
            member.consume_alcohol = "1";
            AlcoholMembers.push(`${key}1`);
          } else{
          const member = this.memberDetailObject.find((m: any) => m.memberType == memberType.toString());
          console.log(memberType,member)
          member.consume_alcohol = "1";
          AlcoholMembers.push(memberType);
          }

        }
        if (this.AlcoholMembers.hasOwnProperty(key) && this.AlcoholMembers[key] === false) {
          if (key === 'son' || key === 'daughter') {
            const member = this.memberDetailObject.find((m: any) => m.memberType === `${key}1`.toString());
            member.consume_alcohol = "0";
            member.consume_alcohol_frequency = "";
          } else{
          const member = this.memberDetailObject.find((m: any) => m.memberType == memberType.toString());
            member.consume_alcohol = "0";
            member.consume_alcohol_frequency = "";
          }

        }
    }

    const filteredData = this.memberDetailObject.map(member => {
      return {
        memberType: member.memberType,
        consume_alcohol: member.consume_alcohol,
        consume_alcohol_frequency: member.consume_alcohol_frequency
      };
    });    
  
    let Dataobj= {
      "visitor_id":sessionStorage.getItem('visitorId'),
      "step_number":"step6",
      "formdata": {
        "AlcoholAns":this.AlcoholAns,
        "AlcoholMembers": filteredData
      }
    }

    this.service.createStepData(Dataobj).subscribe((data: any) => {
      var dataSuccess = data["success"];
    });

    if (this.total_members == 1) {
      this.showTobaccoMembers = false;
    }

    this.webengageService.webengageTrackEvent("Alcohol Consumption Submitted", {
      "Response": true,
      "Member Selected": Object.keys(this.AlcoholMembers).join(', ')
    });

  this.currentDiv = 'tobaccoDiv';

}

//NEW CHANGES-------------------
alcoholMemberFrequency(category:any, frequency:any){
  this.errorNoAlcoholFrequencySelected = false;
  // if (!this.alcoholFrequency[category]) {
    this.alcoholFrequency[category] = {};
  // }
  this.alcoholFrequency[category][frequency] = !this.alcoholFrequency[category][frequency];

  this.AlcoholMembers[category] = true;

  let member;
  if (category === 'son' || category === 'daughter') {
    member = this.memberDetailObject.find((m: any) => m.memberType === `${category}1`);
  } else {
    member = this.memberDetailObject.find((m: any) => m.memberType === category);
  }

  if (member) {
    member.consume_alcohol_frequency = frequency;
  }
  
}
//NEW CHANGES-------------------

selectTobaccoMembers() {
  setTimeout(() => {
    $(window).scrollTop(0);
  }, 300)
  // Check if at least one checkbox is checked
  const atLeastOneChecked = Object.values(this.TobaccoMembers).some(member => member);
  
  if (!atLeastOneChecked) {
    // Set error state to true
    this.errorNoTobaccoCheckboxSelected = true;
    return; // Exit function if no checkbox is checked
  }

  if(this.newProgressWithMedical){
    this.newprogressWidth='75%'
  } else {
    this.newprogressWidth='99%'
  }

  // Reset error state if checkboxes are checked
  this.errorNoTobaccoCheckboxSelected = false;

  //NEW CHANGES-------------------
  // let allMembersHaveFrequency = true;
  // // Check if at least one family member with a medical history is selected
  // for (const memberType of Object.keys(this.TobaccoMembers)) {
  //   if (this.TobaccoMembers[memberType]) {

  //     // Check if at least one disease is selected for the selected family member
  //     const frequency = Object.keys(this.tobaccoFrequency[memberType] || {})
  //                                     .filter(frequency => this.tobaccoFrequency[memberType][frequency]);
  //     if (frequency.length === 0) {
  //       allMembersHaveFrequency = false;
  //       break;
  //     }
  //   }
  // }

  // if (!allMembersHaveFrequency) {
  //   this.errorNoTobaccoFrequencySelected = true;
  //   return;
  // } else {
  //   this.errorNoTobaccoFrequencySelected = false;
  // } //TEST
//NEW CHANGES-------------------

  var TobaccoMembers = []
  for (const key in this.TobaccoMembers) {
    const memberType = key
    if (this.TobaccoMembers.hasOwnProperty(key) && this.TobaccoMembers[key] === true) {
      if (key === 'son' || key === 'daughter') {
        const member = this.memberDetailObject.find((m: any) => m.memberType == `${key}1`.toString());
        member.consume_tobacco = "1";
        TobaccoMembers.push(`${key}1`);
      } else {
        const member = this.memberDetailObject.find((m: any) => m.memberType == memberType.toString());
        member.consume_tobacco = "1";
        TobaccoMembers.push(memberType);
      }


    }
    if (this.TobaccoMembers.hasOwnProperty(key) && this.TobaccoMembers[key] === false) {
      if (key === 'son' || key === 'daughter') {
        const member = this.memberDetailObject.find((m: any) => m.memberType == `${key}1`.toString());
        member.consume_tobacco = "0";
        // member.consume_tobacco_frequency = ""; //TEST
      }else {
      const member = this.memberDetailObject.find((m: any) => m.memberType == memberType.toString());
        member.consume_tobacco = "0";
        // member.consume_tobacco_frequency = ""; //TEST
      }

    }
  }

  // const filteredData = this.memberDetailObject.map(member => {
  //   return {
  //     memberType: member.memberType,
  //     consume_tobacco: member.consume_tobacco,
  //     consume_tobacco_frequency: member.consume_tobacco_frequency
  //   };
  // }); //TEST


  // console.log("Family members who use Tobacco:", this.TobaccoMembers);
  let Dataobj= {
    "visitor_id":sessionStorage.getItem('visitorId'),
    "step_number":"step7",
    "formdata": {
      "TobaccoAns":this.TobaccoAns,
      "TobaccoMembers": TobaccoMembers
      // "TobaccoMembers": filteredData //TEST
    }
  }
   this.service.createStepData(Dataobj).subscribe((data: any) => {
          var dataSuccess = data["success"];
        });

        this.webengageService.webengageTrackEvent("Tobacco Use Submitted", {
          "Response": true,
          "Member Selected": Object.keys(this.TobaccoMembers).join(', ')
        });

        if(this.medicalhistory == "1"){
          this.currentDiv = 'medicalhistoryDiv';
          this.MedicalAns = '1';
          this.showMedicalMembers = true;
          if (this.total_members == 1) {
            for (const member in this.memberDetailObject) {
              if (this.memberDetailObject.hasOwnProperty(member)) {
                const key = this.memberDetailObject[member].memberType;
                this.MedicalMembers[key] = true;
              }
            }
          }
        } else {
          sessionStorage.setItem('lifestyle-AlcoholMembers', JSON.stringify(this.AlcoholMembers));
          sessionStorage.setItem('lifestyle-TobaccoMembers', JSON.stringify(this.TobaccoMembers));
          // console.log("noo")
          var obj ={
            "memberDetail": this.memberDetailObject
          }
          this.service.setGlobalData(obj);
          sessionStorage.removeItem('reviewPageData')
          this.router.navigateByUrl('health-insurance-second-opinion/review');
        }
    
}

//NEW CHANGES-------------------
// tobaccoMemberFrequency(category:any, frequency:any){
//   if (!this.tobaccoFrequency[category]) {
//     this.tobaccoFrequency[category] = {};
//   }
//   this.tobaccoFrequency[category][frequency] = !this.tobaccoFrequency[category][frequency];

//   let member;
//   if (category === 'son' || category === 'daughter') {
//     member = this.memberDetailObject.find((m: any) => m.memberType === `${category}1`);
//   } else {
//     member = this.memberDetailObject.find((m: any) => m.memberType === category);
//   }

//   if (member) {
//     member.consume_tobacco_frequency = frequency;
//   }
// } //TEST
//NEW CHANGES-------------------

finalsubmit(): void {
  this.errorNoMedicalCheckboxSelected = false
  let atLeastOneMemberChecked = false;
  let allMembersHaveDiseaseSelected = true;

    $(window).scrollTop(0);
  

  // Check if at least one family member with a medical history is selected
  for (const memberType of Object.keys(this.MedicalMembers)) {
    if (this.MedicalMembers[memberType]) {
      atLeastOneMemberChecked = true;

      // Check if at least one disease is selected for the selected family member
      const selectedDiseases = Object.keys(this.selectionStates[memberType] || {})
                                      .filter(condition => this.selectionStates[memberType][condition]);
      if (selectedDiseases.length === 0) {
        allMembersHaveDiseaseSelected = false;
        break;
      }
    }
  }

  // Check if any value exists in MedicalMembers JSON object
  const medicalMembersExist = Object.values(this.MedicalMembers).some(value => value);

  // Hide error message if any value exists in MedicalMembers JSON object
  this.errorNoMedicalCheckboxSelected = !medicalMembersExist;

  if (!allMembersHaveDiseaseSelected) {
    this.errorNoDiseaseSelected = true;
  } else {
    this.errorNoDiseaseSelected = false;
  }

  // If all validations pass, proceed to the next step
  if (!this.errorNoMedicalCheckboxSelected && !this.errorNoDiseaseSelected) {

    for (const key in this.MedicalMembers) {
      const memberType = key
        if (this.MedicalMembers.hasOwnProperty(key) && this.MedicalMembers[key] === true) {
          if (key === 'son' || key === 'daughter') {
            const member = this.memberDetailObject.find((m: any) => m.memberType === `${key}1`.toString());
            member.PED_status = "1";
            // member.PED_text = "";
            // member.PED_value = "";
          } else{
          const member = this.memberDetailObject.find((m: any) => m.memberType == memberType.toString());
            member.PED_status = "1";
            // member.PED_text = "";
            // member.PED_value = "";
          }

        }
        if (this.MedicalMembers.hasOwnProperty(key) && this.MedicalMembers[key] === false) {
          if (key === 'son' || key === 'daughter') {
            const member = this.memberDetailObject.find((m: any) => m.memberType === `${key}1`.toString());
            member.PED_status = "0";
            member.PED_text = "";
            member.PED_value = "";
          } else{
          const member = this.memberDetailObject.find((m: any) => m.memberType == memberType.toString());
          member.PED_status = "0";
          member.PED_text = "";
          member.PED_value = "";
          }

        }
    }

    sessionStorage.setItem('lifestyle-AlcoholMembers', JSON.stringify(this.AlcoholMembers));
    sessionStorage.setItem('lifestyle-TobaccoMembers', JSON.stringify(this.TobaccoMembers));
    sessionStorage.setItem('lifestyle-MedicalMembers', JSON.stringify(this.MedicalMembers));

    var obj ={
      "memberDetail": this.memberDetailObject
    }
    this.service.setGlobalData(obj);

    const filteredData = this.memberDetailObject.map(member => {
      return {
        memberType: member.memberType,
        PED_status: member.PED_status,
        PED_value: member.PED_value,
        PED_text: member.PED_text
      };
    });

    let Dataobj= {
      "visitor_id":sessionStorage.getItem('visitorId'),
      "step_number":"step8",
      "formdata": {
        "MedicalAns":this.MedicalAns,
        "MedicalMembers": filteredData
      }
    }

    this.service.createStepData(Dataobj).subscribe((data: any) => {
      var dataSuccess = data["success"];
    });

    this.webengageService.webengageTrackEvent("Medical", {
      "Response": true,
      "Member Selected": Object.keys(this.MedicalMembers).join(', ')
    });

    sessionStorage.removeItem('reviewPageData')
    this.router.navigateByUrl('health-insurance-second-opinion/review');
  }
}



backBtn(){
  console.log('back')
  if(this.currentDiv =='physicalexerciseDiv'){
    sessionStorage.setItem('backFromPage', 'lifeStyleDetails')
    this.router.navigateByUrl('health-insurance-second-opinion/basic-details');
  }
  else if(this.currentDiv == 'alcoholDiv'){
    if(this.newProgressWithMedical){
      this.newprogressWidth='25%'
    } else {
      this.newprogressWidth='33%'
    }
    this.currentDiv = 'physicalexerciseDiv';
  }
  else if(this.currentDiv == 'tobaccoDiv'){
    if(this.newProgressWithMedical){
      this.newprogressWidth='50%'
    } else {
      this.newprogressWidth='66%'
    }
    this.currentDiv = 'alcoholDiv';
  }
  else if(this.currentDiv == 'medicalhistoryDiv'){
    if(this.newProgressWithMedical){
      this.newprogressWidth='75%'
    } else {
      this.newprogressWidth='99%'
    }
    this.currentDiv = 'tobaccoDiv';
  }
}


formatMemberNames(member:string){
  if(member=='fatherInLaw' || member=='motherInLaw'){
    return member.replace(/([A-Z])/g, '-$1').replace(/(^|-)([a-z])/g, (_, a, b) => a + b.toUpperCase());
  }else{
    return member.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
  }
}

}
