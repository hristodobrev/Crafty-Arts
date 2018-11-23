import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { userComponents } from "./index";
import { usersRoutes } from './users.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(usersRoutes),
    ToastModule.forRoot()
  ],
  declarations: [
    ...userComponents
  ]
})
export class UsersModule {  }