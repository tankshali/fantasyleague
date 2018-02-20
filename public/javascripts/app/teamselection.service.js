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
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var TeamSelectionService = (function () {
    function TeamSelectionService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
    }
    TeamSelectionService.prototype.getFixureData = function () {
        return this.http.get('api/getFixureData')
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    TeamSelectionService.prototype.getTeamSelectionData = function (team1, team2, team3, team4) {
        var url = 'api/getTeamSelectionData/' + team1 + '/' + team2 + '/' + team3 + '/' + team4;
        return this.http.get(url)
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    TeamSelectionService.prototype.saveTeam = function (selectedPlayerList) {
        return this.http.post('api/saveTeam', { 'selectedPlayerList': selectedPlayerList }, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    TeamSelectionService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    TeamSelectionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TeamSelectionService);
    return TeamSelectionService;
}());
exports.TeamSelectionService = TeamSelectionService;
//# sourceMappingURL=teamselection.service.js.map