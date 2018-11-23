import { Component, OnInit } from '@angular/core';
import { FormGroup, 
  FormControl, 
  FormBuilder, 
  Validators, 
  AbstractControl } from '@angular/forms';

import { PasswordValidation } from './register-validations';
import { AuthService } from '../../../core/services/authentication/auth.service';
const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

@Component({
  templateUrl: './register.form.component.html'
})
export class RegisterFormComponent implements OnInit {
  public registerForm : FormGroup;
  public types : string[];
  public registeredUser : string;
  public registerSuccess : boolean;
  public registerFail : boolean;
  public errorMessage :string;

  constructor(private authService : AuthService, private fb : FormBuilder) {
    this.types = [ 'Employee', 'Team Leader'];
   }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [ 
        Validators.required, 
        Validators.pattern(emailRegex)
      ]],
      firstName: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(25)
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(25)
      ]],
      selectType: this.types[0],
      auth: this.fb.group({
        password: ['', [
          Validators.required,
          Validators.minLength(3), 
          Validators.maxLength(25)
        ]],
        repeatedPassword: ['', [Validators.required]]
      },
      {
        validator: PasswordValidation.MatchPasswords
      })
    })
  }

  async register(e) : Promise<any>{
    let userObject = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.auth.password,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      selectType: this.registerForm.value.selectType
    }

    if (this.registerForm.value.selectType === 'Team Leader') {
      userObject['selectType'] = 'tl';
    }

    const registering = await this.authService
    .register(userObject)
    .subscribe(data => {
        console.log(data);
        if(data.success == true) {
          this.registerFail = false;
          this.successfulRegister(data);
        } else {
          this.errorMessage = data.errorMessage;
          this.registerFail = true;
        }
      },
      err => {
        this.registerFail = true;
      }
    )

    return registering;
  }

    successfulRegister(data) : void {
      this.registerSuccess = true;
      this.registeredUser = data['user']['firstName'];
      this.authService.tryNavigate();
    }
}