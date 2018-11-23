import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../core/services/projects/projects.service';
import { Project } from '../../core/models/view-models/project.view.model';


@Component({
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  public projects : Project[];
  public errorMessage :string;
  public loadProjectData: boolean;

  constructor(
    private projectsService : ProjectsService) { }

    async ngOnInit() {
      const loadAllProjects = await this.projectsService
      .getOwnProjects(localStorage.getItem('_id'))
      .subscribe(data => {
        console.log(data)
        if(data.success == true) {
          this.projects = data.projects;
          this.loadProjectData = true;
        } else {
          this.errorMessage = data.errorMessage;
          this.loadProjectData = false;
        }
      },
      err => {
        this.projects = [];
        this.errorMessage = 'Unknown error occured. Please try again';
        this.loadProjectData = false;
      });

      return loadAllProjects;
    }
}