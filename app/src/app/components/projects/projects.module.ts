import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { projectComponents } from "./index";
import { projectRoutes } from './projects.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(projectRoutes),
    ToastModule.forRoot()
  ],
  declarations: [
    ...projectComponents
  ]
})
export class ProjectsModule {  }