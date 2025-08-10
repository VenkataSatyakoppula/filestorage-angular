import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import {SvgIconRegistryService} from 'angular-svg-icon';
import { ToastComponent } from '../components/toast/toast.component';
import { SharedService } from '../services/shared.service';
import { AuthenticateService } from '../services/authenticate.service';
import { RenameModalComponent } from '../components/rename-modal/rename-modal.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,FooterComponent,ToastComponent,RenameModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private _registry: SvgIconRegistryService,private _sharedService: SharedService,private _authService: AuthenticateService){

  }
  ngOnInit(){
    this._registry.addSvg('upload',`<svg width="27" height="19" viewBox="0 0 27 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.4653 19V13.5714H18.3227L13.501 8.14286L8.67919 13.5714H12.5366V19H7.71484V18.9548C7.55283 18.9638 7.39853 19 7.23266 19C5.31444 19 3.47478 18.2851 2.1184 17.0125C0.76201 15.7399 0 14.014 0 12.2143C0 8.73276 2.80627 5.89543 6.40717 5.50638C6.72288 3.95796 7.60383 2.56114 8.8985 1.55619C10.1932 0.551234 11.8206 0.000955454 13.501 0C15.1815 0.000882439 16.8093 0.551096 18.1043 1.55603C19.3992 2.56096 20.2806 3.95781 20.5967 5.50638C24.1976 5.89543 27 8.73276 27 12.2143C27 14.014 26.238 15.7399 24.8816 17.0125C23.5252 18.2851 21.6856 19 19.7673 19C19.6053 19 19.4491 18.9638 19.2852 18.9548V19H14.4653Z" fill="#006089"/>
</svg>`);
    this._registry.addSvg('trash',`<svg width="26" height="29" viewBox="0 0 26 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_36_19)">
                                  <path d="M7.84643 1.41621L7.42857 2.19824H1.85714C0.829911 2.19824 0 2.98027 0 3.94824C0 4.91621 0.829911 5.69824 1.85714 5.69824H24.1429C25.1701 5.69824 26 4.91621 26 3.94824C26 2.98027 25.1701 2.19824 24.1429 2.19824H18.5714L18.1536 1.41621C17.8402 0.820117 17.196 0.448242 16.4937 0.448242H9.50625C8.80402 0.448242 8.15982 0.820117 7.84643 1.41621ZM24.1429 7.44824H1.85714L3.0875 25.9873C3.18036 27.3709 4.39911 28.4482 5.86741 28.4482H20.1326C21.6009 28.4482 22.8196 27.3709 22.9125 25.9873L24.1429 7.44824Z" fill="black"/>
                                  </g>
                                  <defs>
                                  <clipPath id="clip0_36_19">
                                  <rect width="26" height="28" fill="white" transform="translate(0 0.448242)"/>
                                  </clipPath>
                                  </defs>
                                  </svg>
                                  `)
    this._registry.addSvg('github',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM265.8 407.7c0-1.8 0-6 .1-11.6c.1-11.4 .1-28.8 .1-43.7c0-15.6-5.2-25.5-11.3-30.7c37-4.1 76-9.2 76-73.1c0-18.2-6.5-27.3-17.1-39c1.7-4.3 7.4-22-1.7-45c-13.9-4.3-45.7 17.9-45.7 17.9c-13.2-3.7-27.5-5.6-41.6-5.6s-28.4 1.9-41.6 5.6c0 0-31.8-22.2-45.7-17.9c-9.1 22.9-3.5 40.6-1.7 45c-10.6 11.7-15.6 20.8-15.6 39c0 63.6 37.3 69 74.3 73.1c-4.8 4.3-9.1 11.7-10.6 22.3c-9.5 4.3-33.8 11.7-48.3-13.9c-9.1-15.8-25.5-17.1-25.5-17.1c-16.2-.2-1.1 10.2-1.1 10.2c10.8 5 18.4 24.2 18.4 24.2c9.7 29.7 56.1 19.7 56.1 19.7c0 9 .1 21.7 .1 30.6c0 4.8 .1 8.6 .1 10c0 4.3-3 9.5-11.5 8C106 393.6 59.8 330.8 59.8 257.4c0-91.8 70.2-161.5 162-161.5s166.2 69.7 166.2 161.5c.1 73.4-44.7 136.3-110.7 158.3c-8.4 1.5-11.5-3.7-11.5-8zm-90.5-54.8c-.2-1.5 1.1-2.8 3-3.2c1.9-.2 3.7 .6 3.9 1.9c.3 1.3-1 2.6-3 3c-1.9 .4-3.7-.4-3.9-1.7zm-9.1 3.2c-2.2 .2-3.7-.9-3.7-2.4c0-1.3 1.5-2.4 3.5-2.4c1.9-.2 3.7 .9 3.7 2.4c0 1.3-1.5 2.4-3.5 2.4zm-14.3-2.2c-1.9-.4-3.2-1.9-2.8-3.2s2.4-1.9 4.1-1.5c2 .6 3.3 2.1 2.8 3.4c-.4 1.3-2.4 1.9-4.1 1.3zm-12.5-7.3c-1.5-1.3-1.9-3.2-.9-4.1c.9-1.1 2.8-.9 4.3 .6c1.3 1.3 1.8 3.3 .9 4.1c-.9 1.1-2.8 .9-4.3-.6zm-8.5-10c-1.1-1.5-1.1-3.2 0-3.9c1.1-.9 2.8-.2 3.7 1.3c1.1 1.5 1.1 3.3 0 4.1c-.9 .6-2.6 0-3.7-1.5zm-6.3-8.8c-1.1-1.3-1.3-2.8-.4-3.5c.9-.9 2.4-.4 3.5 .6c1.1 1.3 1.3 2.8 .4 3.5c-.9 .9-2.4 .4-3.5-.6zm-6-6.4c-1.3-.6-1.9-1.7-1.5-2.6c.4-.6 1.5-.9 2.8-.4c1.3 .7 1.9 1.8 1.5 2.6c-.4 .9-1.7 1.1-2.8 .4z"/></svg>`)
    this._registry.addSvg("logout",`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>`);
  
    this._registry.addSvg("drive",`<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_60_15)">
                                  <path d="M0 5.25C0 3.31953 1.54996 1.75 3.45635 1.75H24.1944C26.1008 1.75 27.6508 3.31953 27.6508 5.25V15.3344C26.7327 14.5031 25.523 14 24.1944 14H3.45635C2.12782 14 0.918093 14.5031 0 15.3344V5.25ZM3.45635 15.75H24.1944C26.1008 15.75 27.6508 17.3195 27.6508 19.25V22.75C27.6508 24.6805 26.1008 26.25 24.1944 26.25H3.45635C1.54996 26.25 0 24.6805 0 22.75V19.25C0 17.3195 1.54996 15.75 3.45635 15.75ZM17.2817 22.75C17.7401 22.75 18.1797 22.5656 18.5037 22.2374C18.8278 21.9092 19.0099 21.4641 19.0099 21C19.0099 20.5359 18.8278 20.0908 18.5037 19.7626C18.1797 19.4344 17.7401 19.25 17.2817 19.25C16.8234 19.25 16.3838 19.4344 16.0597 19.7626C15.7356 20.0908 15.5536 20.5359 15.5536 21C15.5536 21.4641 15.7356 21.9092 16.0597 22.2374C16.3838 22.5656 16.8234 22.75 17.2817 22.75ZM24.1944 21C24.1944 20.5359 24.0124 20.0908 23.6883 19.7626C23.3642 19.4344 22.9246 19.25 22.4663 19.25C22.0079 19.25 21.5684 19.4344 21.2443 19.7626C20.9202 20.0908 20.7381 20.5359 20.7381 21C20.7381 21.4641 20.9202 21.9092 21.2443 22.2374C21.5684 22.5656 22.0079 22.75 22.4663 22.75C22.9246 22.75 23.3642 22.5656 23.6883 22.2374C24.0124 21.9092 24.1944 21.4641 24.1944 21Z" fill="black"/>
                                  </g>
                                  <defs>
                                  <clipPath id="clip0_60_15">
                                  <rect width="27.6508" height="28" fill="white"/>
                                  </clipPath>
                                  </defs>
                                  </svg>`);
    this._registry.addSvg("grid",`<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                                  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 1C9.65685 1 11 2.34315 11 4V8C11 9.65685 9.65685 11 8 11H4C2.34315 11 1 9.65685 1 8V4C1 2.34315 2.34315 1 4 1H8ZM8 3C8.55228 3 9 3.44772 9 4V8C9 8.55228 8.55228 9 8 9H4C3.44772 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3H8Z" fill="#0F0F0F"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 13C9.65685 13 11 14.3431 11 16V20C11 21.6569 9.65685 23 8 23H4C2.34315 23 1 21.6569 1 20V16C1 14.3431 2.34315 13 4 13H8ZM8 15C8.55228 15 9 15.4477 9 16V20C9 20.5523 8.55228 21 8 21H4C3.44772 21 3 20.5523 3 20V16C3 15.4477 3.44772 15 4 15H8Z" fill="#0F0F0F"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M23 4C23 2.34315 21.6569 1 20 1H16C14.3431 1 13 2.34315 13 4V8C13 9.65685 14.3431 11 16 11H20C21.6569 11 23 9.65685 23 8V4ZM21 4C21 3.44772 20.5523 3 20 3H16C15.4477 3 15 3.44772 15 4V8C15 8.55228 15.4477 9 16 9H20C20.5523 9 21 8.55228 21 8V4Z" fill="#0F0F0F"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M20 13C21.6569 13 23 14.3431 23 16V20C23 21.6569 21.6569 23 20 23H16C14.3431 23 13 21.6569 13 20V16C13 14.3431 14.3431 13 16 13H20ZM20 15C20.5523 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20Z" fill="#0F0F0F"/>
                                  </svg>`);
    this._registry.addSvg("list",`<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                                  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 6C9 4.34315 7.65685 3 6 3H4C2.34315 3 1 4.34315 1 6V8C1 9.65685 2.34315 11 4 11H6C7.65685 11 9 9.65685 9 8V6ZM7 6C7 5.44772 6.55228 5 6 5H4C3.44772 5 3 5.44772 3 6V8C3 8.55228 3.44772 9 4 9H6C6.55228 9 7 8.55228 7 8V6Z" fill="#0F0F0F"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 16C9 14.3431 7.65685 13 6 13H4C2.34315 13 1 14.3431 1 16V18C1 19.6569 2.34315 21 4 21H6C7.65685 21 9 19.6569 9 18V16ZM7 16C7 15.4477 6.55228 15 6 15H4C3.44772 15 3 15.4477 3 16V18C3 18.5523 3.44772 19 4 19H6C6.55228 19 7 18.5523 7 18V16Z" fill="#0F0F0F"/>
                                  <path d="M11 7C11 6.44772 11.4477 6 12 6H22C22.5523 6 23 6.44772 23 7C23 7.55228 22.5523 8 22 8H12C11.4477 8 11 7.55228 11 7Z" fill="#0F0F0F"/>
                                  <path d="M11 17C11 16.4477 11.4477 16 12 16H22C22.5523 16 23 16.4477 23 17C23 17.5523 22.5523 18 22 18H12C11.4477 18 11 17.5523 11 17Z" fill="#0F0F0F"/>
                                  </svg>`);
   if(this._authService.isLoggedIn()){
    this._sharedService.getUserData();
   }
                                  
   
  }
  title = 'filestorage-angular';
}
