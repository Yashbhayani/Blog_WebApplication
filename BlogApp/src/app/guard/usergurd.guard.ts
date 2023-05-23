import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MasterService } from '../services/master.service';

@Injectable({
  providedIn: 'root',
})
export class UsergurdGuard implements CanActivate {
  constructor(private router: Router, private service: MasterService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.service.UserFunction()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
