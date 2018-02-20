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
var home_service_1 = require('./home.service');
var teamselection_service_1 = require('./teamselection.service');
var TeamSelectionComponent = (function () {
    function TeamSelectionComponent(homeService, teamSelectionService) {
        this.homeService = homeService;
        this.teamSelectionService = teamSelectionService;
        this.errorMsg = null;
        this.successMsg = null;
        this.validationObj = {
            numOfPlayers: 11,
            maxForeignPlayers: 4,
            minWicketKeeper: 1,
            minBowlers: 5,
            budget: 45.00
        };
        this.actualObj = {
            numOfPlayers: 0,
            foreignPlayers: 0,
            numOfWicketKeeper: 0,
            numOfBowlers: 0,
            budget: 0.00
        };
    }
    TeamSelectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.teamSelectionService.getFixureData()
            .then(function (res) { return _this.fixureDataHandler(res); });
    };
    TeamSelectionComponent.prototype.fixureDataHandler = function (res) {
        var _this = this;
        if (res.state == 'success') {
            this.fixureList = res.payload;
            if (this.fixureList && this.fixureList[0]) {
                var team1 = this.fixureList[0].team1;
                var team2 = this.fixureList[0].team2;
                if (this.fixureList.length == 2 && this.fixureList[1]) {
                    var team3 = this.fixureList[1].team1;
                    var team4 = this.fixureList[1].team2;
                    this.teamSelectionService.getTeamSelectionData(team1, team2, team3, team4)
                        .then(function (res) { return _this.teamSelectionDataHandler(res); });
                }
                else {
                    this.teamSelectionService.getTeamSelectionData(team1, team2, 'null', 'null')
                        .then(function (res) { return _this.teamSelectionDataHandler(res); });
                }
            }
        }
    };
    TeamSelectionComponent.prototype.teamSelectionDataHandler = function (res) {
        if (res.state == 'success') {
            this.playerList = res.payload.playersList;
            this.selectedPlayerList = res.payload.selectedPlayersList;
            this.setActualObjForValidation(this.selectedPlayerList);
        }
    };
    TeamSelectionComponent.prototype.setActualObjForValidation = function (selectedPlayerList) {
        this.actualObj.numOfPlayers = selectedPlayerList.length;
        for (var _i = 0, selectedPlayerList_1 = selectedPlayerList; _i < selectedPlayerList_1.length; _i++) {
            var player = selectedPlayerList_1[_i];
            if (player.type == 'Foreign') {
                this.actualObj.foreignPlayers = this.actualObj.foreignPlayers + 1;
            }
            if (player.role == 'Wicket Keeper') {
                this.actualObj.numOfWicketKeeper = this.actualObj.numOfWicketKeeper + 1;
            }
            if (player.role == 'Bowler' || player.role == 'All-rounder') {
                this.actualObj.numOfBowlers = this.actualObj.numOfBowlers + 1;
            }
            this.actualObj.budget = this.actualObj.budget + player.price;
            this.actualObj.budget = Math.round(this.actualObj.budget * 100) / 100;
            if (player.captain == 1) {
                this.selectedCaptainId = player.playerid;
            }
        }
    };
    TeamSelectionComponent.prototype.addToTeam = function (playerid) {
        var loopIndex = 0;
        for (var _i = 0, _a = this.playerList; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.playerid == playerid) {
                console.log('username - ' + this.homeService.fetchUser().username);
                player.username = this.homeService.fetchUser().username;
                console.log('date - ' + this.fixureList[0].date);
                player.date = this.fixureList[0].date;
                this.selectedPlayerList.push(player);
                this.playerList.splice(loopIndex, 1);
                this.actualObj.numOfPlayers = this.actualObj.numOfPlayers + 1;
                if (player.type == 'Foreign') {
                    this.actualObj.foreignPlayers = this.actualObj.foreignPlayers + 1;
                }
                if (player.role == 'Wicket Keeper') {
                    this.actualObj.numOfWicketKeeper = this.actualObj.numOfWicketKeeper + 1;
                }
                if (player.role == 'Bowler' || player.role == 'All-rounder') {
                    this.actualObj.numOfBowlers = this.actualObj.numOfBowlers + 1;
                }
                this.actualObj.budget = this.actualObj.budget + player.price;
                this.actualObj.budget = Math.round(this.actualObj.budget * 100) / 100;
                break;
            }
            loopIndex++;
        }
    };
    TeamSelectionComponent.prototype.removeFromTeam = function (playerid) {
        var loopIndex = 0;
        for (var _i = 0, _a = this.selectedPlayerList; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.playerid == playerid) {
                this.playerList.push(player);
                this.selectedPlayerList.splice(loopIndex, 1);
                this.actualObj.numOfPlayers = this.actualObj.numOfPlayers - 1;
                if (player.type == 'Foreign') {
                    this.actualObj.foreignPlayers = this.actualObj.foreignPlayers - 1;
                }
                if (player.role == 'Wicket Keeper') {
                    this.actualObj.numOfWicketKeeper = this.actualObj.numOfWicketKeeper - 1;
                }
                if (player.role == 'Bowler' || player.role == 'All-rounder') {
                    this.actualObj.numOfBowlers = this.actualObj.numOfBowlers - 1;
                }
                this.actualObj.budget = this.actualObj.budget - player.price;
                this.actualObj.budget = Math.round(this.actualObj.budget * 100) / 100;
                break;
            }
            loopIndex++;
        }
    };
    TeamSelectionComponent.prototype.submitTeam = function () {
        var _this = this;
        this.errorMsg = null;
        this.successMsg = null;
        if (this.validationObj.numOfPlayers != this.actualObj.numOfPlayers) {
            this.errorMsg = 'Team combination does not comply with fantasy league rules. Please make necessary changes in your team';
        }
        else if (this.actualObj.foreignPlayers > this.validationObj.maxForeignPlayers) {
            this.errorMsg = 'Team combination does not comply with fantasy league rules. Please make necessary changes in your team';
        }
        else if (this.actualObj.numOfWicketKeeper < this.validationObj.minWicketKeeper) {
            this.errorMsg = 'Team combination does not comply with fantasy league rules. Please make necessary changes in your team';
        }
        else if (this.actualObj.numOfBowlers < this.validationObj.minBowlers) {
            this.errorMsg = 'Team combination does not comply with fantasy league rules. Please make necessary changes in your team';
        }
        else if (this.actualObj.budget > this.validationObj.budget) {
            this.errorMsg = 'Your budget exausted. Please make necessary changes in your team';
        }
        else if (!this.selectedCaptainId) {
            this.errorMsg = 'Please select a captain for your team';
        }
        else {
            console.log('selectedCaptainId - ' + this.selectedCaptainId);
            var loopIndex = 0;
            for (var _i = 0, _a = this.selectedPlayerList; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.playerid == this.selectedCaptainId) {
                    player.captain = 1;
                }
                else {
                    player.captain = 0;
                }
                this.selectedPlayerList[loopIndex] = player;
                loopIndex++;
            }
            this.teamSelectionService.saveTeam(this.selectedPlayerList)
                .then(function (res) { return _this.saveTeamResponseHandler(res); });
        }
    };
    TeamSelectionComponent.prototype.saveTeamResponseHandler = function (res) {
        if (res.state == 'success') {
            this.successMsg = 'Your team saved successfully';
        }
        else {
            this.errorMsg = res.message;
        }
    };
    TeamSelectionComponent = __decorate([
        core_1.Component({
            selector: 'teamselection',
            templateUrl: 'pages/teamselection.component.html',
            providers: [teamselection_service_1.TeamSelectionService]
        }), 
        __metadata('design:paramtypes', [home_service_1.HomeService, teamselection_service_1.TeamSelectionService])
    ], TeamSelectionComponent);
    return TeamSelectionComponent;
}());
exports.TeamSelectionComponent = TeamSelectionComponent;
//# sourceMappingURL=teamselection.component.js.map