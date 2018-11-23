import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/authentication/login-form/login-form.component';
import { RegisterFormComponent } from './components/authentication/register-form/register.form.component';
import { AuthGuard } from './core/guards/authentication/auth.guard';
import { PageNotFoundComponent } from './components/shared/pageNotFound/pageNotFound.component';


export const routes : Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects/ownProjects/:id', canActivate: [ AuthGuard ], component: HomeComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'projects', loadChildren: "app/components/projects/projects.module#ProjectsModule" },
  { path: 'users', loadChildren: "app/components/users/users.module#UsersModule" },
  { path: '**', component: PageNotFoundComponent }
]