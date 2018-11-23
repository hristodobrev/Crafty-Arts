import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Project } from '../../../core/models/view-models/project.view.model';
import { UserModel } from '../../../core/models/input-models/user.model';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { Route } from '@angular/router/src/config';


@Component({
  templateUrl: './project-delete.component.html'
})

export class ProjectDeleteComponent implements OnInit {
  public project : Project;
  public errorMessage :string;
  public id: string;
  public loadProjectData: boolean;

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private projectsService : ProjectsService
  ) {
    
    this.project = new Project("", 0, "", "","");
   }

  async ngOnInit() {
    this.id = this.route.snapshot.params["id"];
    const getProjectInfo = await this.projectsService
    .getById(this.id)
    .subscribe(data => {
      if(data.success == true) {
        this.project = data.project;
        this.loadProjectData = false;
      } else {
        this.errorMessage = data.errorMessage;
        this.loadProjectData = true;
      }
    },
    err => {
      console.log(err);
    });

    return getProjectInfo;
}

  deleteProject () : void {
    this.projectsService.delete(this.id)
    .subscribe(
      data => {
        if(data.success == true) {
          this.successfullDelteRequest(data);
        } else {
          this.loadProjectData = true;
          this.errorMessage = data.errorMessage;
        }
      },
      err => {
        this.loadProjectData = true;
        this.errorMessage = 'Unknown error occured. Please try again';
      }
    );
  }

  successfullDelteRequest(data) : void {
    this.router.navigate(['/projects']);
  }
}