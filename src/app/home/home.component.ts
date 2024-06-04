import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebengageService } from '../service/webengage.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  healthInsurance: string= 'no';

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private webengageService :WebengageService,) { }
  ngOnInit(): void {

    var darktoggle = document.querySelectorAll("#top");
    $(darktoggle).addClass('bg-white');

    const script = this.document.createElement('script');
    script.src = './assets/js/location.js';
    this.document.head.appendChild(script);




  }


  redirectTo(){
    // webengage
    this.webengageService.webengageTrackEvent("Health Second Opinion Initiated");

    sessionStorage.clear();
    console.log('redirectTo lead-form')
    sessionStorage.setItem('redirectTo','lead-form')
    this.router.navigateByUrl('health-insurance-second-opinion/basic-details');
  }
}
