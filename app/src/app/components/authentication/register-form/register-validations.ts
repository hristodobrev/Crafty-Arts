import { AbstractControl } from "@angular/forms/src/model";

export class PasswordValidation {
  static MatchPasswords(AC: AbstractControl) {
    let password = AC.get('password').value;
    let repeatedPassword = AC.get('repeatedPassword').value;
    if(password !== repeatedPassword) {
      AC.get('repeatedPassword').setErrors({MatchPasswords: true});
    } else {
      return null;
    }
  }
}