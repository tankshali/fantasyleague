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
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/share');
var SharedService = (function () {
    function SharedService() {
        var _this = this;
        this.dataChange = new Observable_1.Observable(function (observer) { return _this.dataChangeObserver = observer; }).share();
    }
    SharedService.prototype.setRootObj = function (obj) {
        this.rootObj = obj;
        sessionStorage.setItem('rootObj', JSON.stringify(this.rootObj));
        this.dataChangeObserver.next(this.rootObj);
    };
    SharedService.prototype.getRootObj = function () {
        return JSON.parse(sessionStorage.getItem('rootObj'));
    };
    SharedService.prototype.removeRootObj = function () {
        sessionStorage.removeItem('rootObj');
    };
    SharedService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SharedService);
    return SharedService;
}());
exports.SharedService = SharedService;
//# sourceMappingURL=shared.service.js.map