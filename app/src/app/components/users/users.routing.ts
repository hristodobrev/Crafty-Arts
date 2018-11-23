import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ProfileGuard } from "../../core/guards/users/profile.guard";


export const usersRoutes = [
  { path: 'profile/:id', canActivate: [ ProfileGuard ], component: UserProfileComponent }
]