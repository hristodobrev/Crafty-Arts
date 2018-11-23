import { Component } from '@angular/core';
import { LoginInputModel } from '../../../core/models/input-models/login.input.model';
import { AuthService } from '../../../core/services/authentication/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  public model : LoginInputModel;
  public loginFail : boolean;
  public errorMessage :string;

  constructor(
    private authService : AuthService
  ) {
    this.model = new LoginInputModel("", "");
  }

  async login () : Promise<any> {
    const logging = await this.authService
    .login(this.model)
    .subscribe(
      data => {
        console.log(data)
        if(data.success == true) {
          this.loginFail = false;
          this.successfulLogin(data);
        } else {
            this.errorMessage = data.errorMessage;
            this.loginFail = true;
          }
        },
        err => {
          this.loginFail = true;
        }
      )

      return logging;
  }

  successfulLogin(data) : void {
    this.authService.authtoken = data['token'];
    localStorage.setItem('authtoken', data['token']);
    localStorage.setItem('name', data['user']['firstName']);
    localStorage.setItem('email', data['user']['email']);
    localStorage.setItem('_id', data['user']['_id']);
    this.authService.tryNavigate();
  }
}