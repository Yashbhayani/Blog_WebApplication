import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MasterService } from '../services/master.service';

@Injectable({
  providedIn: 'root'
})
export class AuthgardGuard implements CanActivate {

  constructor(private router: Router,private service: MasterService) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      
      if(this.service.IsLogin()){
        this.router.navigate(['']);
        return false
      }else{
        return true
      }
      return true;
  }

  

}
