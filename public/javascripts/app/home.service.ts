import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';

@Injectable()
export class HomeService {
    private headers = new Headers({'Content-Type': 'application/json'});
    
    constructor(private http: Http) { }
    
    login(user : User): Promise<any> {
        return this.http.post('auth/login', user ,{headers: this.headers})
                  .toPromise()
                  .then(res => res.json())
                  .catch(this.handleError);
    }
    
    signup(user : User): Promise<any> {
        return this.http.post('auth/signup', user ,{headers: this.headers})
                  .toPromise()
                  .then(res => res.json())
                  .catch(this.handleError);
    }
    
    signout(): Promise<any> {
        return this.http.get('auth/signout').toPromise();
    }
    
    storeUser(user) : void {
        sessionStorage.setItem('user',JSON.stringify(user));
    }
    
    fetchUser() {
        return JSON.parse(sessionStorage.getItem('user'));
    }
    
    removeUser() : void {
        sessionStorage.removeItem('user');
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}   