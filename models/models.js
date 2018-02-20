var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	username: String,
	password: String, //hash created from password
    firstname: String,
    lastname: String,
    lastscore: Number,
    totalscore: Number,
	created_at: {type: Date, default: Date.now},
    leagues: [Number]
});

var leagueSchema = new mongoose.Schema({
    leagueid: Number,
    name: String,
    username: String,
    firstname: String,
    lastname: String,
    lastscore: Number,
    totalscore: Number
});

var fixureSchema = new mongoose.Schema({
    fixtureid: Number,
    team1: String,
    team2: String,
    state: Number,
    date: String,
    foreignPlayerConcept: Boolean
});

var playerSchema = new mongoose.Schema({
    playerid: Number,
    name: String,
    price: Number,
    team: String,
    role: String,
    type: String
});

var teamSchema = new mongoose.Schema({
    username: String,
    date: String,
    playerid: Number,
    name: String,
    price: Number,
    team: String,
    role: String,
    type: String,
    captain: Number
});

var teamArchiveSchema = new mongoose.Schema({
    _id: String,
    username: String,
    date: String,
    playerid: Number,
    name: String,
    price: Number,
    team: String,
    role: String,
    type: String,
    captain: Number,
    runs: Number,
    battingscore: Number,
    wickets: Number,
    bowlingscore: Number,
    catches: Number,
    runouts: Number,
    fieldingscore: Number,
    mom: Number,
    totalscore: Number
});

var resultSchema = new mongoose.Schema({
    date: String,
    fixureid: Number,
    playerid: Number,
    runs: Number,
    battingscore: Number,
    wickets: Number,
    bowlingscore: Number,
    catches: Number,
    runouts: Number,
    fieldingscore: Number,
    mom: Number,
    totalscore: Number
});

var resultArchiveSchema = new mongoose.Schema({
    date: String,
    fixureid: Number,
    playerid: Number,
    runs: Number,
    battingscore: Number,
    wickets: Number,
    bowlingscore: Number,
    catches: Number,
    runouts: Number,
    fieldingscore: Number,
    mom: Number,
    totalscore: Number
});

mongoose.model('User', userSchema);
mongoose.model('League', leagueSchema);
mongoose.model('Fixure', fixureSchema);
mongoose.model('Player', playerSchema);
mongoose.model('Team', teamSchema);
mongoose.model('TeamArchive', teamArchiveSchema);
mongoose.model('Result', resultSchema);
mongoose.model('ResultArchive', resultArchiveSchema);
