import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  public user : string;
  public userId : string;
  public isCollapsed = true;
  public isLoggedIn: boolean;

  constructor(
    private router : Router
  ) { 
    router.events.subscribe(e => {
      this.isLoggedIn = localStorage.getItem('email') !== null;
      this.user = localStorage.getItem('name');
      this.userId = localStorage.getItem('_id');
    });
  }

  ngOnInit() { }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}