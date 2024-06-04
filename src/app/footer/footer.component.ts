import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router'
import { WebengageService } from '../service/webengage.service';
declare var $:any

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() menuLinks:any;
  @Input() contactLinks:any;
  @Input() desc:any;
  @Input() tollfree:string='';
  @Input() tollfree_2:string='';
  @Input() display_tollfree_sec!:boolean
  constructor(private router:Router, private webengageService: WebengageService) { }

  ngOnInit(): void {
    $("#checkbox").on("click", function () {
      if ($("body#top").hasClass("dark")) {
          $("body#top").removeClass("dark");
          $('html').attr('mode', 'light');
          localStorage.setItem('theme', 'light');
      } else {
          $('html').attr('mode', 'dark')
          $("body#top").addClass("dark");
          localStorage.setItem('theme', 'dark');
      }
  });
  const theme = localStorage.getItem('theme');
  if (theme !== null) {
      if (theme === 'dark') {
          $("body#top").addClass("dark");
      } else {
          // $("body#top").removeClass("dark");
      }
  }
  }

  webengageTrack(value:string, type:string){
    if(type == 'social'){
      this.webengageService.webengageTrackEvent("Social Media Viewed", {
        "Option Selected": value,
      });
    } else if (type == 'menu'){
      this.webengageService.webengageTrackEvent("Bottom Menu Clicked", {
        "Option Selected": value,
      });
    }

  }
  registerGAFooter_PolicyDoc(menu:any){
      
  }
    registerGAFooter(menu:any){   
    
  }

  // policyDocuments(tabname:string){
  //   if(tabname === "Legal Disclaimer"){ 
           
  //     this.router.navigate(['/term-conditions'], { queryParams: { order: 'LD' } });
  //   }
  //   else if(tabname ==="Privacy Policy"){
  //     this.router.navigate(['/term-conditions'], { queryParams: { order: 'PP' } });
  //   }
  //   else if(tabname === "Terms and Conditions"){
  //     this.router.navigate(['/term-conditions'], { queryParams: { order: 'TC' } });
  //   }

  // }
 
}

