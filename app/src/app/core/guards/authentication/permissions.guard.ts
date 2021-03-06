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
export class PermissionsGuard implements CanActivate {

  constructor(
    private projectService : ProjectsService,
    private authService: AuthService,
    private router : Router
  ) {

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let pojectId = next.params.id;

    this.projectService.getById(pojectId).subscribe(data => {

        if (data['success']) {

          let creator = false;
          let worker = false;

          if(
            data.project.creator._id === localStorage.getItem('_id') || 
            data.project.worker._id === localStorage.getItem('_id')
          ) {
            console.log('worker or creator')
            creator = true;
            worker = true;
          }
            let currentUserId = localStorage.getItem('userId');

            this.authService.isLoggedIn().subscribe(res => {
                if (res['success']) {
                    let fetchedUserId = res['user']['_id'];
                    let isAdmin = false;

                    if(res['user']['roles'].indexOf('Admin') > -1) {
                      console.log('admin')
                      isAdmin = true;
                    }
                    

                    if (isAdmin || creator || worker) {
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