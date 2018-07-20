import { Component, OnInit, NgZone } from '@angular/core';
import { AlertService, UserService } from "../_services/index";
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';


@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.sass']
})
export class BillComponent implements OnInit {

  loading = false;

  cardNumber: number;
  expiryMonth: number;
  expiryYear: number;
  cvc: number;
  cardName: string;
  country: string;
  userToken: string;
  stripeToken: string;
  addedCards: string[];
  data: object;
  modalToggle = false;
  pinCode: number;
  CardIdToDel: string;

  constructor(private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private _zone: NgZone,
    private http: Http) { }

  ngOnInit() {

    this.fetchCards();
  }

  fetchCards() {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      this.userToken = localStorage.getItem('currentUser');
      // Tried adding headers with no luck
      const headers: Headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      return this.http.get('http://sb-api.blobcity.net/rest/v1/user/cards?st=' + this.userToken).subscribe((res: Response) => {
        this.addedCards = res.json()['cards'];
        console.log(res.json()['cards']);
      });
    }
  }

  getToken() {
    this.loading = true;
    if (this.country || this.pinCode >=0 && this.pinCode <=9999) {
      //Get Stripe Token
      (<any>window).Stripe.card.createToken({
        number: this.cardNumber,
        exp_month: this.expiryMonth,
        exp_year: this.expiryYear,
        cvc: this.cvc
      }, (status: number, response: any) => {

        //Wrapping insidethe Angular zone
        this._zone.run(() => {
          this.loading = false;
          if (status == 200) {
            this.alertService.success(`Success! Card token ${response.card.id}.`, true);
            console.log(response.id);
          } else {
            this.alertService.error(response.error.message);
            return;
          }

          const headers: Headers = new Headers();


          headers.append('Content-Type', 'application/json');

          return this.http.post('http://sb-api.blobcity.net/rest/v1/user/add-card', {"st":this.userToken,"stripe-token": this.stripeToken,"country":this.country,"pin-code":this.pinCode}, {headers: headers})
              .subscribe((response: Response) => {
                  // 
                  console.log(response.json()['ack']);
                  if (response.json()['ack'] == "1") {
                    this.alertService.success(`New card added successfully!`, true);
                    this.fetchCards();
                  } else {
                    this.alertService.error("Failed add cards");
                  }
              });
        });
        
      });      
    } else {
      this.alertService.error("Please fill all fields correctly");
      this.loading = false;
      return;
    }

  }

  makePrimary(i: number, id: string) {
    console.log(i, id);
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://sb-api.blobcity.net/rest/v1/user/set-card-primary?st=' + this.userToken + '&id=' + id).subscribe((res: Response) => {
      console.log(res.json()['ack']);
      if (res.json()['ack'] == "1") {
        this.alertService.success(`Success!`, true);
        this.fetchCards();
      } else {
        this.alertService.error("Failed");
      }
    });
  }

  setDelCard(i:number, id: string) {
    console.log(i, id);
    this.CardIdToDel = id;
  }

  delCard() {
    this.loading = true;
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://sb-api.blobcity.net/rest/v1/user/delete-card?st=' + this.userToken + '&id=' + this.CardIdToDel).subscribe((res: Response) => {
      console.log(res.json()['ack']);
      this.loading = false;
      this.modalToggle = false;
      if (res.json()['ack'] == "1") {
        this.alertService.success(`Success!`, true);
        this.fetchCards();
      } else {
        this.alertService.error("Failed");
      }
    });
  }

}
