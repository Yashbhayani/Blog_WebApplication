import { Component } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../Component/dialog/dialog.component';
import { LoginComponent } from '../User/login/login.component';
import { SignupComponent } from '../User/signup/signup.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    private route: Router,
    private dialog: MatDialog,
    private cookieService: CookieService,
  ) {}

  dataloader: boolean = false;
  SpinnerActive: boolean = true;
  Spinner: string = 'assets/spinner/loading.gif';
  manu_type: String = 'defult';
  login_Active: boolean = false;
  login_Not_Active: boolean = true;
  UserName: any;
  UserData: any;
  
  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      this.Spinonn();
      this.checkfiunction();
    });
    this.Spinnnerfunctions();
    this.checkfiunction();
  }

  Spinonn() {
    this.SpinnerActive = true;
    this.dataloader = false;
  }

  Spinnnerfunctions() {
    setInterval(() => {
      this.SpinnerActive = false;
      this.dataloader = true;
    }, 5000);
  }

  checkfiunction() {
    if (
      localStorage.getItem('Userinfo') != null &&
      localStorage.getItem('Userinfo') != undefined &&
      localStorage.getItem('token') != null &&
      localStorage.getItem('token') != undefined
    ) {
      let h :any = localStorage.getItem("Userinfo");
      this.UserData = JSON.parse(h);

      this.UserName = `${this.UserData.Firstname} ${this.UserData.surname}`;
      this.login_Active = true;
      this.login_Not_Active = false;
    } else {
      this.login_Not_Active = true;
      this.login_Active = false;
    }
  }

  Logout(){
    localStorage.clear();
    this.route.navigate(['/']);
  }

  search(ui:any){
    this.route.navigate([`/search/${ui}`]); 
  }
}
