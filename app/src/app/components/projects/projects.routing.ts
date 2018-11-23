import { ProjectsListComponent } from "./projects-list/projects.list.component";
import { ProjectDetailsComponent } from "./project-details/project-details.component";
import { ProjectCreateComponent } from "./project-create/project-create.component";
import { ProjectEditComponent } from "./project-edit/project-edit.component";
import { ProjectDeleteComponent } from "./project-delete/project-delete.component";
import { ProjectCommentsComponent } from "./project-comments/project-comments.component";
import { CommentEditComponent } from "./comment-edit/comment-edit.component";
import { PermissionsGuard } from "../../core/guards/authentication/permissions.guard";
import { DeleteProjectPermissionsGuard } from "../../core/guards/authentication/deleteProjectPermissions";
import { CreateProjectPermissionsGuard } from "../../core/guards/authentication/createProjectPermissions";
import { CommentsProjectPermissionsGuard } from "../../core/guards/authentication/commentsProjectPermissions.guard";

export const projectRoutes = [
  { path: '',  component: ProjectsListComponent },
  { path: 'details/:id', component: ProjectDetailsComponent },
  { path: 'create', canActivate: [ CreateProjectPermissionsGuard ], component: ProjectCreateComponent},
  { path: 'edit/:id', canActivate: [ PermissionsGuard ], component: ProjectEditComponent },
  { path: 'delete/:id', canActivate: [ DeleteProjectPermissionsGuard ], component: ProjectDeleteComponent },
  { path: 'comments/:id', canActivate: [ PermissionsGuard ], component: ProjectCommentsComponent },
  { path: 'comments/:projectId/editComment/:commentId', canActivate: [ CommentsProjectPermissionsGuard ], component: CommentEditComponent }

]