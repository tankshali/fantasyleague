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
var user_1 = require('./user');
var home_service_1 = require('./home.service');
var shared_service_1 = require('./shared.service');
var router_1 = require('@angular/router');
var rootObj_1 = require('./rootObj');
var HomeComponent = (function () {
    function HomeComponent(router, homeService, sharedService) {
        this.router = router;
        this.homeService = homeService;
        this.sharedService = sharedService;
        this.user = new user_1.User('', '', '', '', '');
        this.errorMsg = null;
        this.signupEvent = false;
    }
    HomeComponent.prototype.ngOnInit = function () {
        if (this.sharedService.getRootObj() && this.sharedService.getRootObj().authenticated == true) {
            this.router.navigate(['dashboard']);
        }
    };
    HomeComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.signupEvent) {
            if (this.user.password == this.user.confirmpassword) {
                this.homeService.signup(this.user)
                    .then(function (res) { return _this.signupHandler(res); });
            }
            else {
                this.errorMsg = 'Password and re-entered password didnt match';
                this.user.password = '';
                this.user.confirmpassword = '';
            }
        }
        else {
            this.homeService.login(this.user)
                .then(function (res) { return _this.authHandler(res); });
        }
    };
    HomeComponent.prototype.authHandler = function (res) {
        if (res.state == 'success') {
            this.homeService.storeUser(res.user);
            var rootObj = new rootObj_1.RootObj(true);
            this.sharedService.setRootObj(rootObj);
            this.router.navigate(['/dashboard']);
        }
        else {
            this.errorMsg = res.message;
        }
    };
    HomeComponent.prototype.signupHandler = function (res) {
        if (res.state == 'success') {
            this.homeService.storeUser(res.user);
            var rootObj = new rootObj_1.RootObj(true);
            this.sharedService.setRootObj(rootObj);
            this.router.navigate(['/dashboard']);
        }
        else {
            this.errorMsg = 'Username already taken';
        }
    };
    HomeComponent.prototype.signup = function () {
        this.errorMsg = null;
        this.signupEvent = true;
        this.user = new user_1.User('', '', '', '', '');
    };
    HomeComponent.prototype.signin = function () {
        this.errorMsg = null;
        this.signupEvent = false;
        this.user = new user_1.User('', '', '', '', '');
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'my-details',
            templateUrl: 'pages/home.component.html',
            providers: [home_service_1.HomeService]
        }), 
        __metadata('design:paramtypes', [router_1.Router, home_service_1.HomeService, shared_service_1.SharedService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map