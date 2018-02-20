import { Component, OnInit } from '@angular/core';
import { PerformanceService }  from './performance.service';

@Component({
  selector: 'performances',
  templateUrl: 'pages/performance.component.html',
  providers: [PerformanceService]
})

export class PerformanceComponent implements OnInit {
    errorMsg = null;
    teamOwnersList;
    teamowner;
    dateList;
    selectedDate;
    teamPlayersList;
    noParticipationMsg;
    
    constructor(
        private performanceService: PerformanceService
    ) { }
    
    ngOnInit(): void {
        window.scrollTo(0,0);
        this.errorMsg = null;
        this.teamowner = null;
        this.selectedDate = null;
        this.noParticipationMsg = null;
        this.performanceService.getTeamOwners()
            .then(res => this.teamOwnersDataHandler(res));
        this.performanceService.getDateList()
            .then(res => this.dateListDataHandler(res));
    }
    
    private teamOwnersDataHandler(res){
        if(res.state == 'success'){
            this.teamOwnersList = res.payload;
            if((!this.teamOwnersList) || (this.teamOwnersList.length == 0)){
                this.errorMsg = 'You should be part of some league to view performances of other league members';
            }
        }
    }
    
    private dateListDataHandler(res){
        if(res.state == 'success'){
            this.dateList = res.payload;
        }
    }
    
    viewPerformance() : void {
        this.noParticipationMsg = null;
        this.teamPlayersList = null;
        this.performanceService.getTeam(this.teamowner, this.selectedDate)
            .then(res => this.teamDataHandler(res));
    }
    
    private teamDataHandler(res){
        if(res.state == 'success'){
            this.teamPlayersList = res.payload;
            if((!this.teamPlayersList) || (this.teamPlayersList.length == 0)){
                this.noParticipationMsg = 'This team owner had not participated on this date';
            }
        }
    }
}