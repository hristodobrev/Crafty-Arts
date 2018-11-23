import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { 
  Router,
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from "@angular/router";
import { ProjectsService } from "../../services/projects/projects.service";
import { AuthService } from "../../services/authentication/auth.service";


@Injectable()
export class CreateProjectPermissionsGuard implements CanActivate {

  constructor(
    private projectService : ProjectsService,
    private authService: AuthService,
    private router : Router
  ) {

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
      this.authService.isLoggedIn().subscribe(res => {
        if (res['success']) {
          let fetchedUserId = res['user']['_id'];
          let isAdmin = false;
          let isTL = false;

          if(res['user']['roles'].indexOf('Admin') > -1) {
            console.log('admin')
            isAdmin = true;
          }

          if(res['user']['type'] === true) {
            console.log('team leader')
            isTL = true;
          }
          
          if (isAdmin || isTL) {
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