import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Project } from '../../../core/models/view-models/project.view.model';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { AuthService } from '../../../core/services/authentication/auth.service';

@Component({
  templateUrl: './project-details.component.html'
})

export class ProjectDetailsComponent implements OnInit {
  public project : Project;
  public isCreator: boolean;
  public isWorker: boolean;
  public isAdmin: boolean;
  public loadProjectData: boolean;
  public errorMessage :string;
  

  constructor(
    private route : ActivatedRoute,
    private projectsService : ProjectsService,
    private authService : AuthService
  ) { }

  async ngOnInit() {
    let id : string = this.route.snapshot.params["id"];
    const getProjectDetails = await this.projectsService
    .getById(id)
    .subscribe(data => {
      if(data.success == true) {
        if(data.project.creator.email === localStorage.getItem('email')) {
          this.isCreator = true;
        }
        if(data.project.worker.email === localStorage.getItem('email')){
          this.isWorker = true;
        }

        this.authService.isLoggedIn().subscribe(res => {
          if (res['success']) {

            if(res['user']['roles'].indexOf('Admin') > -1) {
              this.isAdmin = true;
            }
            
          } else {
            this.isAdmin = false;
          }
        }, err => {
          this.errorMessage = 'Unknown error occured. Please try again';
          this.loadProjectData = true;
          this.isAdmin = false;
      })

        this.project = data.project;
        this.loadProjectData = false;
      } else {
        this.errorMessage = data.errorMessage;
        this.loadProjectData = true;
      }
    },
    err => {
      console.log(err);
      this.errorMessage = 'Unknown error occured. Please try again';
      this.loadProjectData = true;
      this.isCreator = false;
      this.isWorker = false;
    });

    return getProjectDetails;
  }
}