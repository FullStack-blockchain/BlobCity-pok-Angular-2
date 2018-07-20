import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from "../_services/index";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {

  model: any = {};
  loading = false;


  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) { }

  register() {
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
        data => {
          console.log(data);
          if (data == "true") {
            this.alertService.success('Registration successful', true);
            this.router.navigate(['/login']);
          } else {
            this.alertService.error("Registration failed");
            this.loading = false;
          }
        },
        error => {

        });
  }

  ngOnInit() {
  }

}
