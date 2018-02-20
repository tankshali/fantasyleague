"use strict";
var User = (function () {
    function User(username, password, firstname, lastname, confirmpassword) {
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.confirmpassword = confirmpassword;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map