var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');   
var Fixure = mongoose.model('Fixure');
var User = mongoose.model('User');
var League = mongoose.model('League');
var Player = mongoose.model('Player');
var Team = mongoose.model('Team');
var TeamArchive = mongoose.model('TeamArchive');
var Result = mongoose.model('Result');
var ResultArchive = mongoose.model('ResultArchive');
var pointSystem = {
    run: 5,
    wicket: 50,
    catches: 50,
    runout: 50,
    battingmilestone1: 30,
    battingmilestone2: 50,
    battingbonus: 50,
    bowlingmilestone1: 3,
    bowlingmilestone2: 5,
    bowlingbonus: 50,
    mom: 200,
    captainMultiplier: 2
};

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('');
};

function isAdmin (req, res, next) {
    if (req.isAuthenticated() && req.user.username == 'sharvil'){
		return next();
	}
    return res.redirect('');
};

//Register the authentication middleware
router.use('/getFixureData', isAuthenticated);
router.use('/getTeamSelectionData', isAuthenticated);
router.use('/saveTeam', isAuthenticated);
router.use('/getDashboardData', isAuthenticated);
router.use('/getUserRanks', isAuthenticated);
router.use('/getTeamOwners', isAuthenticated);
router.use('/getDateList', isAuthenticated);
router.use('/getTeam', isAuthenticated);
router.use('/nextMatches', isAdmin);
router.use('/calculateScores', isAdmin);
router.use('/updateUserScores', isAdmin);
router.use('/getPlayersForCurrentMatch', isAdmin);
router.use('/submitScore', isAdmin);

router.route('/getFixureData')
    .get(function(req, res){
		console.log('Express API - getFixureData');
		Fixure.find({ 'state' : 1 },
            function(err, fixures) {
                if(err){
                    res.send({state: 'failure', payload: null, message: 'Error occured while fetching fixures data'});
                }else if(!fixures){
                    console.log('Fixures data not found');
                    res.send({state: 'failure', payload: null, message: 'Fixures data not found'});
                }else{
                    console.log(fixures);
                    res.send({state: 'success', payload: fixures});
                }
            }
        );
	});

router.route('/getTeamSelectionData/:team1/:team2/:team3/:team4')
    .get(function(req, res){
		console.log('Express API - getFixureData');
        console.log('team1 - '+req.params.team1);
        console.log('team2 - '+req.params.team2);
        console.log('team3 - '+req.params.team3);
        console.log('team4 - '+req.params.team4);
        
        var teamArr = [req.params.team1, req.params.team2];
    
        if(req.params.team3 != 'null'){
            teamArr.push(req.params.team3);
        }
        if(req.params.team4 != 'null'){
            teamArr.push(req.params.team4);
        }
    
        console.log('teamArr - '+teamArr);

        Team.find({ 'username' : req.user.username},
            function(err, teams) {
                if(err){
                    res.send({state: 'failure', payload: null, message: 'Error occured while fetching selected players data'});
                }else if(!teams){
                    res.send({state: 'failure', payload: null, message: 'Selected players data not found'});
                }else{
                    console.log('selected players length - '+teams.length);
                    var playerIdArray = [];
                    
                    teams.forEach(function(valueObj){
                        playerIdArray.push(valueObj.playerid);
                    });
                    console.log('playerid array - '+playerIdArray);
                    Player.find({$and: [
                                        {'playerid' : {$nin : playerIdArray } },
                                        {'team' : {$in : teamArr } } 
                                       ] },
                        function(err, players) {
                            if(err){
                                res.send({state: 'failure', payload: null, message: 'Error occured while fetching players data'});
                            }else if(!players){
                                res.send({state: 'failure', payload: null, message: 'Players data not found'});
                            }else{
                                console.log('players length - '+players.length);
                                res.send({state: 'success', payload: {"playersList" : players , "selectedPlayersList" : teams } });
                            }
                        }
                    ).select({  "_id" : 0,
                                "playerid" : 1,
                                "name" : 1,
                                "price" : 1,
                                "team" : 1,
                                "role" : 1,
                                "type" : 1 }).sort({team: 1});
                }
            }     
        ).select({  "playerid" : 1,
                    "name" : 1,
                    "price" : 1,
                    "team" : 1,
                    "role" : 1,
                    "type" : 1,
                    "username" : 1,
                    "date" : 1,
                    "captain" : 1,
                    "_id": 0});  
    });

