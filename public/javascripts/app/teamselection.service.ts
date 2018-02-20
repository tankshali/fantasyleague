import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class TeamSelectionService {
    private headers = new Headers({'Content-Type': 'application/json'});
    
    constructor(private http: Http) { }
    
    getFixureData() : Promise<any> {
        return this.http.get('api/getFixureData')
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }
    
    getTeamSelectionData(team1, team2, team3, team4) : Promise<any> {
        let url = 'api/getTeamSelectionData/'+team1+'/'+team2+'/'+team3+'/'+team4;
        return this.http.get(url)
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }
    
    saveTeam(selectedPlayerList) : Promise<any> {
        return this.http.post('api/saveTeam', {'selectedPlayerList': selectedPlayerList} ,{headers: this.headers})
                  .toPromise()
                  .then(res => res.json())
                  .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}