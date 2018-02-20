import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared.service';
import { HomeService }  from './home.service';
import { Router } from '@angular/router';
import { RootObj } from './rootObj';

@Component({
  selector: 'my-app',
  templateUrl: 'pages/app.component.html'
})

export class AppComponent implements OnInit {
    title = 'Marvels Fantasy League';
    rootObj : RootObj;
    subscription: any;
    
    constructor(
        private router: Router,
        private sharedService : SharedService,
        private homeService: HomeService
    ) {}
    
    ngOnInit(): void {
        if(this.sharedService.getRootObj()){
            this.rootObj = this.sharedService.getRootObj();
        }else{
            this.rootObj = new RootObj(false);
        }
        
        this.subscription = this.sharedService.dataChange.subscribe(obj => this.rootObj = obj);
    }
    
    signout(): void {
        this.homeService.signout().then(() => this.signoutHandler());
    }
    
    private signoutHandler(){
        this.rootObj = new RootObj(false);
        this.sharedService.removeRootObj();
        this.homeService.removeUser();
        this.router.navigate(['']);
    }
}
