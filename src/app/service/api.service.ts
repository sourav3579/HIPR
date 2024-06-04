import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AESEncryptionService } from './aesencryption.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: any = {};


dev: any = {
  createVisitorURL:"https://uat-hiso.bajajcapitalinsurance.com/api/create_visitor",
  createLeadURL: "https://uat-hiso.bajajcapitalinsurance.com/api/createlead",
  sendOtpURL: "https://uat-hiso.bajajcapitalinsurance.com/api/generateOTP",
  verifyOtpURL: "https://uat-hiso.bajajcapitalinsurance.com/api/verify_otp",
  salesForceBridge: "https://uat-hiso.bajajcapitalinsurance.com/api/sfLeadpush",
  rmcode:'https://api.bajajcapitalone.com/nps/api/v1/VaildateRMCode',
  createStepData: 'https://uat-hiso.bajajcapitalinsurance.com/api/stepwise_leadform',
  leadplan:'https://uat-hiso.bajajcapitalinsurance.com/api/leadPlan',
  updatecrm:"https://uat-hiso.bajajcapitalinsurance.com/api/updatecrm",
  uploadFileUrl : "https://dev-api.bajajcapital.com/bclcomapp/api/get_upload_url_hipr",
  updateLeadPdf:"https://uat-hiso.bajajcapitalinsurance.com/api/updatelead_pdf",
  getCallbackCrm:"https://uat-hiso.bajajcapitalinsurance.com/api/getcallback",
  sendWhatsapp:"https://uat-hiso.bajajcapitalinsurance.com/api/sendwhatsapp",
  pincodeCityService: 'https://dev-api.bajajcapital.com/bclcomapp/api/pincodemaster',
  coverValues: 'https://uat-hiso.bajajcapitalinsurance.com/api/getCoverValues',
  genpdf:'https://uat-hiso.bajajcapitalinsurance.com/api/genpdf',
  Campaignlogs:'https://uat-hiso.bajajcapitalinsurance.com/api/CampaignLogs',
  // createVisitorURL:"http://localhost:8001/api/create_visitor",
  // createLeadURL: "http://localhost:8001/api/createlead",
  // sendOtpURL: "http://localhost:8001/api/generateOTP",
  // verifyOtpURL: "http://localhost:8001/api/verify_otp",
  // salesForceBridge: "http://localhost:8001/api/sfLeadpush",
  // rmcode:'https://api.bajajcapitalone.com/nps/api/v1/VaildateRMCode',
  // createStepData: 'http://localhost:8001/api/stepwise_leadform',
  // leadplan:'http://localhost:8001/api/leadPlan',
  // updatecrm:"http://localhost:8001/api/updatecrm",
}

  stage: any = {

  }

  prod: any = {
    createVisitorURL:"https://uat-hiso.bajajcapitalinsurance.com/api/create_visitor",
    createLeadURL: "https://uat-hiso.bajajcapitalinsurance.com/api/createlead",
    sendOtpURL: "https://uat-hiso.bajajcapitalinsurance.com/api/generateOTP",
    verifyOtpURL: "https://uat-hiso.bajajcapitalinsurance.com/api/verify_otp",
    salesForceBridge: "https://uat-hiso.bajajcapitalinsurance.com/api/sfLeadpush",
    rmcode:'https://api.bajajcapitalone.com/nps/api/v1/VaildateRMCode',
    createStepData: 'https://uat-hiso.bajajcapitalinsurance.com/api/stepwise_leadform',
    leadplan:'https://uat-hiso.bajajcapitalinsurance.com/api/leadPlan',
    updatecrm:"https://uat-hiso.bajajcapitalinsurance.com/api/updatecrm",
    uploadFileUrl : "https://dev-api.bajajcapital.com/bclcomapp/api/get_upload_url_hipr",
    updateLeadPdf:"https://uat-hiso.bajajcapitalinsurance.com/api/updatelead_pdf",
    getCallbackCrm:"https://uat-hiso.bajajcapitalinsurance.com/api/getcallback",
    sendWhatsapp:"https://uat-hiso.bajajcapitalinsurance.com/api/sendwhatsapp",
    pincodeCityService: 'https://dev-api.bajajcapital.com/bclcomapp/api/pincodemaster',
    coverValues: 'https://uat-hiso.bajajcapitalinsurance.com/api/getCoverValues',
    Campaignlogs:'https://uat-hiso.bajajcapitalinsurance.com/api/CampaignLogs',
  }
  
  formData: any = {
    insureOptions: null,
    icon_ids:null,
    medicalHistory: null
  };
  setFormData(insureOptions:any, iconValues:any, medicalHistory:any) {
    this.formData.insureOptions = insureOptions;
    this.formData.icon_ids = iconValues;
    this.formData.medicalHistory = medicalHistory;


    sessionStorage.setItem('formData', JSON.stringify(this.formData));
    this.getFormData()
  }
  getFormData() {
    this.formData = JSON.parse(sessionStorage.getItem('formData')|| '{}');
    return this.formData;
  }

  setMedicalHistory(medicalHistory:any) {
    this.formData.medicalHistory = medicalHistory;
    sessionStorage.setItem('formData', JSON.stringify(this.formData));
    this.getFormData();
  }

  finalObject= {
    visitor_id : null,
    gender: null,
    member_count : null,
    name: null,
    pincode: null,
    memberData: null,
    // memberDetail: null,
    son_count : null,
    daughter_count : null,
    iconDetails: null,
    iconIds: null,
    medical_history : null,
    annual_income : null,
    annualIncomeRange: null,
    international_treatment : null,
    maternity_cover : null,
    member : [],
    planResponse:null
    // mobile: null,
    // rm_name: null,
    // branch_code : null,
    // rm_email : null,
    // crm_id : null
  }

  finalGlobalObject = {
    visitor_id : null,
    gender: null,
    member_count : null,
    name: null,
    pincode: null,
    memberData: null,
    // memberDetail: null,
    son_count: null,
    daughter_count: null,
    iconDetails: null,
    iconIds: null,
    medical_history : null,
    annual_income : null,
    annualIncomeRange: null,
    international_treatment : null,
    maternity_cover : null,
    member : [],
    mobile: null,
    rm_name: null,
    rm_mobile: null,
    branch_code : null,
    rm_email : null,
    crm_id : null,
    planResponse:null
  };

  setGlobalData(obj:any){
    // console.log('START',this.finalObject);
    // console.log('setGlobalData__1',obj);
    var dataObject = sessionStorage.getItem('global_data')
    if(dataObject){
      // console.log('session DATA',JSON.parse(dataObject));
      this.finalObject = JSON.parse(dataObject);
    }
    // console.log('MIDDLE',this.finalObject);

    if(obj.visitor_id || obj.gender || obj.member_count){
      this.finalObject.visitor_id = obj.visitor_id;
      this.finalObject.gender = obj.gender;
      this.finalObject.name = obj.name;
      this.finalObject.pincode = obj.pincode;
      this.finalObject.member_count = obj.member_count;
      this.finalObject.memberData = obj.memberData;
      // this.finalObject.member = obj.memberDetail;
      this.finalObject.son_count = obj.son_count;
      this.finalObject.daughter_count = obj.daughter_count;
      this.finalObject.iconDetails = obj.iconDetails;
      this.finalObject.iconIds = obj.iconIds;
      this.finalObject.medical_history = obj.medical_history;
      this.finalObject.annual_income = obj.annual_income;
      this.finalObject.annualIncomeRange = obj.annualRange;
      this.finalObject.international_treatment = obj.international_treatment;
      this.finalObject.maternity_cover = obj.maternity_cover;
    }
    if(obj.medical_history){
      this.finalObject.medical_history = obj.medical_history;
    }
    if(obj.memberDetail && obj.memberDetail.length>0){
      this.finalObject.member = []
      this.finalObject.member = obj.memberDetail;
    }

    // console.log('END',this.finalObject);
    sessionStorage.setItem('global_data', JSON.stringify(this.finalObject));
  }


  setFinalGlobalObject(obj: any){
    var dataObject = sessionStorage.getItem('FINAL_global_data')
    if(dataObject){
      // console.log('setFinalGlobalObject DATA',JSON.parse(dataObject));
      this.finalGlobalObject = JSON.parse(dataObject);
    }

    if(obj.visitor_id || obj.gender || obj.total_members){
      this.finalGlobalObject.visitor_id = obj.visitor_id;
      this.finalGlobalObject.gender = obj.gender;
      this.finalGlobalObject.name = obj.name;
      this.finalGlobalObject.pincode = obj.pincode;
      this.finalGlobalObject.member_count = obj.total_members;
      this.finalGlobalObject.memberData = obj.memberData;
      this.finalGlobalObject.son_count = obj.sonCount;
      this.finalGlobalObject.daughter_count = obj.daughterCount;
      this.finalGlobalObject.iconDetails = obj.iconDetails;
      this.finalGlobalObject.iconIds = obj.iconIds;
      this.finalGlobalObject.medical_history = obj.medical_history;//
      this.finalGlobalObject.annual_income = obj.annual_income;//
      this.finalGlobalObject.annualIncomeRange = obj.familyIcome;
      this.finalGlobalObject.international_treatment = obj.internationTreatment;
      this.finalGlobalObject.maternity_cover = obj.maternityCover; 
      this.finalGlobalObject.member = obj.memberFormData
    }
    if(obj.mobile){
      this.finalGlobalObject.mobile = obj.mobile;
    }
    if(obj.rm && obj.rm == 'yes'){
      this.finalGlobalObject.rm_name = obj.rm_name;
      this.finalGlobalObject.rm_mobile = obj.rm_mobile;
      this.finalGlobalObject.rm_email = obj.rm_email;
      this.finalGlobalObject.branch_code = obj.branch_code;
    }
    if(obj.rm && obj.rm == 'no'){
      this.finalGlobalObject.rm_name = obj.rm_name;
      this.finalGlobalObject.rm_mobile = obj.rm_mobile;
      this.finalGlobalObject.rm_email = obj.rm_email;
      this.finalGlobalObject.branch_code = obj.branch_code;
    }
    if(obj.crm_id){
      this.finalGlobalObject.crm_id = obj.crm_id;
    }
    if(obj.planResp){
      this.finalGlobalObject.planResponse = obj.planResp;
    }
    sessionStorage.setItem('FINAL_global_data', JSON.stringify(this.finalGlobalObject));
  }

  constructor(private http: HttpClient, private _encryptionService: AESEncryptionService) {
    let env = environment.envName;
    // env = 'stage';
    if (env.toLowerCase() === 'dev') {
      this.baseUrl = this.dev;
    }
    else if (env.toLowerCase() === 'stage') {
      this.baseUrl = this.stage;
    }
    else if (env.toLowerCase() === 'prod') {
      this.baseUrl = this.prod;
    }
  }



  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  createVisitor(obj: any) {
    // let encryptedText = this._encryptionService.encrypt(obj);
    // let data = { data: encryptedText };
    return this.http.post(this.baseUrl["createVisitorURL"], obj);
  }

  createLead(obj: any) {
    // let encryptedText = this._encryptionService.encrypt(obj);
    // let data = { data: encryptedText };
    return this.http.post(this.baseUrl["createLeadURL"], obj);
  }

  sendOtp(obj: any) {
    // console.log('sendOtpObj', obj)
    // let encryptedText = this._encryptionService.encrypt(obj);
    // let data = { data: encryptedText };
    return this.http.post(this.baseUrl["sendOtpURL"], obj);
  }

  verifyOtp(obj: any) {
    // var randomNumber = Math.floor(Math.random() * 90000000) + 10000000;
    // obj.randomNum = randomNumber;

    // let encryptedText = this._encryptionService.encrypt(obj);
    // let data = { data: encryptedText };
    // return this.http.post(this.baseUrl["verifyOtpURL"], data)
    //   .pipe(
    //     map(response => {
    //       let decryptedData = this._encryptionService.decrypt(response);

    //       if (decryptedData.success && decryptedData.randomNum != randomNumber) {
    //         decryptedData.success = false;
    //         decryptedData.message = 'invalid';
    //         return decryptedData
    //       }
    //       return decryptedData;
    //     })
    //   );
    return this.http.post(this.baseUrl["verifyOtpURL"], obj);
  }

  pushLeadToSF(obj: any) {
    // console.log('sflead ', obj);
    // let encryptedText = this._encryptionService.encrypt(obj);
    // let data = { data: encryptedText };
    // return this.http.post("http://localhost:8087/bclcomapp/api/sfLeadpush",data);
    return this.http.post(this.baseUrl["salesForceBridge"], obj);
  }

  genpdf(pdfinput: any) {
    return this.http.post(this.baseUrl["genpdf"], pdfinput, { responseType: 'blob' });
  }

  Campaignlogs(bodyData:any) {
    // console.log("bodyDATA!!!!!!!!!........",bodyData);
    return this.http.post(this.baseUrl["Campaignlogs"], bodyData);
  }

  rmcodedetail(obj: any) {
    return this.http.post(this.baseUrl["rmcode"], obj);
  }

  createStepData(obj: any) {
    return this.http.post(this.baseUrl["createStepData"], obj);
  }

  getplandetails(obj: any) {
    // console.log("OBJ get plan",JSON.parse(obj))
    // console.log("typeof",typeof obj)
    // let data = JSON.parse(obj)
    // console.log("type..",typeof data);
    return this.http.post(this.baseUrl["leadplan"], obj);
  }

  updatecrm(obj: any) {
    return this.http.post(this.baseUrl["updatecrm"], obj);
  }

  uploadFileUrl(obj:any) {
    return this.http.post(this.baseUrl["uploadFileUrl"],obj);
  }

  updateLeadPdf(obj:any) {
    return this.http.post(this.baseUrl["updateLeadPdf"],obj);
  }
  
  getCallbackCrm(obj:any) {
    return this.http.post(this.baseUrl["getCallbackCrm"],obj);
  }
  sendWhatsapp(obj:any) {
    return this.http.post(this.baseUrl["sendWhatsapp"],obj);
  }

  cityFiler(pincode: string) {
    return this.http.get(this.baseUrl["pincodeCityService"] + '?pincode=' + pincode, this.httpOptions);
  }

  sendData_campaign(data: any) {
    return this.http.post('https://uatapihealth.bajajcapitalinsurance.com/api/v1/campaign_enquiries', data);
  }
  getCoverValues(obj: any) {
    return this.http.post(this.baseUrl["coverValues"],obj);
  }

}
