import { Component, OnInit } from '@angular/core';
import { HomeService }  from './home.service';
import { TeamSelectionService }  from './teamselection.service';

import { Fixure }  from './fixure';
import { Player }  from './player';

@Component({
  selector: 'teamselection',
  templateUrl: 'pages/teamselection.component.html',
  providers: [TeamSelectionService]
})

export class TeamSelectionComponent implements OnInit {
    errorMsg = null;
    successMsg = null;
    fixureList : Fixure[];
    playerList : Player[];
    selectedPlayerList : Player[];
    validationObj = {
        numOfPlayers : 11,
        maxForeignPlayers : 4,
        minWicketKeeper : 1,
        minBowlers : 5,
        budget : 45.00
    };
    actualObj = {
        numOfPlayers : 0,
        foreignPlayers : 0,
        numOfWicketKeeper : 0,
        numOfBowlers : 0,
        budget : 0.00
    };
    selectedCaptainId : Number;
    
    constructor(
        private homeService: HomeService,
        private teamSelectionService: TeamSelectionService
    ) { }
    
    ngOnInit(): void {
        window.scrollTo(0,0);
        this.teamSelectionService.getFixureData()
            .then(res => this.fixureDataHandler(res));
    }
    
    private fixureDataHandler(res){
        if(res.state == 'success'){
            this.fixureList = res.payload;
            if(this.fixureList && this.fixureList[0]){
                let team1 = this.fixureList[0].team1;
                let team2 = this.fixureList[0].team2;
                
                if(this.fixureList.length == 2 && this.fixureList[1]){
                    let team3 = this.fixureList[1].team1;
                    let team4 = this.fixureList[1].team2;
                    
                    this.teamSelectionService.getTeamSelectionData(team1, team2, team3, team4)
                        .then(res => this.teamSelectionDataHandler(res));
                }else{
                    this.teamSelectionService.getTeamSelectionData(team1, team2, 'null', 'null')
                        .then(res => this.teamSelectionDataHandler(res));
                }
            }
        }
    }
    
    private teamSelectionDataHandler(res){
        if(res.state == 'success'){
            this.playerList = res.payload.playersList;
            this.selectedPlayerList = res.payload.selectedPlayersList;
            this.setActualObjForValidation(this.selectedPlayerList);
        }
    }
    
    private setActualObjForValidation(selectedPlayerList) {
        this.actualObj.numOfPlayers = selectedPlayerList.length;
        for(let player of selectedPlayerList){
            if(player.type == 'Foreign'){
                this.actualObj.foreignPlayers = this.actualObj.foreignPlayers + 1;
            }
            if(player.role == 'Wicket Keeper'){
                this.actualObj.numOfWicketKeeper = this.actualObj.numOfWicketKeeper + 1;
            }
            if(player.role == 'Bowler' || player.role == 'All-rounder'){
                this.actualObj.numOfBowlers = this.actualObj.numOfBowlers + 1;
            }
            this.actualObj.budget = this.actualObj.budget + player.price;
            this.actualObj.budget = Math.round(this.actualObj.budget * 100) / 100;
            
            if(player.captain == 1){
                this.selectedCaptainId = player.playerid;
            }
        }
    }
    
    addToTeam(playerid) : void {
        let loopIndex = 0;
        for(let player of this.playerList){
            if(player.playerid == playerid){
                console.log('username - '+this.homeService.fetchUser().username);
                player.username = this.homeService.fetchUser().username;
                console.log('date - '+this.fixureList[0].date);
                player.date = this.fixureList[0].date;
                this.selectedPlayerList.push(player);
                this.playerList.splice(loopIndex, 1);
                
                this.actualObj.numOfPlayers =  this.actualObj.numOfPlayers + 1;
                if(player.type == 'Foreign'){
                    this.actualObj.foreignPlayers = this.actualObj.foreignPlayers + 1;
                }
                if(player.role == 'Wicket Keeper'){
                    this.actualObj.numOfWicketKeeper = this.actualObj.numOfWicketKeeper + 1;
                }
                if(player.role == 'Bowler' || player.role == 'All-rounder'){
                    this.actualObj.numOfBowlers = this.actualObj.numOfBowlers + 1;
                }
                this.actualObj.budget = this.actualObj.budget + player.price;
                this.actualObj.budget = Math.round(this.actualObj.budget * 100) / 100;
                
                break;
            }
            loopIndex++;
        }
    }
    
    removeFromTeam(playerid) : void {
        let loopIndex = 0;
        for(let player of this.selectedPlayerList){
            if(player.playerid == playerid){
                this.playerList.push(player);
                this.selectedPlayerList.splice(loopIndex, 1);
                
                this.actualObj.numOfPlayers =  this.actualObj.numOfPlayers - 1;
                if(player.type == 'Foreign'){
                    this.actualObj.foreignPlayers = this.actualObj.foreignPlayers - 1;
                }
                if(player.role == 'Wicket Keeper'){
                    this.actualObj.numOfWicketKeeper = this.actualObj.numOfWicketKeeper - 1;
                }
                if(player.role == 'Bowler' || player.role == 'All-rounder'){
                    this.actualObj.numOfBowlers = this.actualObj.numOfBowlers - 1;
                }
                this.actualObj.budget = this.actualObj.budget - player.price;
                this.actualObj.budget = Math.round(this.actualObj.budget * 100) / 100;  
                
                break;
            }
            loopIndex++;
        }
    }
    
    submitTeam() : void {
        this.errorMsg = null;
        this.successMsg = null;
        if(this.validationObj.numOfPlayers != this.actualObj.numOfPlayers){
            this.errorMsg = 'Team combination does not comply with fantasy league rules. Please make necessary changes in your team';
        }else if(this.actualObj.foreignPlayers > this.validationObj.maxForeignPlayers){
            this.errorMsg = 'Team combination does not comply with fantasy league rules. Please make necessary changes in your team';
        }else if(this.actualObj.numOfWicketKeeper < this.validationObj.minWicketKeeper){
            this.errorMsg = 'Team combination does not comply with fantasy league rules. Please make necessary changes in your team';
        }else if(this.actualObj.numOfBowlers < this.validationObj.minBowlers){
            this.errorMsg = 'Team combination does not comply with fantasy league rules. Please make necessary changes in your team';
        }else if(this.actualObj.budget > this.validationObj.budget){
            this.errorMsg = 'Your budget exausted. Please make necessary changes in your team';
        }else if(!this.selectedCaptainId){
            this.errorMsg = 'Please select a captain for your team';
        }else{
            console.log('selectedCaptainId - '+this.selectedCaptainId);
            let loopIndex = 0;
            for(let player of this.selectedPlayerList){
                if(player.playerid == this.selectedCaptainId){
                    player.captain = 1;
                }else{
                    player.captain = 0;
                }
                this.selectedPlayerList[loopIndex] = player;
                loopIndex++;
            }
            this.teamSelectionService.saveTeam(this.selectedPlayerList)
                .then(res => this.saveTeamResponseHandler(res))
        }
    }
    
    private saveTeamResponseHandler(res){
        if(res.state == 'success'){
            this.successMsg = 'Your team saved successfully';
        }else{
            this.errorMsg = res.message;
        }
    }
}