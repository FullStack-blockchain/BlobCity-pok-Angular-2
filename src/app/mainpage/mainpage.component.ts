import { Component, OnInit } from '@angular/core';
import { AlertService, AuthenticationService } from '../_services/index';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.sass']
})
export class MainpageComponent implements OnInit {

  usage: any = {};
  recCharge: any = {};
  unbilled: any = {};
  isLoaded: string;
  userToken: string;

  constructor(private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private http: Http) { }

  ngOnInit() {
    this.fetchInfo();
  }

  fetchInfo() {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      this.userToken = localStorage.getItem('currentUser');
      // Tried adding headers with no luck
      const headers: Headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      return this.http.get('http://sb-api.blobcity.net/rest/v1/account/home?st=' + this.userToken).subscribe((res: Response) => {
        this.isLoaded = res.json();
        console.log(this.isLoaded);
        if (this.isLoaded['ack'] == "1") {
          this.usage.note = this.isLoaded['usage']['note'];
          this.usage.unit = this.isLoaded['usage']['unit'];
          this.usage.usage = this.isLoaded['usage']['usage'];
          this.recCharge.charge = this.isLoaded['rec-charge']['charge'];
          this.recCharge.currency = this.isLoaded['rec-charge']['currency-sym'];
          this.recCharge.note = this.isLoaded['rec-charge']['note'];
          this.unbilled.charge = this.isLoaded['unbilled']['charge'];
          this.unbilled.currency = this.isLoaded['unbilled']['currency-sym'];
          this.unbilled.note = this.isLoaded['unbilled']['note'];
        } else {
          return;
        }
      });
    }
  }
}
