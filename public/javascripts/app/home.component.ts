import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { HomeService }  from './home.service';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { RootObj } from './rootObj';

@Component({
  selector: 'my-details',
  templateUrl: 'pages/home.component.html',
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
    user = new User('','','','','');
    errorMsg = null;
    signupEvent = false;
        
    constructor(
        private router: Router,
        private homeService: HomeService,
        private sharedService : SharedService
    ) { }
    
    ngOnInit(): void {
        if(this.sharedService.getRootObj() && this.sharedService.getRootObj().authenticated == true){
            this.router.navigate(['dashboard']);
        }
    }
    
    onSubmit(): void {
        if(this.signupEvent){
            if(this.user.password == this.user.confirmpassword){
                this.homeService.signup(this.user)
                .then(res => this.signupHandler(res));
            }else{
                this.errorMsg = 'Password and re-entered password didnt match';
                this.user.password = '';
                this.user.confirmpassword = '';
            }
        }else{
            this.homeService.login(this.user)
                .then(res => this.authHandler(res));
        }
    }
    
    private authHandler(res){
        if(res.state == 'success'){
            this.homeService.storeUser(res.user);
            var rootObj = new RootObj(true);
            this.sharedService.setRootObj(rootObj);
            this.router.navigate(['/dashboard']);
        }else{
            this.errorMsg = res.message;
        }
    }
    
    private signupHandler(res){
        if(res.state == 'success'){
            this.homeService.storeUser(res.user);
            var rootObj = new RootObj(true);
            this.sharedService.setRootObj(rootObj);
            this.router.navigate(['/dashboard']);
        }else{
            this.errorMsg = 'Username already taken';
        }
    }
    
    signup(): void {
        this.errorMsg = null;
        this.signupEvent = true;
        this.user = new User('','','','','');
    }
    
    signin(): void {
        this.errorMsg = null;
        this.signupEvent = false;
        this.user = new User('','','','','');
    }
}