import { Injectable } from "@angular/core";
import { 
  Router,
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from "@angular/router";
import { AuthService } from "../../services/authentication/auth.service";


@Injectable()
export class AuthGuard implements CanActivate {
  public errorMessage: String;
  constructor(
    private authService : AuthService,
    private router : Router
  ) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    return this.checkIfLogged(state.url);
  }

  checkIfLogged(url : string) {
    const checkUser = this.authService.isLoggedIn()
    .subscribe(data => {
      console.log(data)
      if(data.success == true) {
        return true;
      } else {
        this.authService.redirectUrl = url;
        this.router.navigate(["/login"]);
        return false;
      }
    },
    err => {
      this.authService.redirectUrl = url;
      this.router.navigate(["/login"]);
      return false;
    }
  )

  if(checkUser) {
    return true;
  } else {
    this.authService.redirectUrl = url;
    this.router.navigate(["/login"]);
    return false;
  }
}
}