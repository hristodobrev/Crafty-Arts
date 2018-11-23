import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { 
  Router,
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from "@angular/router";

import { AuthService } from "../../services/authentication/auth.service";


@Injectable()
export class ProfileGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router : Router
  ) {

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let userId = next.params.id;
      
      this.authService.isLoggedIn().subscribe(res => {
        if (res['success']) {
          let isOwner = false;
          let isAdmin = false;

          if(res['user']['_id'] === userId) {
            isOwner = true;
          }

          if(res['user']['roles'].indexOf('Admin') > -1) {
            console.log('admin')
            isAdmin = true;
          }
          
          if (isOwner || isAdmin) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }, err => {
        this.router.navigate(['/login']);
        return false;
      })
      
      return true;
    }
}