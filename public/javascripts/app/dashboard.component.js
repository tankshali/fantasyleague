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
var dashboard_service_1 = require('./dashboard.service');
var DashboardComponent = (function () {
    function DashboardComponent(dashboardService) {
        this.dashboardService = dashboardService;
        this.leagues = [];
        this.userStats = {};
        this.lastRank = 0;
        this.OverallRank = 0;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.dashboardService.getDashboardData()
            .then(function (res) { return _this.dashboardDataHandler(res); });
        this.dashboardService.getRanksData()
            .then(function (res) { return _this.rankDataHandler(res); });
    };
    DashboardComponent.prototype.dashboardDataHandler = function (res) {
        if (res.state == 'success') {
            this.userStats = res.payload.userStats;
            this.leagues = res.payload.leagueData;
        }
    };
    DashboardComponent.prototype.rankDataHandler = function (res) {
        if (res.state == 'success') {
            this.lastRank = res.payload.lastRank;
            this.OverallRank = res.payload.overallRank;
        }
    };
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'my-dashboard',
            templateUrl: 'pages/dashboard.component.html',
            providers: [dashboard_service_1.DashboardService]
        }), 
        __metadata('design:paramtypes', [dashboard_service_1.DashboardService])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map