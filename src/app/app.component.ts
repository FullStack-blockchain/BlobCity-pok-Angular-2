import { Component, OnInit, OnChanges } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  canActivate = false;
  toggleNav: false;
  toggleDropdown: false;

  constructor() { }
  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      this.canActivate = true;
    }
    else{
      // not logged in so redirect to login page with the return url
      this.canActivate = false;
    }
  }

}
