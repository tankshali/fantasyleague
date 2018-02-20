"use strict";
var Player = (function () {
    function Player(username, date, playerid, name, price, team, role, type, captain) {
        this.username = username;
        this.date = date;
        this.playerid = playerid;
        this.name = name;
        this.price = price;
        this.team = team;
        this.role = role;
        this.type = type;
        this.captain = captain;
    }
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map