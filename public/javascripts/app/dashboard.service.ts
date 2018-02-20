import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DashboardService {
    private headers = new Headers({'Content-Type': 'application/json'});
    
    constructor(private http: Http) { }
    
    getDashboardData() : Promise<any> {
        return this.http.get('api/getDashboardData')
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }
    
    getRanksData() : Promise<any> {
        return this.http.get('api/getUserRanks')
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}