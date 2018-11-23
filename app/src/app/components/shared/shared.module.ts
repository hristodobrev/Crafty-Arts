import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { sharedComponents } from './index';

@NgModule({
  declarations: [
    ...sharedComponents
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule.forRoot()
  ],
  exports: [
    ...sharedComponents
  ]
})
export class SharedModule {  }