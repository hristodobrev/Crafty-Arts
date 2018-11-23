import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { Project } from '../../../core/models/view-models/project.view.model';

@Component({
  templateUrl: './projects.list.component.html'
})

export class ProjectsListComponent implements OnInit {
  public projects : Project[];
  
  constructor(
    private projectsService : ProjectsService
  ) { }


  async ngOnInit() {
    const getAllProjects = await this.projectsService
    .getAll()
    .subscribe(data => {
      console.log(data);
        this.projects = data.projects.sort((a,b) => a.date <= b.date);
    },
    err => {
      this.projects = [];
      console.log(err);
    });

    return getAllProjects;
  }
}