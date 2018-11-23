import { Injectable } from "@angular/core";
import { Project } from "../../models/view-models/project.view.model";
import { HttpHeaders} from '@angular/common/http';
import { Router } from "@angular/router";
import { HttpClientService } from "../http-client.service";
import { Observable } from "rxjs/Observable";

const baseUrl : string = 'http://localhost:7313/';
const createUrl : string = 'http://localhost:7313/projects/create';

@Injectable()
export class ProjectsService {

  constructor(
    private httpService : HttpClientService,
    private router : Router
  ) { }

  getAll (): Observable<any> {
    let httpUrl:string = baseUrl;
    return this.httpService.get(httpUrl);
  }

  getById(id : string) : Observable<any>{
    let httpUrl:string = `${baseUrl}projects/details/${id}`;
    return this.httpService.get(httpUrl);
  }

  getOwnProjects(id : string) : Observable<any>{
    let httpUrl:string = `${baseUrl}projects/ownProjects/${id}`;
    return this.httpService.get(httpUrl);
  }

  create(projectObject) : Observable<any> {
    let httpUrl : string = createUrl;
    return this.httpService.post(httpUrl, projectObject);
  }

  createGet() : Observable<any> {
    let httpUrl : string = createUrl;
    return this.httpService.get(httpUrl);
  }

  editGet(id : string) : Observable<any> {
    let httpUrl:string = `${baseUrl}projects/edit/${id}`;
    return this.httpService.get(httpUrl);
  }

  edit(projectObject, id : string) : Observable<any> {
    let httpUrl:string = `${baseUrl}projects/edit/${id}`;
    return this.httpService.put(httpUrl, projectObject);
  }

  delete(id : string) : Observable<any> {
    let httpUrl:string = `${baseUrl}projects/delete/${id}`;
    return this.httpService.delete(httpUrl);
  }

  getAllComments(id : string) : Observable<any> {
    let httpUrl:string = `${baseUrl}projects/comments/${id}`;
    return this.httpService.get(httpUrl);
  }

  addComment(projectObject, id : string) : Observable<any> {
    let httpUrl:string = `${baseUrl}projects/comments/${id}`;
    return this.httpService.post(httpUrl, projectObject);
  }

  editCommentGet(pojectId : string, commentId : string) : Observable<any> {
    let httpUrl:string = `${baseUrl}projects/comments/${pojectId}/editComment/${commentId}`;
    return this.httpService.get(httpUrl);
  }

  editComment(commentObject, pojectId : string, commentId : string) : Observable<any> {
    let httpUrl:string = `${baseUrl}projects/comments/${pojectId}/editComment/${commentId}`;
    return this.httpService.put(httpUrl, commentObject);
  }

  deleteComment(pojectId : string, commentId: string) : Observable<any> {
    let httpUrl:string = `${baseUrl}projects/comments/${pojectId}/deleteComment/${commentId}`;
    return this.httpService.put(httpUrl, pojectId);
  }
  
}