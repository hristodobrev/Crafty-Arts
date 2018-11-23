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
export class CommentsProjectPermissionsGuard implements CanActivate {

  constructor(
    private projectService : ProjectsService,
    private authService: AuthService,
    private router : Router
  ) {

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let pojectId = next.params.projectId;
    let commentId = next.params.commentId;

    this.projectService.getById(pojectId).subscribe(data => {

        if (data['success']) {

          let author = false;

          for(let comment of data.project.comments) {
            if(comment.email === localStorage.getItem('_id') && comment._id === commentId) {
              console.log('author')
              author = true;
            }
          }
          
          if (author) {
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