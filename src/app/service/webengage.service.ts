import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WebengageService {

  private webengage: any;

  constructor(@Inject(DOCUMENT) private document: Document) { 
    // this.webengage = this.document.defaultView?.webengage;
    this.webengage = (this.document.defaultView as any)?.webengage;
  }

  webengageTrackEvent(eventName:any, eventData?:any){
    try{
      // webengage specific function
      this.webengage.track(eventName,eventData);
    }catch(e){
      console.log('webengage ERROR ',e)
    }
  }

  webengageUserLogin(encryptedMob:any){
    try{
      this.webengage.user.login(encryptedMob);
    }catch(e){
      console.log('webengage ERROR ',e)
    }
  }


  webengageTrackUser(userKey:any, userData:any){
    try{
      // webengage specific function
      this.webengage.user.setAttribute(userKey, userData);
    }catch(e){
      console.log('webengage ERROR ',e)
    }
  }
}
