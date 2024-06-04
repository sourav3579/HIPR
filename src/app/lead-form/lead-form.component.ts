import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { WebengageService } from '../service/webengage.service';
import { AESEncryptionService } from '../service/aesencryption.service';
declare var $: any;

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.css']
})
export class LeadFormComponent implements OnInit {
  Errorshow:boolean = false;
  ErrorshowAge: boolean = false;

  showBabyPlanDiv: boolean = true;

  visitorId: any = '0';
  leadId: any = '';

  progressWidth: string = '25%';
  currentDiv: string= 'personalDetailsDiv';

  gender: string = 'Male';
  activeGender: string = 'Male';
  addMoreMembers: boolean = false;

  medicalHistory: string = '0';

  annualIncomeRange: any;
  globalTreatment!: boolean;
  planBaby!: boolean;

  continueErrorMsg: string ='';

  stepNumber: number = 1;

  insureOptions: any = {
    self: false,
  };

  additonalInsureOptions: any = {
  };

  selectedMembers: string[] = [];

  memberIcons: string[] = [];

  memberCount: any;
  
  memberImages: { [key: string]: number } = {
    'self': 1,
    'spouse': 2,
    'son': 3,
    'daughter': 4,
    'brother': 5,
    'sister': 6,
    'father': 7,
    'mother': 8,
    'grandMother': 9,
    'grandFather': 10,
    'motherInLaw': 11,
    'fatherInLaw': 12,
    // 'sonInLaw': 13,
  };

  iconValues: number[] = [];


  finalInsureOptions: any;
  total_members: number = 0;
  annualRangeId: any;

  form1Changed: boolean = false;
  otherFormChanged: boolean = false;


  //--------------------------------------------phase_2
  selfmemberAge: string ='';
  spousememberAge: string ='';
  fathermemberAge: string ='';
  mothermemberAge: string ='';
  s1memberAge: string ='';
  s2memberAge: string ='';
  s3memberAge: string ='';
  d1memberAge: string ='';
  d2memberAge: string ='';
  d3memberAge: string ='';
  fatherILmemberAge : string = '';
  motherILmemberAge : string = '';
  grandFmemberAge : string = '';
  grandMmemberAge : string = '';

  memberTypes: any[]=[];
  member1forValidation: any;
  member2forValidation: any;
  dissableSubmit: boolean = false;
  selfAge: { [key: string]: number } = {};
  spouseAge: { [key: string]: number } = {};
  otherAdultAges: { [key: string]: number } = {};
  f_m_Ages : { [key: string]: number } = {};
  inLawAges: { [key: string]: number } = {};
  childAges: { [key: string]: number } = {};
  childParentAges: { [key: string]: number } = {};
  grandAges: { [key: string]: number } = {};
  ageValidateMessage: string = '';

  selfMinAge: number = 18;
  spouseMinAge: number = 18;

  sonMinAge: number = 3;
  daughterMinAge: number = 3;

  brotherMinAge: number = 18;
  SisterMinAge: number = 18;
  fatherMinAge: number = 36;
  motherMinAge: number = 36;
  fatherInLawMinAge: number = 36;
  motherInLawMinAge: number = 36;
  grandFatherMinAge: number = 54;
  grandMotherMinAge: number = 54;

  selfAgeDropDown: any[] = [];
  spouseAgeDropDown: any[] = [];

  sonAgeDropDown: any[] = [];
  daughterAgeDropDown: any[] = [];

  brotherAgeDropDown: any[] = [];
  sisterAgeDropDown: any[] = [];
  fatherAgeDropDown: any[] = [];
  motherAgeDropDown: any[] = [];
  fatherInLawAgeDropDown: any[] = [];
  motherInLawAgeDropDown: any[] = [];
  grandFatherAgeDropDown: any[] = [];
  grandMotherAgeDropDown: any[] = [];

  memberDetailsArr: any[] = [];

  ageValidationArray : any[] = [];

  multipleChild: string[] = [];

  name: any;
  nameValidateMsg: string = '';


  pincodeValidateMsg: string = '';
  pincodeArr:any[]=[];
  hideSuggestion:boolean = false;
  selectedProduct:string = "";
  citycode:string="";
  pincode:any;
  city: string = "";
  

  constructor(private service: ApiService, private router: Router, private cdr: ChangeDetectorRef, private webengageService :WebengageService, private _encryptionService: AESEncryptionService){}

  ngOnInit(): void {
    this.createVisitor();
    

    var basicDetails = sessionStorage.getItem('basicDetails');
    if (!basicDetails) {
      console.log('basicDetails not found in session.');
      this.selectMember('self')
      this.dissableSubmit = true;
    }

    // if(!sessionStorage.getItem('FINAL_global_data')){
    //   this.selectMember('self')
    // }

    var FINAL_global_data = JSON.parse(sessionStorage.getItem('FINAL_global_data')  || '{}');
    var editFromPage = sessionStorage.getItem("editDeatils");
    if(editFromPage == 'fromReviewPage-basic' || editFromPage == 'fromVerification-basic'){
      this.selectedMembers = this.getSelectedMembers(FINAL_global_data.iconDetails)
      this.activeGender = FINAL_global_data.gender
      this.medicalHistory = FINAL_global_data.medical_history
      this.annualIncomeRange = FINAL_global_data.annualIncomeRange
      this.globalTreatment = FINAL_global_data.international_treatment == 1 ? true : false
      if(FINAL_global_data.maternity_cover !== '') {
        this.planBaby = FINAL_global_data.maternity_cover == 1? true : false
      }
      this.getActiveGenderIcon()
      var data = FINAL_global_data.memberData
      for (const key in data) {
        const value = data[key];
        if(key == 'son' || key == 'daughter'){
          this.insureOptions[key] = value;
        } else {
          this.insureOptions[key] = true;
        }
      }
      this.checkForMoreMembers(this.selectedMembers)

      //--------------------------------------------phase_2
      this.name = FINAL_global_data.name;
      this.pincode = FINAL_global_data.pincode;
      this.memberDetailsArr = [];
      this.memberDetailsArr = FINAL_global_data.member
      for (let i = 0; i < this.memberDetailsArr.length; i++) {
        this.multipleChild.push(this.memberDetailsArr[i].memberType);
        this.setMemberAge(this.memberDetailsArr[i].memberType, this.memberDetailsArr[i].age+' '+this.memberDetailsArr[i].age_type)
      }
            //--------------------------------------------phase_2

    } else{
      var basicDetails = sessionStorage.getItem('basicDetails');
      var iconDetails  = sessionStorage.getItem('iconDetails');
      if(iconDetails !==null){
        var iconArray = this.getSelectedMembers(JSON.parse(iconDetails)); // Parse the string into an array
        this.selectedMembers = []
        for (let i = 0; i < iconArray.length; i++) {
          
          this.selectedMembers.push(iconArray[i]); // Push each value from the array into selectedMembers
        }
      }

      if (basicDetails !== null) {
        var obj = JSON.parse(basicDetails);
        var data = obj.formdata;
        this.activeGender = data.gender;
        this.medicalHistory = data.medicalHistory;

        for (const key in data) {
          if (key != 'gender' && key != 'medicalHistory') {
              const value = data[key];
              if(key == 'son' || key == 'daughter'){
                this.insureOptions[key] = value;
              } else {
                this.insureOptions[key] = true;
              }
          }
        }
        this.getActiveGenderIcon()

        //--------------------------------------------phase_2
        this.name = obj.name;
        this.pincode = obj.pincode;
        var memberData = obj.memberData
        this.memberDetailsArr = [];
        this.memberDetailsArr = memberData
        for (let i = 0; i < this.memberDetailsArr.length; i++) {
          this.multipleChild.push(this.memberDetailsArr[i].memberType);
          this.setMemberAge(this.memberDetailsArr[i].memberType, this.memberDetailsArr[i].age+' '+this.memberDetailsArr[i].age_type)
        }
        //--------------------------------------------phase_2
      }
        this.annualIncomeRange = sessionStorage.getItem('incomeRange')
        this.annualRangeId = sessionStorage.getItem('annualRangeId')
        var globalTreatmentValue = sessionStorage.getItem('globalTreatment')
        if (globalTreatmentValue) {
          this.globalTreatment = globalTreatmentValue === '1' ? true : false;
        }
        var planBaby = sessionStorage.getItem('planBaby')
        if (planBaby !== null) {
          this.planBaby = planBaby === '1' ? true : false;
        }

        if (iconDetails) {
          this.checkForMoreMembers(iconDetails)
        }
      }

      var darktoggle = document.querySelectorAll("#top");
      $(darktoggle).removeClass('bg-white');

      
      // $(window).scrollTop(0);
      setTimeout(() => {
        $(window).scrollTop(0);
      }, 300)
      var backFromPage = sessionStorage.getItem('backFromPage');
      if(backFromPage=='lifeStyleDetails'){

        if(this.planBaby == true || this.planBaby == false){
          this.currentDiv = 'babyPlanDiv';
          this.stepNumber = 4
          this.progressWidth = "99%";
        } else {
          this.currentDiv = 'globalTreatDiv';
          this.stepNumber = 3
          this.progressWidth = "99%";
        }

        // document.getElementById('nextBTN')!.style.display = 'none';
        
        var formData = JSON.parse(sessionStorage.getItem('formData') || '{}')
        if (formData !== null) {
          this.memberCount = formData.insureOptions
          this.iconValues = [];
          this.iconValues = formData.icon_ids
          this.medicalHistory = formData.medicalHistory
        }
        var globalData = JSON.parse(sessionStorage.getItem('global_data') || '{}')
        if (globalData !== null) {
          this.total_members = globalData.member_count
          this.selectedMembers = this.getSelectedMembers(globalData.iconDetails)
          this.iconValues = [];
          this.iconValues =  globalData.iconIds

          //--------------------------------------------phase_2
          this.name = globalData.name
          this.pincode = globalData.pincode
          this.memberDetailsArr = [];
          this.memberDetailsArr = globalData.member
          for (let i = 0; i < this.memberDetailsArr.length; i++) {
            this.multipleChild.push(this.memberDetailsArr[i].memberType);
            this.setMemberAge(this.memberDetailsArr[i].memberType, this.memberDetailsArr[i].age+' '+this.memberDetailsArr[i].age_type)
          }
          //--------------------------------------------phase_2
        }
      }

      if (this.insureOptions.self && this.insureOptions.spouse) {
          this.showBabyPlanDiv = true;
      } else if (this.insureOptions.spouse) {
          this.showBabyPlanDiv = true;
      } else {
          this.showBabyPlanDiv = false;
          sessionStorage.removeItem('planBaby')
      }

      this.testPopulateAges();
      this.testPopulateAgesChild();
      // sessionStorage.removeItem('backFromPage');
      this.form1Changed = false;

      this.memberIcons = []
      for (const [key, value] of Object.entries(this.insureOptions)) {
        if(value == true){
          this.memberIcons.push(key);
        }else if (typeof value == 'number' && value > 0) {
            for (let i = 1; i <= value; i++) {
                this.memberIcons.push(key+' '+i);
            }
        }
      }
  }

