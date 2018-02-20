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
var shared_service_1 = require('./shared.service');
var home_service_1 = require('./home.service');
var router_1 = require('@angular/router');
var rootObj_1 = require('./rootObj');
var AppComponent = (function () {
    function AppComponent(router, sharedService, homeService) {
        this.router = router;
        this.sharedService = sharedService;
        this.homeService = homeService;
        this.title = 'Marvels Fantasy League';
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.sharedService.getRootObj()) {
            this.rootObj = this.sharedService.getRootObj();
        }
        else {
            this.rootObj = new rootObj_1.RootObj(false);
        }
        this.subscription = this.sharedService.dataChange.subscribe(function (obj) { return _this.rootObj = obj; });
    };
    AppComponent.prototype.signout = function () {
        var _this = this;
        this.homeService.signout().then(function () { return _this.signoutHandler(); });
    };
    AppComponent.prototype.signoutHandler = function () {
        this.rootObj = new rootObj_1.RootObj(false);
        this.sharedService.removeRootObj();
        this.homeService.removeUser();
        this.router.navigate(['']);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'pages/app.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, shared_service_1.SharedService, home_service_1.HomeService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map