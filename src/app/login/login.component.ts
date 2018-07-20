import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private appComponent: AppComponent) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    this.appComponent.canActivate = false;
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/main';
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          console.log(data[0]);
          if (data[0]) {
            this.appComponent.canActivate = true;
            this.router.navigate([this.returnUrl]);
          }
          else {
            this.alertService.error("Username or password is incorrect");
            this.loading = false;
          }     
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        });
  }

}
