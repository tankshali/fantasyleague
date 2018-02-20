"use strict";
var Score = (function () {
    function Score(playerid, fixtureid, date, runs, battingscore, wickets, bowlingscore, catches, runouts, fieldingscore, mom, totalscore) {
        this.playerid = playerid;
        this.fixtureid = fixtureid;
        this.date = date;
        this.runs = runs;
        this.battingscore = battingscore;
        this.wickets = wickets;
        this.bowlingscore = bowlingscore;
        this.catches = catches;
        this.runouts = runouts;
        this.fieldingscore = fieldingscore;
        this.mom = mom;
        this.totalscore = totalscore;
    }
    return Score;
}());
exports.Score = Score;
//# sourceMappingURL=score.js.map