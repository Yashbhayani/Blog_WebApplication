import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MasterService } from '../services/master.service';

@Injectable({
  providedIn: 'root'
})
export class RoleguardGuardGuard implements CanActivate {
  constructor(private service: MasterService, private router: Router){  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
      if(this.service.RoleFunction()){
        return true
      }else{
        this.router.navigate(['']);
        return false
      }

      return true;
  
  }

  
  
}
