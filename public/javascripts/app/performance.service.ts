import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PerformanceService {
    private headers = new Headers({'Content-Type': 'application/json'});
    
    constructor(private http: Http) { }
    
    getTeamOwners() : Promise<any> {
        return this.http.get('api/getTeamOwners')
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }
    
    getDateList() : Promise<any> {
        return this.http.get('api/getDateList')
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }
    
    getTeam(teamowner, selectedDate) : Promise<any> {
        let url = 'api/getTeam/'+teamowner+'/'+selectedDate;
        return this.http.get(url)
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}