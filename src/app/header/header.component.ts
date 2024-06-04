import { Component,Input,OnInit,OnChanges} from '@angular/core';
import { ApiService } from '../service/api.service';
declare var $:any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{
  @Input() menuLinks:any;
  @Input() hamburgerMenu:any;
 
  @Input() branch_locator:string='';
  @Input() tollfree_number:string='';
  @Input() tollfree_2:string='';
  @Input() display_tollfree_sec!:boolean
  @Input() request_callback:string='';

  progressbar:boolean = false;
  
   constructor() {}
 
   ngOnChanges(){
   }
   ngOnInit(): void {
    setTimeout(() => {
      var url = window.location.href;
      var parts = url.split('/')
      var last_val = parts[parts.length - 1];
      console.log('lastvalue',last_val)
      if (last_val == 'basic-details') {
        this.progressbar=true;
        $('#basic-details').addClass('active')
      }
      else if(last_val == 'lifestyle-details') {
        this.progressbar=true;
        $('#lifestyle-details').addClass('active')
      }
      // else if(last_val == 'review'){
      //   $('#review').addClass('active')
      // }
    }, 50)

    this.slidelinks(); 
   }

   slidelinks() {
    // console.log('header')
    $(document).ready( () => {
      // console.log('slidelinks header1')
      $(".sidebar-menu .has-children > a").on("click",  (e:any) => {
        console.log('slidelinks header2')
        e.preventDefault();
        $(this).parent().toggleClass('active').siblings().removeClass('active');
        $(this).next('.children-wrapper').slideToggle(350).parent().siblings().find('.children-wrapper').slideUp(350);
        e.stopPropagation();
      });

    });
  }
 
  
 



   registerGANav(menu:any){
    
  }

  registerGANav1(menu:any){
   
  }

  registerGALogo(){
    
  }
 
 }
 


