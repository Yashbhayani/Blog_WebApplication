import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  constructor(private router: Router, ) {}
  Userdata: any;
  IsLogin() {
    if (localStorage.getItem('token') !== null) {
      return true;
    } else {
      return false;
    }
  }

  Loginfuncation() {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);
    }
  }

  UserFunction(){
    if (localStorage.getItem('token') !== null) {
      return true;
    } else {
      return false;
    }
  }

  RoleFunction() {
    //this.getAllproduct();
    if (this.Userdata != undefined) {
      if (localStorage.getItem('token') == this.Userdata[0].User_id) {
        return true;
      } else {
        return false;
      }
    }else {
      return false
    }
  }

}
