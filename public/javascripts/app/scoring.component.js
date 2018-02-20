"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var scoring_service_1 = require('./scoring.service');
var score_1 = require('./score');
var ScoringComponent = (function () {
    function ScoringComponent(scoringService) {
        this.scoringService = scoringService;
        this.errorMsg = null;
        this.successMsg = null;
        this.playersList = [];
        this.fixuresList = [];
        this.scoreObj = new score_1.Score(0, 0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0);
        this.scorecard = [];
        this.pointSystem = {
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
    }
    ScoringComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scoringService.getPlayersForCurrentMatch()
            .then(function (res) { return _this.playersDataHandler(res); });
    };
    ScoringComponent.prototype.playersDataHandler = function (res) {
        if (res.state == 'success') {
            this.playersList = res.payload.players;
            this.fixuresList = res.payload.fixures;
        }
    };
    ScoringComponent.prototype.addToScorecard = function () {
        var _this = this;
        this.scoreObj.playerid = this.playerid;
        this.scoreObj.fixtureid = this.fixture.fixtureid;
        this.scoreObj.date = this.fixture.date;
        var battingBonus = 0;
        if (this.scoreObj.runs >= this.pointSystem.battingmilestone2) {
            battingBonus = this.pointSystem.battingbonus * 2;
        }
        else if (this.scoreObj.runs >= this.pointSystem.battingmilestone1) {
            battingBonus = this.pointSystem.battingbonus;
        }
        this.scoreObj.battingscore = (this.scoreObj.runs * this.pointSystem.run) + battingBonus;
        var bowlingBonus = 0;
        if (this.scoreObj.wickets >= this.pointSystem.bowlingmilestone2) {
            bowlingBonus = this.pointSystem.bowlingbonus * 2;
        }
        else if (this.scoreObj.wickets >= this.pointSystem.bowlingmilestone1) {
            bowlingBonus = this.pointSystem.bowlingbonus;
        }
        this.scoreObj.bowlingscore = (this.scoreObj.wickets * this.pointSystem.wicket) + bowlingBonus;
        this.scoreObj.fieldingscore = (this.scoreObj.catches * this.pointSystem.catches) + (this.scoreObj.runouts * this.pointSystem.runout);
        if (this.scoreObj.mom == 1) {
            this.scoreObj.totalscore = this.scoreObj.battingscore + this.scoreObj.bowlingscore + this.scoreObj.fieldingscore + this.pointSystem.mom;
        }
        else {
            this.scoreObj.totalscore = this.scoreObj.battingscore + this.scoreObj.bowlingscore + this.scoreObj.fieldingscore;
        }
        this.scoringService.submitScore(this.scoreObj)
            .then(function (res) { return _this.submitScoreHandler(res); });
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
    };
    ScoringComponent.prototype.submitScoreHandler = function (res) {
        if (res.state == 'success') {
            this.successMsg = 'Scorecard saved successfully';
            this.scoreObj = new score_1.Score(0, 0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0);
            this.playerid = 0;
            this.fixture = {};
        }
        else {
            this.errorMsg = res.message;
        }
    };
    ScoringComponent = __decorate([
        core_1.Component({
            selector: 'my-dashboard',
            templateUrl: 'pages/scoring.component.html',
            providers: [scoring_service_1.ScoringService]
        }), 
        __metadata('design:paramtypes', [scoring_service_1.ScoringService])
    ], ScoringComponent);
    return ScoringComponent;
}());
exports.ScoringComponent = ScoringComponent;
//# sourceMappingURL=scoring.component.js.map