import { AuthService } from './authentication/auth.service';
import { HttpClientService } from './http-client.service';
import { ProjectsService } from './projects/projects.service';

export const allServices = [ AuthService, HttpClientService, ProjectsService]