  getSelectedMembers(iconDetails: string[]): string[] {
    const selectedMembers = [];
    let hasSon = false;
    let hasDaughter = false;

    for (const member of iconDetails) {
        if (member.startsWith('son')) {
            hasSon = true;
        } else if (member.startsWith('daughter')) {
            hasDaughter = true;
        } else {
            selectedMembers.push(member);
        }
    }

    if (hasSon) {
        selectedMembers.push('son');
    }

    if (hasDaughter) {
        selectedMembers.push('daughter');
    }

    return selectedMembers;
}

  getPincodeList() {
    if (this.pincode?.length > 1) {
      this.service.cityFiler(this.pincode).subscribe((response:any) => {
        this.hideSuggestion = true;
        this.pincodeArr = response['data'];
      });
    } else {
      this.hideSuggestion = false;
      this.pincodeArr = [];
    }
  }

  setpincode(pinObj:any)
  {      
    this.citycode = pinObj.citycode;
    this.pincode = pinObj.pincode;
    this.city = pinObj.cityname;
    this.hideSuggestion = false;
    this.handleInputChange();
  }

  hideSuggestionDiv(){
   this.hideSuggestion = false;
   if(this.pincode){
   this.pincodeValidateMsg = "";
   }
  } 


  openSuggestionBox(event: any) {
    let val = event.target.value
    if (val.length > 0) {
      this.hideSuggestion = true;
    }
  }



  getActiveGenderIcon() {
    if (this.activeGender === 'Female') {
      this.memberImages['self'] = 2;
      this.memberImages['spouse'] = 1;
    } else if (this.activeGender === 'Male') {
      this.memberImages['self'] = 1;
      this.memberImages['spouse'] = 2;
    }
  }

  checkForMoreMembers(checkForMoreMembers:any){
    const valuesToCheck = ["brother", "sister", "grandFather", "grandMother", "motherInLaw", "fatherInLaw"];
    if (valuesToCheck.some(value => checkForMoreMembers!.includes(value))) {
      this.addMoreMembers = true;
    }
  }
  setActiveGender(gender: string) {
    this.form1Changed = true;
    this.activeGender = gender;
    this.gender = gender;

    if (gender === 'Female') {
      this.memberImages['self'] = 2;
      this.memberImages['spouse'] = 1;
    } else if (this.activeGender === 'Male') {
      this.memberImages['self'] = 1;
      this.memberImages['spouse'] = 2;
    }
  }
  


  isSelected(member: string): boolean {
    return this.selectedMembers.includes(member);
  }
  
  selectMember(member: string){
    this.form1Changed = true;

    // this.dissableSubmit = false;
    this.continueErrorMsg = '';
    this.Errorshow=false
    this.ErrorshowAge=false;

    const index = this.selectedMembers.indexOf(member);
    if (index === -1) {
      if (member === 'self') {
        // If "self" is selected, put it at index 0 and shift others
        this.selectedMembers.unshift(member);
      } else {
        // If other members are selected, push them to the end
        this.selectedMembers.push(member);
      }
      this.insureOptions[member] = true;
    } else {
      this.selectedMembers.splice(index, 1); // Remove from selected members if already selected
      
      // ---phase_2
      this.removeMemberAge(member);
      // ---phase_2

      if (member === 'self') {
        this.insureOptions[member] = false;
      } else {
        delete this.insureOptions[member];
      }

    }

    this.memberIcons = []
    for (const [key, value] of Object.entries(this.insureOptions)) {
      if(value == true){
        this.memberIcons.push(key);
      }else if (typeof value == 'number' && value > 0) {
          for (let i = 1; i <= value; i++) {
              this.memberIcons.push(key+' '+i);
          }
      }
    }
  }

  toggleChild(option: string) {
    // this.dissableSubmit = false
    this.continueErrorMsg = '';
    this.Errorshow=false;
    this.ErrorshowAge=false;

    this.form1Changed = true;

    if(this.insureOptions[option]){
      this.insureOptions[option] = this.insureOptions[option] === 0 ? 1 : 0;
    } else {
      this.insureOptions[option] = 1
    }
    const index = this.selectedMembers.indexOf(option);
    if (index === -1) {
      this.selectedMembers.push(option); // Add to selected members
    } else {
      this.selectedMembers.splice(index, 1); // Remove from selected
    }
    if(this.insureOptions[option] == 0){
      delete this.insureOptions[option];

      //-------phase_2
      if(option === 'son'){
        this.removeMemberAge('son1');
      }
      if(option === 'daughter'){
        this.removeMemberAge('daughter1');
      }
      //-------phase_2
      
    }

    this.memberIcons = []
    for (const [key, value] of Object.entries(this.insureOptions)) {
      if(value == true){
        this.memberIcons.push(key);
      }else if (typeof value == 'number' && value > 0) {
          for (let i = 1; i <= value; i++) {
              this.memberIcons.push(key+' '+i);
          }
      }
    }
    
  }

  incrementChild(option: string,event: Event) {
    event.stopPropagation(); // Stop event propagation

    this.form1Changed = true;
    // this.dissableSubmit = false;
    this.continueErrorMsg = '';
    this.Errorshow=false;
    this.ErrorshowAge=false;

    const index = this.selectedMembers.indexOf(option);
    if (index === -1) {
      this.selectedMembers.push(option); // Add to selected members
    }
    if(this.insureOptions[option]){
      this.insureOptions[option]++;

      //-------------phase_2
      if(option === 'son'){
        this.multipleChild.push('son'+ this.insureOptions[option]);
      }
      if(option === 'daughter'){
        this.multipleChild.push('daughter'+ this.insureOptions[option]);
      }
      //-------------phase_2
    } else {
      this.insureOptions[option] = 1;
    }
    console.log('increment',this.selectedMembers)
    this.memberIcons = []
    for (const [key, value] of Object.entries(this.insureOptions)) {
      if(value == true){
        this.memberIcons.push(key);
      }else if (typeof value == 'number' && value > 0) {
          for (let i = 1; i <= value; i++) {
              this.memberIcons.push(key+' '+i);
          }
      }
    }
    
  }
  
