import { Injectable } from "@angular/core";
import { LoginInputModel } from "../../models/input-models/login.input.model";
import { HttpClientService } from "../http-client.service";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';

const baseUrl : string = 'http://localhost:7313/';

@Injectable()
export class AuthService {
  public redirectUrl : string;
  private currentAuthtoken : string;

  constructor(
    private httpService : HttpClientService,
    private http: HttpClient,
    private router : Router
  ) { }


  login(body):Observable<any> {
    const data = {email: body.email, password: body.password};
    let httpUrl:string = `${baseUrl}users/login`;
    this.redirectUrl = '/projects';
    return this.httpService.post(httpUrl, data);
  }

  register(registerModel){
    let httpUrl:string = `${baseUrl}users/register`;
    this.redirectUrl = '/login';
    return this.httpService.post(httpUrl, registerModel);
  }

  getUserProfile(id : string) :Observable<any>{
    let httpUrl:string = `${baseUrl}users/profile/${id}`;
    return this.httpService.get(httpUrl);
  }

  upload(formData, id) {
    let headers = new HttpHeaders();
    headers.set('Accept', 'application/json');

    return this.http.post(`${baseUrl}users/profile/${id}`, formData, { headers: headers });
  }

  isLoggedIn() : Observable<any> {
    let userID : string = localStorage.getItem('_id');
    let httpUrl:string = `${baseUrl}users/${userID}`;
    return this.http.get(httpUrl)
  }
  
  get authtoken() {
    return this.currentAuthtoken;
  }

  set authtoken(value : string) {
    this.currentAuthtoken = value;
  }

  tryNavigate() {
    console.log('redirect: ' + this.redirectUrl)
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
    } else {
      this.router.navigate(["/projects"]);
    }
  }
}