import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'pages/dashboard.component.html',
  providers: [DashboardService]
})

export class DashboardComponent {
    leagues = [];
    userStats = {};
    lastRank = 0;
    OverallRank = 0;
    
    constructor(
        private dashboardService: DashboardService
    ) { }
    
    ngOnInit(): void {
        window.scrollTo(0,0);
        this.dashboardService.getDashboardData()
            .then(res => this.dashboardDataHandler(res));
        this.dashboardService.getRanksData()
            .then(res => this.rankDataHandler(res));
    }
    
    private dashboardDataHandler(res){
        if(res.state == 'success'){
            this.userStats = res.payload.userStats;
            this.leagues = res.payload.leagueData;
        }
    }
    
    private rankDataHandler(res){
        if(res.state == 'success'){
            this.lastRank = res.payload.lastRank;
            this.OverallRank = res.payload.overallRank;
        }
    }
}