  decrementChild(option: string, event: Event) {
    event.stopPropagation(); // Stop event propagation

    this.form1Changed = true;
    // this.dissableSubmit = false;
    this.continueErrorMsg = '';
    this.Errorshow=false;
    this.ErrorshowAge=false;

    if (this.insureOptions[option] > 0) {
        //-------------phase_2
        if (this.insureOptions[option] == 2 || this.insureOptions[option] == 3){
          const index = this.multipleChild.indexOf(option+this.insureOptions[option]);
          if (index !== -1) {
            this.multipleChild.splice(index, 1);
          }
        }
        this.removeMemberAge(option+this.insureOptions[option]);
        //-------------phase_2
        this.insureOptions[option]--;
    }
    if (this.insureOptions[option] == 0) {
      const index = this.selectedMembers.indexOf(option);
      if (index !== -1) {
        this.selectedMembers.splice(index, 1);
      }
    }
    if(this.insureOptions[option] == 0){
      delete this.insureOptions[option];
    }

    console.log(this.insureOptions)

    this.memberIcons = []
    for (const [key, value] of Object.entries(this.insureOptions)) {
      if(value == true){
        this.memberIcons.push(key);
      }else if (typeof value == 'number' && value > 0) {
          for (let i = 1; i <= value; i++) {
              this.memberIcons.push(key+' '+i);
          }
      }
    }
  }

//--------------------------------------------phase_2
  isMultipleChild(child:any): boolean {
    return this.multipleChild.includes(child);
  }
  disSelectMultipleChild(child:any){
    this.form1Changed = true;
    // this.dissableSubmit = false;
    this.continueErrorMsg = '';
    this.Errorshow=false;
    this.ErrorshowAge=false;

    // if(this.insureOptions['son'] == 2 || this.insureOptions['daughter'] == 2){
    //   const index = this.multipleChild.indexOf(child);
    //   if (index !== -1) {
    //     this.multipleChild.splice(index, 1);
    //   }
    //   this.removeMemberAge(child);
    //   if(['son2', 'son3'].includes(child)){
    //     this.insureOptions['son']--;
    //   }
    //   if(['daughter2', 'dayghter3'].includes(child)){
    //     this.insureOptions['daughter']--;
    //   }
      
    // }
    // if(this.insureOptions['son'] == 3 || this.insureOptions['daughter'] == 3){
    //   if(child == 'son2' || child == 'daughter2'){
          const index = this.multipleChild.indexOf(child);
          if (index !== -1) {
            this.multipleChild.splice(index, 1);
          }
          this.removeMemberAge(child);
          if(child == 'son2' || child || child == 'son3'){
            this.insureOptions['son']--;
          }
          if(child == 'daughter2' || child == 'daughter3'){
            this.insureOptions['daughter']--;
          }  

    this.memberIcons = []
    for (const [key, value] of Object.entries(this.insureOptions)) {
      if(value == true){
        this.memberIcons.push(key);
      }else if (typeof value == 'number' && value > 0) {
          for (let i = 1; i <= value; i++) {
              this.memberIcons.push(key+' '+i);
          }
      }
    }

  }
  //--------------------------------------------phase_2

  dissableChildSelection(): boolean {
    const sonSelected = this.insureOptions['son'] ? this.insureOptions['son']: 0;
    const daughterSelected = this.insureOptions['daughter'] ? this.insureOptions['daughter']: 0;
    const totalSelected = sonSelected + daughterSelected;
    return totalSelected === 3; 
  }

  addMoreMem(){
    this.addMoreMembers = true;
  }

  changeMedicalHistory(){
    // if(this.medicalHistory=='1'){
      this.form1Changed = true;
    // }
  }

