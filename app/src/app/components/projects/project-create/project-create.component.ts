import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../core/models/view-models/project.view.model';
import { UserModel } from '../../../core/models/input-models/user.model';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  templateUrl: './project-create.component.html'
})

export class ProjectCreateComponent implements OnInit {
  public model : Project;
  public createFail : boolean;
  public errorMessage :string;
  private users: UserModel

  constructor(
    private toastr: ToastsManager,
    private route : Router,
    private projectsService : ProjectsService
  ) {
    this.model = new Project("", 0, localStorage.getItem('email'), localStorage.getItem('_id'), "");
   }

  async ngOnInit() {
    const loadAllUsers = await this.projectsService
    .createGet()
    .subscribe(data => {
      this.users = data.users;
    })

    return loadAllUsers;
  }

  createProject () : void {
    this.projectsService
    .create(this.model)
    .subscribe(
      data => {
        if(data.success == true) {
          this.createFail = false;
          this.successfullCreateRequest(data);
        } else {
          this.errorMessage = data.errorMessage;
          this.createFail = true;
        }
      },
      err => {
        this.createFail = true;
        this.toastr.error('Unknown error occured. Please try again');
      }
    )
  }

  successfullCreateRequest(data) : void {
    //sthis.toastr.success('A new project is successfully created!');
    this.route.navigate(['/projects']);
  }
}