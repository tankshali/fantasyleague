import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Observer} from 'rxjs/Observer';

import { RootObj } from './rootObj';

@Injectable()
export class SharedService {
    rootObj : RootObj;
    dataChange: Observable<any>;
    dataChangeObserver : Observer<any>;

    constructor() {
        this.dataChange = new Observable(observer => this.dataChangeObserver = observer).share();
    }
    
    setRootObj (obj : RootObj) {
        this.rootObj = obj;
        sessionStorage.setItem('rootObj',JSON.stringify(this.rootObj));
        this.dataChangeObserver.next(this.rootObj);
    }
    
    getRootObj () {
        return JSON.parse(sessionStorage.getItem('rootObj'));
    }
    
    removeRootObj () {
        sessionStorage.removeItem('rootObj');
    }
}