  nextButton(){
    setTimeout(() => {
      $(window).scrollTop(0);
    }, 300)
    if(this.selectedMembers.length==0){
      this.continueErrorMsg = 'Please select member(s) to insure';
      this.Errorshow=true;
      setTimeout(() => {
        this.Errorshow=false;
      }, 4000);
      // sessionStorage.setItem('formError', '1');
      this.currentDiv = 'personalDetailsDiv';
      // this.dissableSubmit = true;
      return ;
    }
    if (this.selectedMembers.includes('son') || this.selectedMembers.includes('daughter')) {
      if(!this.selectedMembers.includes('self')){
        if(!this.selectedMembers.includes('spouse')){
          this.continueErrorMsg = 'To proceed, please select parent(s) of the selected kid(s) as well.';
          this.Errorshow=true;
          setTimeout(() => {
            this.Errorshow=false;
          }, 4000);
          // this.dissableSubmit = true;
          return;
        }
      }
  }
    if(this.stepNumber == 1 && this.selectedMembers.length>0){

      //--------------------------------------------phase_2
      this.ageValidationArray = []
      for (let i = 0; i < this.memberDetailsArr.length; i++) {
        const member = this.memberDetailsArr[i].memberType;
        const age = this.memberDetailsArr[i].age;
        const ageType = this.memberDetailsArr[i].age_type;
        // Add the extracted data into ageValidationArray
        this.ageValidationArray.push({
          member,
          age,
          ageType
        });
      }

      if(this.ageValidationArray.length == 0){
        if(this.selectedMembers[0]=='self'){
          this.continueErrorMsg = `Please enter your age.`
        }else if(this.selectedMembers[0]=='fatherInLaw' || this.selectedMembers[0]=='motherInLaw'){
          this.continueErrorMsg = `Please enter your ${this.selectedMembers[0].replace(/([A-Z])/g, '-$1').toLowerCase()}'s age`;
        }else{
          this.continueErrorMsg = `Please enter your ${this.selectedMembers[0].replace(/([A-Z])/g, ' $1').toLowerCase()}'s age`;
        }
        this.Errorshow=true;
        setTimeout(() => {
          this.Errorshow=false;
        }, 4000);
        // this.dissableSubmit = true;
        return;
      }

      for (let memberType in this.insureOptions) {
        if (this.insureOptions.hasOwnProperty(memberType)) {
            let found = false;
            if (this.insureOptions[memberType] === true) {
                // Check if memberType is present in memberDetailsArr
                found = this.memberDetailsArr.some(member => member.memberType === memberType);
            } else {
                // If son or daughter, check for son1, son2, son3, etc.
                found = true; // Assume all children are found initially
                for (let i = 1; i <= this.insureOptions[memberType]; i++) {
                    const childMemberType = memberType + i;
                    if (!this.memberDetailsArr.some(member => member.memberType === childMemberType)) {
                        found = false;
                        break; // Exit loop if any child is not found
                    }
                }
            }
            if (!found) {
                // Set error message and disable submit if any member is not found
                if(memberType=='self'){
                  this.continueErrorMsg = `Please enter your age.`
                }else if(memberType=='fatherInLaw' || memberType=='motherInLaw'){
                  this.continueErrorMsg = `Please enter your ${memberType.replace(/([A-Z])/g, '-$1').toLowerCase()}'s age`;
                }else{
                  this.continueErrorMsg = `Please enter your ${memberType.replace(/([A-Z])/g, ' $1').toLowerCase()}'s age`;
                }
                this.Errorshow=true;
                setTimeout(() => {
                  this.Errorshow=false;
                }, 4000);
                // this.dissableSubmit = true;
                return;
            }
        }
      }
    
      console.log(this.ageValidationArray)
      for (let i = 0; i < this.ageValidationArray.length; i++) {
        const member = this.ageValidationArray[i].member;
        const memberAge = this.ageValidationArray[i].age + ' ' + this.ageValidationArray[i].ageType;
        // Call the checkAgeValidation method with the extracted member and memberAge
        if(!this.checkAgeValidation(member, memberAge)){
          return;
        }
      }

      if(!this.checkValidation()){
        return;
      }
      //--------------------------------------------phase_2

      sessionStorage.setItem('dataFromPage', 'basicDetailsForm')
      
      if(this.insureOptions.self && this.insureOptions.spouse) {
        this.progressWidth = "50%";
        this.showBabyPlanDiv = true;
      } else {
        this.progressWidth = "66%";
        this.showBabyPlanDiv = false;
        sessionStorage.removeItem('planBaby')
      }

      
      $('#tiger').removeClass('tiger');
      this.continueErrorMsg = '';
      this.Errorshow=false;
      this.ErrorshowAge=false;
      document.getElementById('nextBTN')!.style.display = 'none';
      this.currentDiv = 'familyIncomeDiv';
      this.memberCount = Object.entries(this.insureOptions)
      .filter(([key, value]) => value === true || (typeof value === 'number' && value > 0))
      .reduce((acc, [key, value]) => {
        acc[key] = value as number | boolean;;
        return acc;
      }, {} as { [key: string]: boolean | number });
      
      this.total_members = 0;

      // Iterate over the keys of the object
      for (const key in this.memberCount) {
        if (Object.prototype.hasOwnProperty.call(this.memberCount, key)) {
          // If the value is true, add 1 to the total
          // Otherwise, add the value itself to the total
          this.total_members += this.memberCount[key] === true ? 1 : this.memberCount[key];
        }
      }
      sessionStorage.setItem('total_members', JSON.stringify(this.total_members));
      
      this.iconValues = [];
      for (let i = 0; i < this.memberIcons.length; i++) {
        const member = this.memberIcons[i];
          // Get the value from memberImages and push it to iconValues array
          const imageUrl = this.memberImages[(member.startsWith('son') ? 'son' : (member.startsWith('daughter') ? 'daughter' : member))];
          
          this.iconValues.push(imageUrl);
      }

          // Filter out the values that are true or greater than 0
      this.finalInsureOptions = Object.entries(this.insureOptions)
      .filter(([key, value]) => value === true || (typeof value === 'number' && value > 0))
      .reduce((acc, [key, value]) => {
        acc[key] = value as number | boolean;;
        return acc;
      }, {} as { [key: string]: boolean | number });


      this.finalInsureOptions['gender'] = this.gender;
      this.finalInsureOptions['medicalHistory'] = parseInt(this.medicalHistory);

      var data ={
        "step_number" : 'step1',
        "formdata": this.finalInsureOptions,
        "memberData" : this.memberDetailsArr, //----phase_2
        "name": this.name, //----phase_2
        "pincode": this.pincode //-----phase_2
      }

      sessionStorage.setItem('basicDetails', JSON.stringify(data));
      sessionStorage.setItem('iconDetails', JSON.stringify(this.selectedMembers));

      this.stepNumber =2;
      sessionStorage.setItem('stepNumber', this.stepNumber.toString());

      var memberDetails = { ...this.finalInsureOptions };
      // Exclude 'gender' and 'medicalHistory' properties
      delete memberDetails.gender;
      delete memberDetails.medicalHistory;

      var obj ={
        "visitor_id" : this.visitorId,
        "step_number" : 'step1',
        "formdata": {
          "gender" : this.gender,
          "name": this.name, //----phase_2
          "pincode": this.pincode, //-----phase_2
          "member" : JSON.stringify(memberDetails),
          "member_details": JSON.stringify(this.memberDetailsArr), //-----phase_2
          "medicalHistory": parseInt(this.medicalHistory)
        }
      }
      this.service.createStepData(obj).subscribe((data: any) => {
        var dataSuccess = data["success"];
      });

      var selfSelected ;
      var selfAge;
      var spouseSelected ;
      var spouseAge;
      var son1Selected;
      var son1Age;
      var son2Selected;
      var son2Age;
      var son3Selected;
      var son3Age;
      var daughter1Selected;
      var daughter1Age;
      var daughter2Selected;
      var daughter2Age;
      var daughter3Selected;
      var daughter3Age;
      var fatherSelected ;
      var fatherAge;
      var motherSelected ;
      var motherAge;
      var grandFatherSelected ;
      var grandFatherAge;
      var grandMotherSelected; ;
      var grandMotherAge;
      var fatherInLawSelected ;
      var fatherInLawAge;
      var motherInLawSelected ;
      var motherInLawAge;
    
      this.memberDetailsArr.forEach((member, index) => {
        switch (member.memberType) {
            case 'self':
                selfSelected = true;
                selfAge = member.age;
                break;
            case 'spouse':
                spouseSelected = true;
                spouseAge = member.age;
                break;
            case 'son1':
                son1Selected = true;
                son1Age = member.age;
                break;
            case 'son2':
                son2Selected = true;
                son2Age = member.age;
                break;
            case 'son3':
                son3Selected = true;
                son3Age = member.age;
                break;
            case 'daughter1':
                daughter1Selected = true;
                daughter1Age = member.age;
                break;
            case 'daughter2':
                daughter2Selected = true;
                daughter2Age = member.age;
                break;
            case 'daughter3':
                daughter3Selected = true;
                daughter3Age = member.age;
                break;
            case 'father':
                fatherSelected = true;
                fatherAge = member.age;
                break;
            case 'mother':
                motherSelected = true;
                motherAge = member.age;
                break;
            case 'grandFather':
                grandFatherSelected = true;
                grandFatherAge = member.age;
                break;
            case 'grandMother':
                grandMotherSelected = true;
                grandMotherAge = member.age;
                break;
            case 'fatherInLaw':
                fatherInLawSelected = true;
                fatherInLawAge = member.age;
                break;
            case 'motherInLaw':
                motherInLawSelected = true;
                motherInLawAge = member.age;
                break;
            
            default:
                break;
        }
    });

      this.webengageService.webengageTrackEvent("Second Opinion Basic Details Submitted", {
        "Any family medical history beyond colds or fevers": this.medicalHistory=='1' ? true : false,

        "Self Selected": selfSelected? selfSelected : false,
        "Self Age in Years": selfAge? parseInt(selfAge) : 0,

        "Spouse Selected": spouseSelected? spouseSelected : false,
        "Spouse Age in Years": spouseAge?parseInt(spouseAge):0,

        "Son Selected": this.memberCount.son>0? true : false,
        "Number of Sons": this.memberCount.son? this.memberCount.son:0,
        "Son 1 Age": son1Age? parseInt(son1Age) : 0,
        "Son 2 Age": son2Age? parseInt(son2Age) : 0,
        "Son 3 Age": son3Age? parseInt(son3Age) : 0,

        "Daughter Selected": this.memberCount.daughter>0? true : false,
        "Number of Daughter": this.memberCount.daughter?this.memberCount.daughter:0,
        "Daughter 1 Age": daughter1Age? parseInt(daughter1Age): 0,
        "Daughter 2 Age": daughter2Age? parseInt(daughter2Age): 0,
        "Daughter 3 Age": daughter3Age? parseInt(daughter3Age): 0,

        "Father Selected": fatherSelected? fatherSelected : false,
        "Father Age in Years": fatherAge?parseInt(fatherAge):0,

        "Mother Selected": motherSelected? motherSelected: false,
        "Mother Age in Years": motherAge?parseInt(motherAge):0,

        "Grand Father Selected": grandFatherSelected? grandFatherSelected : false,
        "Grand Father Age in Years": grandFatherAge?parseInt(grandFatherAge):0,

        "Grand Mother Selected": grandMotherSelected?grandMotherSelected: false,
        "Grand Mother Age in Years": grandMotherAge? parseInt(grandMotherAge): 0,

        "Father-in-law Selected": fatherInLawSelected? fatherInLawSelected: false,
        "Father-in-law Age in Years": fatherInLawAge? parseInt(fatherInLawAge):0,

        "Mother-in-law Selected": motherInLawSelected? motherInLawSelected : false,
        "Mother-in-law Age in Years": motherInLawAge? parseInt(motherInLawAge):0,
      });
    
    } 
  }

  sendToLifestyle(){
      sessionStorage.setItem('otherFormChanged',this.otherFormChanged.toString());
      
      var editFromPage = sessionStorage.getItem("editDeatils");
      var backFromPage = sessionStorage.getItem('backFromPage');
      if(editFromPage == 'fromReviewPage-basic' || editFromPage == 'fromVerification-basic' || backFromPage=='lifeStyleDetails'){
        sessionStorage.setItem('form1Changed',this.form1Changed.toString());
      
      }
      this.service.setFormData(this.memberCount,this.iconValues, parseInt(this.medicalHistory));
      
      var iconDetails = this.memberIcons;
      var iconIds = this.iconValues

      var maternity_cover;
      if (this.showBabyPlanDiv == true) {
        maternity_cover = this.planBaby === true ? 1 : 0
      }  else {
        maternity_cover = '';
      }

      var finalObject= {
        visitor_id : this.visitorId,
        gender: this.activeGender,
        member_count : this.total_members,
        name: this.name, //------phase_2
        pincode: this.pincode, //----phase_2
        memberData: this.memberCount,
        memberDetail: this.memberDetailsArr, //------phase_2
        son_count : this.memberCount.son,
        daughter_count : this.memberCount.daughter,
        iconDetails : iconDetails,
        iconIds: iconIds,
        medical_history : this.medicalHistory,
        annual_income : this.annualRangeId,
        annualRange: this.annualIncomeRange,
        international_treatment : this.globalTreatment === true ? 1 : 0,
        maternity_cover : maternity_cover,
      }
      this.service.setGlobalData(finalObject);
      sessionStorage.setItem('showTiger','true')
      
      this.router.navigateByUrl('health-insurance-second-opinion/lifestyle-details');
  }

