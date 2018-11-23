import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { authComponents } from './index';

//Services
import { AuthService } from './../../core/services/authentication/auth.service'; 

@NgModule({
  declarations: [
    ...authComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [ 
    ...authComponents
  ],
  providers: [ AuthService ]
})
export class AuthModule {  }