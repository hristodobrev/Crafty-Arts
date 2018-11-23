import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { Route } from '@angular/router/src/config';


@Component({
  templateUrl: './comment-edit.component.html'
})

export class CommentEditComponent implements OnInit {
  public errorMessage :string;
  public projectId: string;
  public commentId: string;
  public currentComment: string;
  public newComment : string;
  public updateCommentFail: boolean;
  public loadCommentFail: boolean;


  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private projectsService : ProjectsService
  ) { 
    this.newComment = "";
    this.currentComment = "";
    this.updateCommentFail = true;
  }

  async ngOnInit() {
   this.projectId = this.route.snapshot.params["projectId"];
   this.commentId = this.route.snapshot.params["commentId"];
   const loadComment = await this.projectsService
   .editCommentGet(this.projectId, this.commentId)
   .subscribe(data => {
    if(data.success == true) {
      this.currentComment = data.commentData[0].comments[0];
      this.loadCommentFail = false;
    } else {
      this.errorMessage = data.errorMessage;
      this.loadCommentFail = true;
    }
   },
    err => {
      console.log(err);
    });

    return loadComment;
  }

  async editComment() {
    let commentToUpdate = {
      content: this.newComment,
      commentAuthor: localStorage.getItem('_id')
    }
    
    const updatedComment = await this.projectsService
    .editComment(commentToUpdate, this.projectId, this.commentId)
    .subscribe(
      data => {
        this.successfullUpdatedCommentRequest(data);
      },
      err => {
        this.updateCommentFail = false;
        this.errorMessage = 'Unknown error occured. Please try again';
      }
    )

    return updatedComment;
  }

  successfullUpdatedCommentRequest(data) : void {
    this.updateCommentFail = true;
    this.router.navigateByUrl(`/projects/comments/${this.projectId}`);
  }

  async deleteComment() {
    const deletedComment = await this.projectsService
    .deleteComment(this.projectId, this.commentId)
    .subscribe(
      data => {
        if(data.success == true) {
          this.successfullyDeletedCommentRequest();
          this.loadCommentFail = false;
        } else {
          this.errorMessage = data.errorMessage;
          this.loadCommentFail = true;
        }
      },
      err => {
        console.log(err);
      }
    )

    return deletedComment;
  }

  successfullyDeletedCommentRequest() : void {
    console.log('successfully deleted');
    this.router.navigateByUrl(`/projects/comments/${this.projectId}`);
  }
}

