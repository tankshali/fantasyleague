import { Component, OnInit } from '@angular/core';
import { ScoringService } from './scoring.service';
import { Score } from './score';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'pages/scoring.component.html',
  providers: [ScoringService]
})

export class ScoringComponent {
    errorMsg = null;
    successMsg = null;
    playersList = [];
    fixuresList = [];
    playerid;
    fixture;
    scoreObj = new Score(0,0,'',0,0,0,0,0,0,0,0,0);
    scorecard = [];
    pointSystem = {
        run: 5,
        wicket: 70,
        catches: 50,
        runout: 50,
        battingmilestone1: 50,
        battingmilestone2: 100,
        battingbonus: 50,
        bowlingmilestone1: 3,
        bowlingmilestone2: 5,
        bowlingbonus: 50,
        mom: 200,
        captainMultiplier: 2
    };
    
    constructor(
        private scoringService: ScoringService
    ) { }
    
    ngOnInit(): void {
        this.scoringService.getPlayersForCurrentMatch()
            .then(res => this.playersDataHandler(res));
    }
    
    private playersDataHandler(res){
        if(res.state == 'success'){
            this.playersList = res.payload.players;
            this.fixuresList = res.payload.fixures;
        }
    }
    
    addToScorecard() : void {
        this.scoreObj.playerid = this.playerid;
        this.scoreObj.fixtureid = this.fixture.fixtureid;
        this.scoreObj.date = this.fixture.date;
        
        var battingBonus = 0;
        if(this.scoreObj.runs >= this.pointSystem.battingmilestone2){
            battingBonus = this.pointSystem.battingbonus * 2;
        }else if(this.scoreObj.runs >= this.pointSystem.battingmilestone1){
            battingBonus = this.pointSystem.battingbonus;
        }
        this.scoreObj.battingscore = (this.scoreObj.runs * this.pointSystem.run) + battingBonus;

        var bowlingBonus = 0;
        if(this.scoreObj.wickets >= this.pointSystem.bowlingmilestone2){
            bowlingBonus = this.pointSystem.bowlingbonus * 2;
        }else if(this.scoreObj.wickets >= this.pointSystem.bowlingmilestone1){
            bowlingBonus = this.pointSystem.bowlingbonus;
        }
        this.scoreObj.bowlingscore = (this.scoreObj.wickets * this.pointSystem.wicket) + bowlingBonus;

        this.scoreObj.fieldingscore = (this.scoreObj.catches * this.pointSystem.catches) + (this.scoreObj.runouts * this.pointSystem.runout);

        if(this.scoreObj.mom == 1){
            this.scoreObj.totalscore = this.scoreObj.battingscore + this.scoreObj.bowlingscore + this.scoreObj.fieldingscore + this.pointSystem.mom; 
        }else{
            this.scoreObj.totalscore = this.scoreObj.battingscore + this.scoreObj.bowlingscore + this.scoreObj.fieldingscore;
        }
        
        this.scoringService.submitScore(this.scoreObj)
                .then(res => this.submitScoreHandler(res));
        
        /*this.scorecard.push(new Score(
            this.playerid,
            this.fixture.fixtureid,
            this.fixture.date,
            this.scoreObj.runs,
            this.scoreObj.battingscore,
            this.scoreObj.wickets,
            this.scoreObj.bowlingscore,
            this.scoreObj.catches,
            this.scoreObj.runouts,
            this.scoreObj.fieldingscore,
            this.scoreObj.mom,
            this.scoreObj.totalscore
        ));
        
        this.scoreObj = new Score(0,0,'',0,0,0,0,0,0,0,0,0);
        this.playerid = 0;
        this.fixture = {};*/
    }
    
    private submitScoreHandler(res){
        if(res.state == 'success'){
            this.successMsg = 'Scorecard saved successfully';
            this.scoreObj = new Score(0,0,'',0,0,0,0,0,0,0,0,0);
            this.playerid = 0;
            this.fixture = {};
        }else{
            this.errorMsg = res.message;
        }
    }
}