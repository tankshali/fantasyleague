import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ScoringService {
    private headers = new Headers({'Content-Type': 'application/json'});
    
    constructor(private http: Http) { }
    
    getPlayersForCurrentMatch() : Promise<any> {
        return this.http.get('api/getPlayersForCurrentMatch')
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }
    
    submitScore(scoreobj) : Promise<any> {
        return this.http.post('api/submitScore', {'scoreobj': scoreobj} ,{headers: this.headers})
                  .toPromise()
                  .then(res => res.json())
                  .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

