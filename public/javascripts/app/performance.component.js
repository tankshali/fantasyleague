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
var performance_service_1 = require('./performance.service');
var PerformanceComponent = (function () {
    function PerformanceComponent(performanceService) {
        this.performanceService = performanceService;
        this.errorMsg = null;
    }
    PerformanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.errorMsg = null;
        this.teamowner = null;
        this.selectedDate = null;
        this.noParticipationMsg = null;
        this.performanceService.getTeamOwners()
            .then(function (res) { return _this.teamOwnersDataHandler(res); });
        this.performanceService.getDateList()
            .then(function (res) { return _this.dateListDataHandler(res); });
    };
    PerformanceComponent.prototype.teamOwnersDataHandler = function (res) {
        if (res.state == 'success') {
            this.teamOwnersList = res.payload;
            if ((!this.teamOwnersList) || (this.teamOwnersList.length == 0)) {
                this.errorMsg = 'You should be part of some league to view performances of other league members';
            }
        }
    };
    PerformanceComponent.prototype.dateListDataHandler = function (res) {
        if (res.state == 'success') {
            this.dateList = res.payload;
        }
    };
    PerformanceComponent.prototype.viewPerformance = function () {
        var _this = this;
        this.noParticipationMsg = null;
        this.teamPlayersList = null;
        this.performanceService.getTeam(this.teamowner, this.selectedDate)
            .then(function (res) { return _this.teamDataHandler(res); });
    };
    PerformanceComponent.prototype.teamDataHandler = function (res) {
        if (res.state == 'success') {
            this.teamPlayersList = res.payload;
            if ((!this.teamPlayersList) || (this.teamPlayersList.length == 0)) {
                this.noParticipationMsg = 'This team owner had not participated on this date';
            }
        }
    };
    PerformanceComponent = __decorate([
        core_1.Component({
            selector: 'performances',
            templateUrl: 'pages/performance.component.html',
            providers: [performance_service_1.PerformanceService]
        }), 
        __metadata('design:paramtypes', [performance_service_1.PerformanceService])
    ], PerformanceComponent);
    return PerformanceComponent;
}());
exports.PerformanceComponent = PerformanceComponent;
//# sourceMappingURL=performance.component.js.map