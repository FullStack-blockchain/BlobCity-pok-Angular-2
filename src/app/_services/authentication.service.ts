import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }
    
    login(email: string, password: string) {
        // Tried adding headers with no luck
        const headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        return this.http.get('http://sb-api.blobcity.net/rest/v1/user/login?email='+email+'&password='+password)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user[0]) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    console.log("SessionToken",user[1]);
                    localStorage.setItem('currentUser', user[1]);
                    
                }
                console.log(user);
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}