  incomeRange(range: any, rangeId:number){
    setTimeout(() => {
      $(window).scrollTop(0);
    }, 300)
    this.otherFormChanged = true;

    if (this.showBabyPlanDiv == true) {
      this.progressWidth = "75%";
    }  else {
        this.progressWidth = "99%";
    }

    this.currentDiv = 'globalTreatDiv';

    // document.getElementById('nextBTN')!.style.display = 'none';

    this.annualIncomeRange=range;
    this.annualRangeId = rangeId;
    var obj = {
      "visitor_id" : this.visitorId,
      "step_number" : 'step2',
      "formdata" : {
        'annual_income': this.annualRangeId
      }
    }
    sessionStorage.setItem('incomeRange', this.annualIncomeRange);
    sessionStorage.setItem('annualRangeId', this.annualRangeId);
    this.stepNumber=3;
    sessionStorage.setItem('stepNumber', this.stepNumber.toString());

    this.service.createStepData(obj).subscribe((data: any) => {
      var dataSuccess = data["success"];
    });

    this.webengageService.webengageTrackEvent("Family Income Submitted", {
      "Range": this.annualIncomeRange,
    });

  }

  globalTreat(gTreat:boolean){
    setTimeout(() => {
      $(window).scrollTop(0);
    }, 300)
    this.otherFormChanged = true;
      // document.getElementById('nextBTN')!.style.display = 'block';

      this.globalTreatment = gTreat;

      var obj = {
        "visitor_id" : this.visitorId,
        "step_number" : 'step3',
        "formdata" : {
          "international_treatment": gTreat === true ? 1 : 0
        }
      }
      this.service.createStepData(obj).subscribe((data: any) => {
        var dataSuccess = data["success"];
      });

      sessionStorage.setItem('globalTreatment', this.globalTreatment=== true ? '1' : '0');
      if (this.showBabyPlanDiv == true) {
        this.progressWidth = "99%";
        this.currentDiv = 'babyPlanDiv';
        this.stepNumber=4;
      }  else {
        this.progressWidth = "100%";
        this.sendToLifestyle();
      }
      
      sessionStorage.setItem('stepNumber', this.stepNumber.toString());

      this.webengageService.webengageTrackEvent("Global Treatment Submitted", {
        "Required": this.globalTreatment,
      });

  }
  babyPlanFuture(plan:boolean){
    this.otherFormChanged = true;
    this.planBaby = plan;
this.stepNumber=4;
    sessionStorage.setItem('stepNumber', this.stepNumber.toString());

      if(this.planBaby == undefined){
        this.continueErrorMsg = 'Please select member(s) to insure';
        this.Errorshow=true;
        setTimeout(() => {
          this.Errorshow=false;
        }, 4000);
        return;
      }

      this.progressWidth = "100%";
      $('#sub-menu').hide();
      this.currentDiv = 'tigerImg';
      // document.getElementById('nextBTN')!.style.display = 'block';
      sessionStorage.setItem('stepNumber', this.stepNumber.toString());
      sessionStorage.setItem('planBaby', this.planBaby === true ? '1' : '0');

        var objj = {
          "visitor_id" : this.visitorId,
          "step_number" : 'step4',
          "formdata" : {
            'maternity_cover': this.planBaby === true ? 1 : 0
          }
        }
        this.service.createStepData(objj).subscribe((data: any) => {
          var dataSuccess = data["success"];
        });

        this.webengageService.webengageTrackEvent("Maternity cover Submitted", {
          "Response": this.planBaby,
        });

        this.stepNumber = 5; 
        this.sendToLifestyle();
  }


  backBtn(){
   
    if(this.currentDiv == 'personalDetailsDiv'){
      var editFrom = sessionStorage.getItem('editDeatils');
      
      if(editFrom == 'fromReviewPage-basic'){
        // sessionStorage.removeItem('editDeatils');
        this.router.navigateByUrl('health-insurance-second-opinion/review');
      }
      else if(editFrom == 'fromVerification-basic'){
        // sessionStorage.removeItem('editDeatils');
        this.router.navigateByUrl('health-insurance-second-opinion/recommendation-report');
      } else {
        window.location.href  = "./";
      }
    } else
    if(this.currentDiv =='familyIncomeDiv'){
      this.progressWidth = "25%";
      
      $('#tiger').addClass('tiger');
      this.currentDiv = 'personalDetailsDiv'
      this.stepNumber = 1
      // document.getElementById('nextBTN')!.style.display = 'block';
    } else if(this.currentDiv == 'globalTreatDiv'){
      this.currentDiv = 'familyIncomeDiv'
      this.stepNumber = 2
      if (this.showBabyPlanDiv == true) {
        this.progressWidth = "50%";
      }  else {
        this.progressWidth = "66%";
      }
      
      $('#tiger').removeClass('tiger');
      // document.getElementById('nextBTN')!.style.display = 'none';
    } else if(this.currentDiv == 'babyPlanDiv'){
      this.currentDiv = 'globalTreatDiv'
      this.stepNumber = 3
      this.progressWidth = "75%";
      $('#tiger').removeClass('tiger');
      // document.getElementById('nextBTN')!.style.display = 'none';
    } else if(this.currentDiv == 'tigerImg'){
      this.progressWidth = "99%";
      $('#tiger').removeClass('tiger');
      this.currentDiv = 'babyPlanDiv'
      this.stepNumber = 4
      document.getElementById('nextBTN')!.style.display = 'block';
    }
  }

  capitalizeFirstLetter(member: string): string {
    if(member=='fatherInLaw' || member=='motherInLaw'){
      return member.replace(/([A-Z])/g, '-$1').replace(/(^|-)([a-z])/g, (_, a, b) => a + b.toUpperCase());
    }else{
      return member.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
    }
  }

