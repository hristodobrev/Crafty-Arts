import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../core/services/authentication/auth.service';
import { UserModel } from '../../../core/models/input-models/user.model';
import { Subject } from 'rxjs/Subject';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';


@Component({
  templateUrl: './user-profile.component.html'
})

export class UserProfileComponent implements OnInit {
  public user : UserModel;
  public id : string;
  public loadedData : boolean;
  public errorMessage : string;
  private targetedUser$ = new Subject<string>();
  @ViewChild('fileInput') fileInput;
  
  constructor(
    private route : ActivatedRoute,
    private authService : AuthService,
    private router : Router
  ) { 
    this.id = this.route.snapshot.params["id"];
    this.user = new UserModel(
      this.id, 
      localStorage.getItem('email'), 
      "", 
      localStorage.getItem('name'),
      "",
      "",
      "");
  }

  async ngOnInit() {
    /*this.targetedUser$.pipe(
      debounceTime(700),
      switchMap(p => this.authService.getUserProfile(this.id))
    ).subscribe(data => {
      if(data.success == true) {
        this.loadedData = true;
        this.user = data.user;
      } else {
        this.errorMessage = data.errorMessage;
        this.loadedData = false;
      }  
    },
    err => {
      console.log(err);
      this.errorMessage = 'Something went wrong...';
      this.loadedData = false;
    });*/
    
    const getUserDetails = await this.authService
    .getUserProfile(this.id)
    .subscribe(data => {
      if(data.success == true) {
        this.loadedData = true;
        this.user = data.user;
      } else {
        this.errorMessage = data.errorMessage;
        this.loadedData = false;
      }
    },
    err => {
      console.log(err);
      this.errorMessage = 'Something went wrong...';
      this.loadedData = false;
    });

    return getUserDetails;
  }

  upload(e) {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("image", fileBrowser.files[0]);
      this.authService
      .upload(formData, this.id)
      .subscribe(res => {
        console.log(res);
        this.router.navigateByUrl(`/projects`);
      });
    }
  }
}