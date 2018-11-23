import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Project } from '../../../core/models/view-models/project.view.model';
import { UserModel } from '../../../core/models/input-models/user.model';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Route } from '@angular/router/src/config';


@Component({
  templateUrl: './project-edit.component.html'
})

export class ProjectEditComponent implements OnInit {
  public project : Project;
  public editFail : boolean;
  public errorMessage :string;
  public users: UserModel;
  public foundWorker : Project;
  public id: string;

  constructor(
    private toastr: ToastsManager,
    private route : ActivatedRoute,
    private router : Router,
    private projectsService : ProjectsService
  ) {
    
    this.project = new Project("", 0, "", "", "");
   }

  async ngOnInit() {
   this.id = this.route.snapshot.params["id"];
   const getProjectInfo = await this.projectsService
   .editGet(this.id)
   .subscribe(data => {
    if(data.success == true) {
      this.editFail = false;
      this.users = data.users;
      this.project = data.project;
      this.foundWorker = data.foundWorker.email;
    } else {
      this.errorMessage = data.errorMessage;
      this.editFail = true;
    }
   },
    err => {
      this.editFail = true;
      this.errorMessage = 'Unknown error occured. Please try again';
    });

    return getProjectInfo;
  }

  editProject () : void {
    this.projectsService.edit(this.project, this.id)
    .subscribe(
      data => {
        if(data.success == true) {
          this.editFail = false;
          this.successfullEditRequest(data);
        } else {
          this.errorMessage = data.errorMessage;
          this.editFail = true;
        }
      },
      err => {
        this.editFail = true;
        this.errorMessage = 'Unknown error occured. Please try again';
      }
    );
  }

  successfullEditRequest(data) : void {
    this.router.navigateByUrl(`/projects/details/${this.id}`);
  }
}