router.route('/saveTeam')
    .post(function(req, res){
		console.log('Express API - saveTeam');
        console.log(req.body.selectedPlayerList);
    
        if(req.body.selectedPlayerList && req.body.selectedPlayerList[0]){    
            var username = req.body.selectedPlayerList[0].username;
            var date = req.body.selectedPlayerList[0].date;
            
            Fixure.find({ 'date' : date , 'state' : 1},
                function(err, fixures){
                    if(err){
                        res.send({state: 'failure', payload: null, message: 'Error occured while saving your team'});
                    }else if((!fixures) || (fixures.length == 0)) {
                        res.send({state: 'failure', payload: null, message: 'Sorry, As per rules, Team selection window closed for today'});
                    }else{
                        Team.find({ 'username' : username , 'date' : date}).remove(
                            function(err, deletedCount){
                                if(err){
                                    res.send({state: 'failure', payload: null, message: 'Error occured while modifying your team selection'});
                                }else{
                                    console.log('deleted rows count - '+deletedCount);
                                    Team.collection.insert(req.body.selectedPlayerList, 
                                        function(err, teamArr){
                                            if(err){
                                                res.send({state: 'failure', payload: null, message: 'Error occured while saving team'});
                                            }else{
                                                TeamArchive.find({ 'username' : username , 'date' : date}).remove(
                                                    function(err, deletedArchiveCount){
                                                        if(err){
                                                            res.send({state: 'failure', payload: null, message: 'Error occured while modifying your team selection in Archive collection'});
                                                        }else{
                                                            TeamArchive.collection.insert(req.body.selectedPlayerList, 
                                                                function(err, teamArchiveArr){
                                                                    if(err){
                                                                        res.send({state: 'failure', payload: null, message: 'Error occured while saving team in archive collection'});
                                                                    }else{
                                                                        res.send({state: 'success', payload: {}});
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                );
                                            }
                                        }        
                                    );
                                }
                            }
                        );
                    }
                });
        }else{
            res.send({state: 'failure', payload: null, message: 'Team must consists of 11 players. Please complete your team'});
        }
	});

router.route('/getDashboardData')
    .get(function(req, res){
        console.log('Express API - getDashboardData');
        User.findOne({ 'username' : req.user.username },
            function(err, user){
                if(err){
                    res.send({state: 'failure', payload:'Error occured while fetching user'});
                }else{
                    var resUserObj = {
                        'lastscore': user.lastscore,
                        'totalscore' : user.totalscore
                    }
                    
                    var resObj = { 'userStats' : resUserObj , 'leagueData' : [] };
                    
                    var leagueList = [];
                    if(user.leagues.length > 0){
                        var leagueCounter = 0;
                        user.leagues.forEach(function(leagueid){
                            League.find({ leagueid : leagueid },
                                function(err, leagues){
                                    leagueCounter++;
                                    if(err){
                                        res.send({state: 'failure', payload:'Error occured while fetching leagues data'});
                                    }else{
                                        var membersSortedPerLastScore = [];
                                        var membersSortedPerTotalScore = [];
                                        var leaguename;
                                        leagues.forEach(function(leagueObj){
                                            var leagueMemberObj = {};
                                            leagueMemberObj.firstname = leagueObj.firstname;
                                            leagueMemberObj.lastname = leagueObj.lastname;
                                            leagueMemberObj.lastscore = leagueObj.lastscore;
                                            leagueMemberObj.totalscore = leagueObj.totalscore;
                                            leaguename = leagueObj.name;
                                            membersSortedPerLastScore.push(leagueMemberObj);
                                            membersSortedPerTotalScore.push(leagueMemberObj);
                                        });
                                        
                                        var leagueObj = {};
                                        leagueObj.name = leaguename;
                                        leagueObj.membersSortedPerLastScore = membersSortedPerLastScore;
                                        leagueObj.membersSortedPerTotalScore = membersSortedPerTotalScore;
                                        
                                        leagueObj.membersSortedPerLastScore.sort(function(a, b) {
                                           return b.lastscore - a.lastscore;    
                                        });
                                        leagueObj.membersSortedPerTotalScore.sort(function(a, b) {
                                           return b.totalscore - a.totalscore;    
                                        });
                                        console.log(leagueObj);
                                        leagueList.push(leagueObj);
                                        if(leagueCounter == user.leagues.length){
                                            resObj.leagueData = leagueList;
                                            res.send({state: 'success', payload: resObj });
                                        }
                                    }
                                });
                        });
                    }else{
                        res.send({state: 'success', payload: resObj });
                    }
                }
            }).select({ "leagues": 1, "lastscore" : 1, "totalscore": 1, "_id": 0});
    });

router.route('/getUserRanks')
    .get(function(req, res){
        console.log('Express API - getUserRanks');
        User.find({},
            function(err, users){
                if(err){
                    res.send({state: 'failure', payload:'Error occured while fetching users'});
                }else{
                    var rankObj = {
                        lastRank: 0,
                        overallRank: 0
                    }
                    
                    var lastScoreObj = JSON.parse(JSON.stringify(users));
                    var totalScoreObj = JSON.parse(JSON.stringify(users));
                    
                    lastScoreObj.sort(function(a, b) {
                       return b.lastscore - a.lastscore;    
                    });
                    totalScoreObj.sort(function(a, b) {
                       return b.totalscore - a.totalscore;    
                    });
                    
                    for(var lastRank = 0; lastRank < lastScoreObj.length; lastRank++){
                        if(lastScoreObj[lastRank].username == req.user.username){
                            break;
                        }
                    }
                    
                    for(var overallRank = 0; overallRank < totalScoreObj.length; overallRank++){
                        if(totalScoreObj[overallRank].username == req.user.username){
                            break;
                        }
                    }
                    rankObj.lastRank = lastRank + 1;
                    rankObj.overallRank = overallRank + 1;
                    res.send({state: 'success', payload: rankObj });
                }
            }).select({ "_id": 0,
                        "username": 1,
                        "lastscore": 1,
                        "totalscore": 1});
    });

router.route('/getPlayersForCurrentMatch')
    .get(function(req, res){
        console.log('Express API - getPlayersForCurrentMatch');
        Fixure.find({ 'state' : -1 },
            function(err, fixures) {
                if(err){
                    res.send({state: 'failure', payload: null, message: 'Error occured while fetching fixures data'});
                }else{
                    var teamObj = [];
                    fixures.forEach(function(fixureObj){
                        teamObj.push(fixureObj.team1);
                        teamObj.push(fixureObj.team2);
                    });
                    Player.find({'team' : {$in : teamObj } },
                        function(err, players) {
                            if(err){
                                res.send({state: 'failure', payload: null, message: 'Error occured while fetching players data'});
                            }else{
                                var resObj = {
                                    fixures : fixures,
                                    players : players
                                }
                                res.send({state: 'success', payload: resObj});
                            }
                        }).select({  "_id" : 0,
                                "playerid" : 1,
                                "name" : 1});
                }
            }).select({ "_id": 0,
                        "team1": 1,
                        "team2": 1,
                        "fixtureid": 1,
                        "date": 1});
    });

router.route('/getTeamOwners')
    .get(function(req, res){
        console.log('Express API - getTeamOwners');
        User.findOne({ 'username' : req.user.username },
            function(err, user){
                if(err){
                    res.send({state: 'failure', payload: null, message: 'Error occured while fetching team owners data'});
                }else{
                    if((!user.leagues) || (user.leagues.length == 0)){
                        res.send({state: 'success', payload: []});
                    }else{
                        League.aggregate([
                                { "$match" : { leagueid : { $in : user.leagues } } },
                                { "$group" : { "_id": { username: "$username", firstname: "$firstname", lastname: "$lastname" } } }
                            ],
                            function(err, leagues){
                                if(err){
                                    res.send({state: 'failure', payload: null, message: 'Error occured while fetching team owners data'});
                                }else{
                                    res.send({state: 'success', payload: leagues});
                                }
                            });
                    }
                }
            });
        
        
    });

router.route('/getDateList')
    .get(function(req, res){
        console.log('Express API - getDateList');
        Fixure.aggregate([
                { "$match" : { 'state' : { $in : [-1, -2] } } },
                { "$group" : { "_id": { date: "$date" }, "fixtureid": {$max: "$fixtureid"} } },
                { "$sort" : { "fixtureid" : -1 } },
                { $limit : 5 }
            ],
            function(err, fixures){
                if(err){
                    res.send({state: 'failure', payload: null, message: 'Error occured while fetching dates list'});
                }else{
                    res.send({state: 'success', payload: fixures});
                }
            });
    });

router.route('/getTeam/:teamowner/:selectedDate')
    .get(function(req, res){
        console.log('Express API - getTeam');
        console.log('teamowner - '+req.params.teamowner);
        console.log('selectedDate - '+req.params.selectedDate);
    
        TeamArchive.find({ 'username' : req.params.teamowner, 'date' : req.params.selectedDate },
            function(err, teamarchives){
                if(err){
                    res.send({state: 'failure', payload: null, message: 'Error occured while fetching team for team owner '+req.params.teamowner});
                }else{
                    res.send({state: 'success', payload: teamarchives});
                }
            });
    });

router.route('/submitScore')
    .post(function(req, res){
        console.log('Express API - submitScore');
        console.log(req.body.scoreobj);
        var scorecard = req.body.scoreobj;
        
        var result = new Result();
        result.date = scorecard.date;
        result.fixureid = scorecard.fixtureid;
        result.playerid = scorecard.playerid;
        result.runs = scorecard.runs;
        result.battingscore = scorecard.battingscore;
        result.wickets = scorecard.wickets;
        result.bowlingscore = scorecard.bowlingscore;
        result.catches = scorecard.catches;
        result.runouts = scorecard.runouts;
        result.fieldingscore = scorecard.fieldingscore;
        result.mom = scorecard.mom;
        result.totalscore = scorecard.totalscore;
    
        result.save(function(err){
           if(err){
                res.send({state: 'failure', message: 'Error occured while inserting into results collection'});
           }else{
                var resultArchive = new ResultArchive();
                resultArchive.date = scorecard.date;
                resultArchive.fixureid = scorecard.fixtureid;
                resultArchive.playerid = scorecard.playerid;
                resultArchive.runs = scorecard.runs;
                resultArchive.battingscore = scorecard.battingscore;
                resultArchive.wickets = scorecard.wickets;
                resultArchive.bowlingscore = scorecard.bowlingscore;
                resultArchive.catches = scorecard.catches;
                resultArchive.runouts = scorecard.runouts;
                resultArchive.fieldingscore = scorecard.fieldingscore;
                resultArchive.mom = scorecard.mom;
                resultArchive.totalscore = scorecard.totalscore;
               
                resultArchive.save(function(err){
                    if(err){
                        res.send({state: 'failure', message: 'Error occured while inserting into results archive collection'});
                    }else{
                        //Update score details into TeamArchive collection
                        TeamArchive.find({ 'playerid' : resultArchive.playerid, 'date' : resultArchive.date },
                            function(err, teamarchives){
                                if(err){
                                    res.send({state: 'failure', payload:'Error occured while finding playerid '+resultArchive.playerid+' TeamArchive collection'});
                                }else if(!(teamarchives && teamarchives.length > 0)){
                                    res.send({state: 'success', payload:'This player was not taken by anyone'});
                                }else{
                                    console.log('teamarchives length - '+teamarchives.length);
                                    var totalCount = teamarchives.length;
                                    var counter = 0;
                                    teamarchives.forEach(function(teamObj){                                        
                                        var updateObj = {
                                            runs : resultArchive.runs,
                                            battingscore : resultArchive.battingscore,
                                            wickets : resultArchive.wickets,
                                            bowlingscore : resultArchive.bowlingscore,
                                            catches : resultArchive.catches,
                                            runouts : resultArchive.runouts,
                                            fieldingscore : resultArchive.fieldingscore,
                                            mom : resultArchive.mom,
                                            totalscore : resultArchive.totalscore + (resultArchive.totalscore * teamObj.captain * (pointSystem.captainMultiplier - 1))
                                        };
                                        console.log('teamObj._id - '+teamObj._id);
                                        TeamArchive.update({ 'playerid' : teamObj.playerid, 'date' : teamObj.date, 'username' : teamObj.username }, updateObj, { 'multi' : true},
                                            function(err, updateCount){
                                                counter++;
                                                if(err){
                                                    res.send({state: 'failure', payload:'Error occured while updating score in TeamArchive collection for id '+teamObj._id});
                                                }else{
                                                    console.log('updateCount - '+updateCount);
                                                    if(counter == totalCount){
                                                        Result.remove(
                                                        function(err, removedCount){
                                                            if(err){
                                                                res.send({state: 'failure', payload:'Error occured while removing document from Results collection'});
                                                            }else{
                                                                res.send({state: 'success', payload: 'Scores calculated successfully'});
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                    });
                                }
                            });
                    }
                });
           }
        });
        /*Result.collection.insert(req.body.scorecard,
            function(err, arr){
                if(err){
                    res.send({state: 'failure', message: 'Error occured while bulk inserting documents into results collection'});
                }else{
                    ResultArchive.collection.insert(req.body.scorecard,
                        function(err, arr){
                            if(err){
                                res.send({state: 'failure', message: 'Error occured while bulk inserting documents into results archive collection'});
                            }else{
                                res.send({state: 'success', payload: 'Scorecard saved successfully'});
                            }
                        });
                }
            });*/
    });

router.route('/nextMatches/:date')
    .get(function(req, res){
        console.log('Express API - nextMatches');
        console.log('date - '+req.params.date);
        
        Fixure.update({ 'state' : -1 }, { 'state' : -2 }, { multi: true },
            function(err, resetDataQueryRes){
                if(err){
                    res.send({state: 'failure', payload:'Error occured while reseting data for previous matches'});
                }else{
                    console.log('resetDataQueryRes - '+resetDataQueryRes);
                    //Set state to -1 for today's matches
                    Fixure.update({ 'state' : 1 }, { 'state' : -1 }, { multi: true },
                        function(err, closMatchQueryRes){
                            if(err){
                                res.send({state: 'failure', payload:'Error occured while closing matches for today'});
                            }else{
                                console.log('closMatchQueryRes - '+closMatchQueryRes);
                                //Set state to 1 for next matches
                                Fixure.update({ 'date' : req.params.date }, { 'state' : 1 }, { multi: true },
                                    function(err, openMatchQueryRes){
                                        if(err){
                                            res.send({state: 'failure', payload:'Error occured while opening next matches'});
                                        }else{
                                            console.log('openMatchQueryRes - '+openMatchQueryRes);
                                            
                                            Team.remove(function(err, removedCount){
                                                if(err){
                                                    res.send({state: 'failure', payload:'Error occured while removing all documents from Team collection'});
                                                }else{
                                                    res.send({state: 'success', payload: 'Matches for '+req.params.date+' opened successfully'});
                                                }
                                            });
                                        }
                                    }
                                );
                            }                
                        }
                    );
                }
            }
        );    
    });

router.route('/calculateScores')
    .get(function(req, res){
        console.log('Express API - calculateScores');
        //Update total score for all players found in results collection
        Result.find({},
            function(err, results) {
                if(err){
                    res.send({state: 'failure', payload: 'Error occured while fetching documents from results collection'});
                }else if(!results){
                    res.send({state: 'failure', payload: 'No documents found in results collection'});
                }else{
                    console.log('results collection length - '+results.length);
                    /*var resultArr = [];*/
                    results.forEach(function(resultObj){
                        /*var obj = {};
                        
                        obj.resultid = resultObj.resultid;
                        obj.date = resultObj.date;
                        obj.fixureID = resultObj.fixureID;
                        obj.playerid = resultObj.playerid;
                        obj.runs = resultObj.runs;
                        obj.battingscore = resultObj.battingscore;
                        obj.wickets = resultObj.wickets;
                        obj.bowlingscore = resultObj.bowlingscore;
                        obj.catches = resultObj.catches;
                        obj.runouts = resultObj.runouts;
                        obj.fieldingscore = resultObj.fieldingscore;
                        obj.mom = resultObj.mom;
                        obj.totalscore = resultObj.totalscore;
                        
                        resultArr.push(obj);*/
                        
                        //Update score details into TeamArchive collection
                        TeamArchive.find({ 'playerid' : resultObj.playerid, 'date' : resultObj.date },
                            function(err, teamarchives){
                                if(err){
                                    res.send({state: 'failure', payload:'Error occured while finding playerid '+resultObj.playerid+' TeamArchive collection'});
                                }else{
                                    console.log('teamarchives length - '+teamarchives.length);
                                    teamarchives.forEach(function(teamObj){                                        
                                        var updateObj = {
                                            runs : resultObj.runs,
                                            battingscore : resultObj.battingscore,
                                            wickets : resultObj.wickets,
                                            bowlingscore : resultObj.bowlingscore,
                                            catches : resultObj.catches,
                                            runouts : resultObj.runouts,
                                            fieldingscore : resultObj.fieldingscore,
                                            mom : resultObj.mom,
                                            totalscore : resultObj.totalscore + (resultObj.totalscore * teamObj.captain * (pointSystem.captainMultiplier - 1))
                                        };
                                        console.log('teamObj._id - '+teamObj._id);
                                        TeamArchive.update({ '_id' : teamObj._id }, updateObj, {},
                                            function(err, updateCount){
                                                if(err){
                                                    res.send({state: 'failure', payload:'Error occured while updating score in TeamArchive collection for id '+teamObj._id});
                                                }else{
                                                    console.log('updateCount - '+updateCount);
                                                }
                                            });
                                    });
                                }
                            });
                    });
                    
                    Result.remove(
                        function(err, removedCount){
                            if(err){
                                res.send({state: 'failure', payload:'Error occured while removing all documents from Results collection'});
                            }else{
                                res.send({state: 'success', payload: 'Scores calculated successfully'});
                            }
                        });
                }
            }
        );        
    });

router.route('/updateUserScores/:date')
    .get(function(req, res){
        console.log('Express API - updateUserScores');
        User.find({},
            function(err, users){
                if(err){
                    res.send({state: 'failure', message: 'Error occured while finding users'});
                }else if(!users || users.length == 0){
                    res.send({state: 'failure', message: 'No users foound'});
                }else{
                    var totalcount = users.length;
                    var usercounter = 0;
                    users.forEach(function(userObj){
                        TeamArchive.find({ 'username' : userObj.username, 'date' : req.params.date },
                            function(err, teamarchives){
                                if(err){
                                    res.send({state: 'failure', message: 'Error occured while fetching team for user '+userObj.username});
                                }else{
                                    var totalScore = 0;
                                    teamarchives.forEach(function(scoreObj){
                                        if(scoreObj.totalscore){
                                           totalScore = totalScore + scoreObj.totalscore;
                                        }
                                    });
                                    
                                    var updateObj = { 
                                        lastscore : totalScore, 
                                        $inc: { totalscore : totalScore }
                                    };
                                    
                                    User.update({ 'username' : userObj.username }, updateObj, {},
                                        function(err, updateCount){
                                            if(err){
                                                console.log(err);
                                            }else{
                                                console.log('updateCount - '+updateCount);
                                                League.find({ 'username' : userObj.username  }, 
                                                    function(err, leagues){
                                                        if(err){
                                                            res.send({state: 'failure', message: 'Error occured while fetching league data'}); 
                                                        }else{
                                                            console.log('leagues length - '+leagues.length);
                                                            var leagueTotalCount = leagues.length;
                                                            var leaguecounter = 0;
                                                            if(leagueTotalCount == leaguecounter){
                                                                usercounter++;
                                                                if(totalcount == usercounter){
                                                                    res.send({state: 'success', payload: 'User scores updated successfully'});
                                                                }
                                                            }else{
                                                                leagues.forEach(function(leagueObj){
                                                                    League.update({ 'leagueid' : leagueObj.leagueid, 'username' : userObj.username }, updateObj, {},
                                                                        function(err, leagueUpdateCount){
                                                                            usercounter++;
                                                                            leaguecounter++;
                                                                            if(err){
                                                                                console.log(err);
                                                                                res.send({state: 'failure', message: 'Error occured while fetching league data '+err});
                                                                            }else{
                                                                                console.log('leagueUpdateCount - '+leagueUpdateCount);
                                                                                if((totalcount == usercounter) && (leagueTotalCount == leaguecounter)){
                                                                                   res.send({state: 'success', payload: 'User scores updated successfully'});
                                                                                }
                                                                            }
                                                                        });
                                                                });
                                                            }
                                                        }
                                                    }).select({ "leagueid": 1, "_id": 0});
                                            }
                                        });
                                }
                            }).select({ "totalscore": 1, "_id": 0});
                    });
                }
            });
    });

module.exports = router;