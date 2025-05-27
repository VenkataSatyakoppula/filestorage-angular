import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, SvgIconComponent, RouterLink],
  providers: [AuthenticateService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuOpen = false;

  constructor(private _auth:AuthenticateService){
  }

  isLoggedIn(){
    return this._auth.isLoggedIn();
  }
  logOut(){
    this._auth.logout();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
}
