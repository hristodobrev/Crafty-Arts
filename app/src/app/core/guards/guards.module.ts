import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthGuard } from "./authentication/auth.guard";
import { PermissionsGuard } from "./authentication/permissions.guard";
import { DeleteProjectPermissionsGuard } from "./authentication/deleteProjectPermissions";
import { CreateProjectPermissionsGuard } from './authentication/createProjectPermissions';
import { CommentsProjectPermissionsGuard } from "./authentication/commentsProjectPermissions.guard";
import { ProfileGuard } from "./users/profile.guard";


@NgModule({
  providers: [ 
    AuthGuard, 
    PermissionsGuard, 
    DeleteProjectPermissionsGuard, 
    CreateProjectPermissionsGuard,
    CommentsProjectPermissionsGuard,
    ProfileGuard ],
  imports: [
    CommonModule
  ]
})
export class GuardsModule {  }