  createVisitor() {
    // let jscd = window['jscd'];
    let jscd: any;
    jscd = window[<any>'jscd'];
    if (!sessionStorage.getItem('visitorId')) {
      let obj = {
        "browsername": jscd?.browser,
        "browserversion": jscd?.browser + ' ' + jscd?.browserVersion,
        "operatingsystem": jscd?.os + " " + jscd?.osVersion,
        "device": jscd?.os,
        "sourceurl": window.location.href,
        "productid": '36',
        "visitortype": "Business Loan",
        "utmsource": this.GetParameterValues("utm_source"),
        "utmmedium": this.GetParameterValues("utm_medium"),
        "leadsource": this.GetParameterValues("lead_source"),
        "utmcampaign": this.GetParameterValues("utm_campaign"),
      };
      this.service.createVisitor(obj).subscribe((data: any) => {
        this.visitorId = data["visitorId"];
        
        sessionStorage.setItem('visitorId', data["visitorId"])
      },
        err => {
          console.log(err);
          throw err;
        })
    } else {
      this.visitorId = sessionStorage.getItem('visitorId')
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



//--------------------------------------------phase_2
    removeMemberAge(member:any){
      // this.dissableSubmit = false;
      this.continueErrorMsg = '';
      this.Errorshow=false;
      this.ErrorshowAge=false;
      const index = this.memberDetailsArr.findIndex((item: any) => item.memberType === member);
      if (index !== -1) {
        this.memberDetailsArr.splice(index, 1);
        if(member === 'self'){
          // this.selfAgeDropDown = [];
          this.selfAge = {};
          this.childParentAges['self'];
          this.selfmemberAge = '';

          this.fatherMinAge = 36;
          this.motherMinAge = 36
          this.grandFatherMinAge = 54;
          this.grandMotherMinAge = 54;
          this.populateAges('father');
          this.populateAges('mother');
          this.populateAges('grandFather');
          this.populateAges('grandMother');

        }
        if(member === 'spouse'){
          // this.spouseAgeDropDown = [];
          this.spouseAge = {};
          this.childParentAges['spouse'];
          this.spousememberAge = '';

          this.fatherInLawMinAge = 36;
          this.motherInLawMinAge = 36;

          this.populateAges('fatherInLaw');
          this.populateAges('motherInLaw');
        }
        if(member === 'father'){
          // this.fatherAgeDropDown = [];
          delete this.f_m_Ages['father'];
          this.fathermemberAge = '';

          if(this.selfmemberAge){
            this.fatherMinAge = parseInt(this.selfmemberAge) + 18;
            this.populateAges('father');
          }
          
          this.grandFatherMinAge = 54;
          this.grandMotherMinAge = 54;

          this.populateAges('grandFather');
          this.populateAges('grandMother');
        }
        if(member === 'mother'){
          // this.motherAgeDropDown = [];
          delete this.f_m_Ages['mother'];
          this.mothermemberAge = '';

          if(this.selfmemberAge){
            this.motherMinAge = parseInt(this.selfmemberAge) + 18;
            this.populateAges('mother');
          }

          this.grandFatherMinAge = 54;
          this.grandMotherMinAge = 54;
          this.populateAges('grandFather');
          this.populateAges('grandMother');
        }
        if(member === 'fatherInLaw'){
          // this.fatherInLawAgeDropDown = [];
          delete this.inLawAges['fatherInLaw'];
          this.fatherILmemberAge = '';

          if(this.spousememberAge){
            this.fatherInLawMinAge = parseInt(this.spousememberAge) + 18;
            this.populateAges('fatherInLaw');
          }
        }
        if(member === 'motherInLaw'){
          // this.motherInLawAgeDropDown = [];
          delete this.inLawAges['motherInLaw'];
          this.motherILmemberAge = '';

          if(this.spousememberAge){
            this.motherInLawMinAge = parseInt(this.spousememberAge) + 18;
            this.populateAges('motherInLaw');
          }
        }
        if(member === 'grandFather'){
          // this.grandFatherAgeDropDown = [];
          delete this.grandAges['grandFather'];
          this.grandFmemberAge = '';

          if(this.selfmemberAge){
            this.grandFatherMinAge = parseInt(this.selfmemberAge) + 36;
            this.populateAges('grandFather');
          } else if(this.fathermemberAge){
            this.grandFatherMinAge = parseInt(this.fathermemberAge) + 18;
            this.populateAges('grandFather');
          } else if(this.mothermemberAge){
            this.grandFatherMinAge = parseInt(this.mothermemberAge) + 18;
            this.populateAges('grandFather');
          }
        }
        if(member === 'grandMother'){
          // this.grandMotherAgeDropDown = [];
          delete this.grandAges['grandMother'];
          this.grandMmemberAge = '';

          if(this.selfmemberAge){
            this.grandMotherMinAge = parseInt(this.selfmemberAge) + 36;
            this.populateAges('grandMother');
          } else if(this.fathermemberAge){
            this.grandMotherMinAge = parseInt(this.fathermemberAge) + 18;
            this.populateAges('grandMother');
          } else if(this.mothermemberAge){
            this.grandMotherMinAge = parseInt(this.mothermemberAge) + 18;
            this.populateAges('grandMother');
          }
        }
        if(['son1', 'son2', 'son3', 'daughter1', 'daughter2', 'daughter3'].includes(member)){
          delete this.childAges[member];
          if(member === 'son1'){
            this.s1memberAge = '';
          } else if(member === 'son2'){
            this.s2memberAge = '';
          } else if(member === 'son3'){
            this.s3memberAge = '';
          } else if(member === 'daughter1'){
            this.d1memberAge = '';
          } else if(member === 'daughter2'){
            this.d2memberAge = '';
          } else if(member === 'daughter3'){
            this.d3memberAge = '';
          }
        }
      }
    }
    setMemberAge(memberType: string, event: any) {
      // this.dissableSubmit = false;
      this.ageValidateMessage = ''
      this.ErrorshowAge=false;
      this.continueErrorMsg = '';
      this.Errorshow=false;

      this.form1Changed = true;
      
      
      var memberAge;
      if(event.target){
         memberAge = event.target.value;
      } else {
        memberAge = event;
      }
  
      var [age, ageType] = memberAge.split(' ');
  
  
      const indexx = this.selectedMembers.indexOf(memberType);
      if (indexx === -1) {
        this.form1Changed = true;
        if (memberType === 'self') {
          this.selectedMembers.unshift(memberType);
          this.insureOptions[memberType] = true;
        } else {
          if (['son1', 'son2', 'son3'].includes(memberType)) {
            const indexx = this.selectedMembers.indexOf('son');
            if (indexx === -1) {
              this.form1Changed = true;
              this.selectedMembers.push('son');
              this.insureOptions['son'] = 1;
            }
            
          } else if (['daughter1', 'daughter2', 'daughter3'].includes(memberType)) {
            const indexx = this.selectedMembers.indexOf('daughter');
            if (indexx === -1) {
              this.form1Changed = true;
              this.selectedMembers.push('daughter');
              this.insureOptions['daughter'] = 1;
            }
            
          }
          else{
            this.form1Changed = true;
            this.selectedMembers.push(memberType);
            this.insureOptions[memberType] = true;
          }
        }
      }

      this.memberIcons = []
      for (const [key, value] of Object.entries(this.insureOptions)) {
        if(value == true){
          this.memberIcons.push(key);
        }else if (typeof value == 'number' && value > 0) {
            for (let i = 1; i <= value; i++) {
                this.memberIcons.push(key+' '+i);
            }
        }
      }
  
      const index = this.memberDetailsArr.findIndex((item: any) => item.memberType === memberType);
      if (index !== -1) {
          // Member already exists, update age and age_type
          this.memberDetailsArr[index].age = age;
          this.memberDetailsArr[index].age_type = ageType;
      } else {
          // Member doesn't exist, add new member details
          const newMemberDetails = {
              memberType: memberType,
              age: age,
              age_type: ageType,
              physical_activity: "",
              consume_alcohol:"0",
              consume_alcohol_frequency: "",
              consume_tobacco:"0",
              // consume_tobacco_frequency:"", //TEST
              PED_status: "0",
              PED_text: "",
              PED_value: ""
          };
          if(memberType ==='self'){
            this.memberDetailsArr.unshift(newMemberDetails);
          } else {
          this.memberDetailsArr.push(newMemberDetails);
          }
      }
  
      if(memberType === 'self'){
        this.selfmemberAge = memberAge
        this.selfAge = {}
        this.childParentAges['self'];
        // this.populateAges('self');
      }
      if(memberType === 'spouse'){
        this.spousememberAge = memberAge
        this.spouseAge = {}
        this.childParentAges['spouse'];
        // this.populateAges('spouse');
      }
      if(memberType === 'father'){
        this.fathermemberAge = memberAge
        delete this.f_m_Ages['father'];
        // this.populateAges('father');
      }
      if(memberType === 'mother'){
        this.mothermemberAge = memberAge
        delete this.f_m_Ages['mother'];
        // this.populateAges('mother');
       
      }
      if(memberType === 'son1'){
        this.s1memberAge = memberAge
        delete this.childAges[memberType]
        // this.populateAges('son1');
       
      }
      if(memberType === 'son2'){
        this.s2memberAge = memberAge
        delete this.childAges[memberType]
        // this.populateAges('son2');
       
      }
      if(memberType === 'son3'){
        this.s3memberAge = memberAge
        delete this.childAges[memberType]
        // this.populateAges('son3');
        
      }
      if(memberType === 'daughter1'){
        this.d1memberAge = memberAge
        delete this.childAges[memberType]
        // this.populateAges('daughter1');
      
      }
      if(memberType === 'daughter2'){
        this.d2memberAge = memberAge
        delete this.childAges[memberType]
        // this.populateAges('daughter2');
       
      }
      if(memberType === 'daughter3'){
        this.d3memberAge = memberAge
        delete this.childAges[memberType]
        // this.populateAges('daughter3');
        
      }
      if(memberType === 'fatherInLaw'){
        this.fatherILmemberAge = memberAge
        delete this.inLawAges['fatherInLaw'];
        // this.populateAges('fatherInLaw');
       
      }
      if(memberType === 'motherInLaw'){
        this.motherILmemberAge = memberAge
        delete this.inLawAges['motherInLaw'];
        // this.populateAges('motherInLaw');
       
      }
      if(memberType === 'grandFather'){
        this.grandFmemberAge = memberAge
        delete this.grandAges['grandFather'];
        // this.populateAges('grandFather');
       
      }
      if(memberType === 'grandMother'){
        this.grandMmemberAge = memberAge
        delete this.grandAges['grandMother'];
        // this.populateAges('grandMother');
       
      }

      if (['self'].includes(memberType)) {
        if (!this.selectedMembers.includes('father')){
          this.fatherMinAge = parseInt(age) + 18;
          this.populateAges('father');
        }
        if (!this.selectedMembers.includes('mother')){
          this.motherMinAge = parseInt(age) + 18;
          this.populateAges('mother');
        }
        if (!this.selectedMembers.includes('grandFather')){
          this.grandFatherMinAge = parseInt(age) + 36;
          this.populateAges('grandFather');
        }
        if (!this.selectedMembers.includes('grandMother')){
          this.grandMotherMinAge = parseInt(age) + 36;
          this.populateAges('grandMother');
        }
        
      } else if (memberType === 'spouse') {
        if (!this.selectedMembers.includes('fatherInLaw')){
          this.fatherInLawMinAge = parseInt(age) + 18;
          this.populateAges('fatherInLaw');
        }
        if (!this.selectedMembers.includes('motherInLaw')){
          this.motherInLawMinAge = parseInt(age) + 18;
          this.populateAges('motherInLaw');
        }
      } else if (['father', 'mother'].includes(memberType)) {
        if (!this.selectedMembers.includes('grandFather')){
          this.grandFatherMinAge = parseInt(age) + 18;
          this.populateAges('grandFather');
        }
        if (!this.selectedMembers.includes('grandMother')){
          this.grandMotherMinAge = parseInt(age) + 18;
          this.populateAges('grandMother');
        }
      } 
      
    }
    
    testPopulateAgesChild(){
      const months = [3, 4, 5, 6, 7, 8, 9, 10, 11];
      const years = Array.from({ length: 30 }, (_, i) => i + 1);
      
      this.sonAgeDropDown = [];
      this.daughterAgeDropDown = [];
      for (const month of months) {
          this.sonAgeDropDown.push(`${month} months`);
          this.daughterAgeDropDown.push(`${month} months`);
      }

      for (const year of years) {
        if(year == 1){
          this.sonAgeDropDown.push(`${year} year`);
          this.daughterAgeDropDown.push(`${year} year`);
        } else {
          this.sonAgeDropDown.push(`${year} years`);
          this.daughterAgeDropDown.push(`${year} years`);
        }
      }
    }

    testPopulateAges() {
        this.selfAgeDropDown = [];
        for (let i = this.selfMinAge; i <= 99; i++) {
          this.selfAgeDropDown.push(`${i} years`);
        }

        this.spouseAgeDropDown = [];
        for (let i = this.spouseMinAge; i <= 99; i++) {
          this.spouseAgeDropDown.push(`${i} years`);
        }
      
        this.fatherAgeDropDown = []
        for (let i = this.fatherMinAge; i <= 99; i++) {
          this.fatherAgeDropDown.push(`${i} years`);
        }
        this.motherAgeDropDown = []
        for (let i = this.motherMinAge; i <= 99; i++) {
          this.motherAgeDropDown.push(`${i} years`);
        }
        this.fatherInLawAgeDropDown = [];
        for (let i = this.fatherInLawMinAge; i <= 99; i++) {
          this.fatherInLawAgeDropDown.push(`${i} years`);
        }
        this.motherInLawAgeDropDown = [];
        for (let i = this.motherInLawMinAge; i <= 99; i++) {
          this.motherInLawAgeDropDown.push(`${i} years`);
        }
        this.grandFatherAgeDropDown = []
        for (let i = this.grandFatherMinAge; i <= 99; i++) {
          this.grandFatherAgeDropDown.push(`${i} years`);
        }
      
        this.grandMotherAgeDropDown = []
        for (let i = this.grandMotherMinAge; i <= 99; i++) {
          this.grandMotherAgeDropDown.push(`${i} years`);
        }

      // this.cdr.detectChanges(); 
      
    }

    populateAges(member:any): void {
      if(member === 'self'){
        this.selfAgeDropDown = [];
        for (let i = this.selfMinAge; i <= 99; i++) {
          this.selfAgeDropDown.push(`${i} years`);
        }
      }
      if(member === 'spouse'){
        this.spouseAgeDropDown = [];
        for (let i = this.spouseMinAge; i <= 99; i++) {
          this.spouseAgeDropDown.push(`${i} years`);
        }
      }
      if (['son1', 'son2', 'son3'].includes(member)) {
        const months = [3, 4, 5, 6, 7, 8, 9, 10, 11];
        const years = Array.from({ length: 30 }, (_, i) => i + 1);
        
        this.sonAgeDropDown = [];
        for (const month of months) {
            this.sonAgeDropDown.push(`${month} months`);
        }
  
        for (const year of years) {
          if(year == 1){
            this.sonAgeDropDown.push(`${year} year`);
          } else {
            this.sonAgeDropDown.push(`${year} years`);
          }
        }
      }
      if (['daughter1', 'daughter2', 'daughter3'].includes(member)) {
        const months = [3, 4, 5, 6, 7, 8, 9, 10, 11];
        const years = Array.from({ length: 30 }, (_, i) => i + 1);
        this.daughterAgeDropDown = [];
        for (const month of months) {
            this.daughterAgeDropDown.push(`${month} months`);
        }
  
        for (const year of years) {
          if(year == 1){
            this.daughterAgeDropDown.push(`${year} year`);
          } else {
            this.daughterAgeDropDown.push(`${year} years`);
          }
        }
      }
  
      if(member === 'brother'){
        for (let i = this.brotherMinAge; i <= 99; i++) {
          this.brotherAgeDropDown.push(`${i} years`);
        }
      }
      if(member === 'sister'){
        for (let i = this.SisterMinAge; i <= 99; i++) {
          this.sisterAgeDropDown.push(`${i} years`);
        }
      }
      if(member === 'father'){
        this.fatherAgeDropDown = []
        for (let i = this.fatherMinAge; i <= 99; i++) {
          this.fatherAgeDropDown.push(`${i} years`);
        }
      }
      if(member === 'mother'){
        this.motherAgeDropDown = []
        for (let i = this.motherMinAge; i <= 99; i++) {
          this.motherAgeDropDown.push(`${i} years`);
        }
      }
      if(member === 'fatherInLaw'){
        this.fatherInLawAgeDropDown = [];
        for (let i = this.fatherInLawMinAge; i <= 99; i++) {
          this.fatherInLawAgeDropDown.push(`${i} years`);
        }
      }
      if(member === 'motherInLaw'){
        this.motherInLawAgeDropDown = [];
        for (let i = this.motherInLawMinAge; i <= 99; i++) {
          this.motherInLawAgeDropDown.push(`${i} years`);
        }
      }
      if(member === 'grandFather'){
        this.grandFatherAgeDropDown = []
        for (let i = this.grandFatherMinAge; i <= 99; i++) {
          this.grandFatherAgeDropDown.push(`${i} years`);
        }
      }
      if(member === 'grandMother'){
        this.grandMotherAgeDropDown = []
        for (let i = this.grandMotherMinAge; i <= 99; i++) {
          this.grandMotherAgeDropDown.push(`${i} years`);
        }
       } 
      // this.cdr.detectChanges(); 
    }
  
    checkAgeValidation(member:any, memberAge:any) {     
      var [age, ageType] = memberAge.split(' ');
  
      let num: number = 0;
      if(!age) {
        // Validation for AGE
        this.ageValidateMessage = 'required';
        num += 1;
      } else {
        if (['son1', 'son2', 'son3', 'daughter1', 'daughter2', 'daughter3'].includes(member)) {
          if(['son1', 'son2', 'son3'].includes(member)){
            this.member1forValidation = 'son';
          }
          if(['daughter', 'daughter2', 'daughter3'].includes(member)){
            this.member1forValidation = 'daughter';
          }
  
          if(ageType=='years' || ageType == 'year'){
              if(!this.checkAgeComparison(age,this.childParentAges, 'child-parent')){
                this.ageValidateMessage = 'child-parentComparison';
                num += 1;
              } 
              else{
                this.childAges[member] = age;
              }
          }
        } 
        else {
            if (['self', 'spouse', 'brother', 'sister'].includes(member)) {
  
                if(['self', 'spouse'].includes(member)) {
  
                  if(['self'].includes(member)) {
                    this.member1forValidation = member;
                    if(!this.checkAgeComparison(age,this.childAges, 'self-child')){
                      this.ageValidateMessage = 'self-childComparison';
                      num += 1;
                    }else 
                    if(!this.checkAgeComparison(age,this.f_m_Ages, 'self-fm')){
                      this.ageValidateMessage = 'self-fmComparison';
                      num += 1;
                    } else if(!this.checkAgeComparison(age,this.grandAges, 'self-grand')){
                      this.ageValidateMessage = 'self-grandComparison';
                      num += 1;
                    } else {
                      // Push age into the agesObject
                      this.selfAge[member] = age;
                      this.childParentAges[member] = age;
                    }
                  }else if(['spouse'].includes(member)) {
                    this.member1forValidation = member;
                    if(!this.checkAgeComparison(age,this.childAges, 'spouse-child')){
                      this.ageValidateMessage = 'spouse-childComparison';
                      num += 1;
                    } else 
                    if(!this.checkAgeComparison(age,this.inLawAges, 'spouse-inlaw')){
                      this.ageValidateMessage = 'spouse-inlawComparison';
                      num += 1;
                    } else {
                      // Push age into the agesObject
                      this.spouseAge[member] = age;
                      this.childParentAges[member] = age;
                    }
                  }
                }else{
                  this.member1forValidation = member;
                  if(!this.checkAgeComparison(age,this.f_m_Ages, 'otherAdult-fm')){
                    this.ageValidateMessage = 'otherAdult-fmComparison';
                    num += 1;
                  }else if(!this.checkAgeComparison(age,this.grandAges, 'otherAdult-grand')){
                    this.ageValidateMessage = 'otherAdult-grandComparison';
                    num += 1;
                  } else {
                    this.otherAdultAges[member] = age;
                  }
                }
            } 
  
            if(['father', 'mother', 'fatherInLaw', 'motherInLaw'].includes(member)) {
                if(['father', 'mother'].includes(member)) {
                  this.member1forValidation = member;
                  if(!this.checkAgeComparison(age,this.selfAge, 'fm-self')){
                    this.ageValidateMessage = 'fm-selfComparison';
                    num += 1;
                  }
                  //  else if(!this.checkAgeComparison(age,this.otherAdultAges, 'fm-otherAdult')){
                  //   this.ageValidateMessage = 'fm-otherAdultComparison';
                  //   num += 1;
                  // } else 
                  if(!this.checkAgeComparison(age,this.grandAges, 'fm-grand')){
                    this.ageValidateMessage = 'fm-grandComparison';
                    num += 1;
                  } 
                  else {
                    this.f_m_Ages[member] = age;
                  }
                } else if(['fatherInLaw', 'motherInLaw'].includes(member)) {
                  this.member1forValidation = member.replace(/([A-Z])/g, '-$1').trim().toLowerCase();
                  if(!this.checkAgeComparison(age,this.spouseAge, 'inLaw-spouse')){
                    this.ageValidateMessage = 'inLaw-spouseComparison';
                    num += 1;
                  } else {
                    this.inLawAges[member] = age;
                  }
                }         
            }
  
            if(['grandFather', 'grandMother'].includes(member)) {
              this.member1forValidation = member.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
              if(!this.checkAgeComparison(age,this.f_m_Ages, 'grand-fm')){
                this.ageValidateMessage = 'grand-fmComparison';
                num += 1;
              } else if(!this.checkAgeComparison(age,this.selfAge, 'grand-self')){
                this.ageValidateMessage = 'grand-selfComparison';
                num += 1;
              } 
              // else if(!this.checkAgeComparison(age,this.otherAdultAges, 'grand-otherAdult')){
              //   this.ageValidateMessage = 'grand-otherAdultComparison';
              //   num += 1;
              // }
              
              else {
                this.grandAges[member] = age;
              }
            }
        }
      }
  
      if (num > 0) {
        // this.dissableSubmit = true;
        this.ErrorshowAge=true;
        setTimeout(() => {
          this.ErrorshowAge=false;
        }, 4000);
        return false;
      } else {
        this.ageValidateMessage = '';
        this.ErrorshowAge=false;
        // this.dissableSubmit = false;
        this.continueErrorMsg = '';
        this.Errorshow=false
        return true;
      }
  
  }
  
  
  checkAgeComparison(age:any,compare:any, type:any){
   let isAgeValid = true;
   for (const memberType in compare) {
      if (compare.hasOwnProperty(memberType)) {
          const compared = compare[memberType];
          if(type==='child-parent'|| type==='self-fm' || type==='spouse-inlaw' || type ==='fm-grand' || type === 'otherAdult-fm'){
            if (!(age <= parseInt(compared) - 18)) {
              isAgeValid = false; 
              if (memberType == 'son1' || memberType =='son2' || memberType == 'son3'){
                this.member2forValidation = 'son';
              } else if (memberType == 'daughter1' || memberType =='daughter2' || memberType == 'daughter3'){
                this.member2forValidation = 'daughter';
              } else {
                // if (/[A-Z]/.test(memberType)) {
                //   var member = memberType
                //   this.member2forValidation = member.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
                // } else {
                this.member2forValidation = memberType;
                // }
              }
              break;
            }
          } else if(type ==='self-grand' || type ==='otherAdult-grand'){
            if (!(age <= parseInt(compared) - 36)) {
              isAgeValid = false;
              // if (/[A-Z]/.test(memberType)) {
              //   var member = memberType
              //   this.member2forValidation = member.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
              // } else {
              this.member2forValidation = memberType;
              // }
              break;
            }
          }
          else if(type==='self-child' || type ==='spouse-child' || type ==='fm-self' || type ==='inLaw-spouse'|| type ==='fm-otherAdult' || type ==='grand-fm'){
            if (!(age >= parseInt(compared) + 18)) {
              isAgeValid = false; 
              if (memberType == 'son1' || memberType =='son2' || memberType == 'son3'){
                this.member2forValidation = 'son';
              } else if (memberType == 'daughter1' || memberType =='daughter2' || memberType == 'daughter3'){
                this.member2forValidation = 'daughter';
              } else {
                // if (/[A-Z]/.test(memberType)) {
                //   var member = memberType
                //   this.member2forValidation = member.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
                // } else {
                this.member2forValidation = memberType;
                // }
              }
              break;
            }
          } else if(type === 'grand-self' || type === 'grand-otherAdult'){
            if (!(age >= parseInt(compared) + 36)) {
              isAgeValid = false; 
              // if (/[A-Z]/.test(memberType)) {
              //   var member = memberType
              //   this.member2forValidation = member.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
              // } else {
              this.member2forValidation = memberType;
              // }
              break;
            }
          }
      }
  }
  return isAgeValid;
  }


  alphaOnly(event:any) {
    var reg = /^[A-Za-z ]+$/;
    return (reg.test(event.key));
  }

  numbersOnly($event:any) {
    if ($event.target.value.length === 0) {
      if ($event.key === '0') {
        return false;
      }
    }
    var reg = /^[0-9]+$/;
    return (reg.test($event.key));
  };

  pincodeChange(){
    // console.log(this.pincodeArr)
    if(this.pincode?.length > 5 && this.pincodeArr.some(item => item.pincode == this.pincode)) {
      var obj = {
        "pincode": this.pincode
      }
      this.setpincode(obj)
    }
  }
  checkValidation(){
    let num: number = 0;
    if (this.name && this.name.length < 3) {
      this.nameValidateMsg = "lengthError";
      num += 1;
    }
    if (!this.name) {
      this.nameValidateMsg = "required";
      num += 1;
    }

    if(!this.pincode){
      this.pincodeValidateMsg = "required";
      num+=1;
    }

   else if (this.pincode && this.pincode.length > 0 && this.pincode.length != 6) {
      this.pincodeValidateMsg = "invalid";
      num += 1;
    }


    else if (/^([0-9])\1{5}$/.test(this.pincode)) { // Check if all digits are the same
      this.pincodeValidateMsg = "sameDigits";
      num += 1;
    }


    if (num > 0) {
      this.dissableSubmit = true;
      return false;
    } else {
      this.ageValidateMessage = '';
      this.ErrorshowAge=false;
      this.nameValidateMsg = '';
      this.pincodeValidateMsg = '';
      this.dissableSubmit = false;
      this.continueErrorMsg = '';
      this.Errorshow=false
      return true;
    }
  }

  removeErrorMsg(fieldname: string) {
    // this.dissableSubmit = false;
    if (fieldname == "name") {
        this.nameValidateMsg = "";
    }
  
    if (fieldname == "pincode") {
        this.pincodeValidateMsg = "";
    }
  }

  handleInputChange(){
    if((this.pincode?.length>5) && (this.name && this.name?.length > 3)){
      this.dissableSubmit = false;
    }
   }
   

   formatRelation(relation: string): string {
    switch (relation) {
      case 'grandFather':
        return 'grand father';
      case 'grandMother':
        return 'grand mother';
      case 'fatherInLaw':
        return 'father-in-law';
      case 'motherInLaw':
        return 'mother-in-law';
      default:
        return relation;
    }
  }

  formatRelationLabel(relation: string): string {
    if(relation == 'fatherInLaw' || relation == 'motherInLaw') {
      return relation.replace(/([A-Z])/g, '-$1').replace(/^\w/, c => c.toUpperCase());
    }else{
      return relation.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase());
    }
  }
  
  getIterations(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index + 1);
  }

}
