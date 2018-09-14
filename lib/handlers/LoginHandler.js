const UserRepo = require("../repos/UserRepo");
const PasswordManager = require("../managers/PasswordManager");

class LoginHandler {

    /**
     * @param {UserRepo} userRepo 
     * @param {PasswordManager} passwordManager
     */
    constructor(userRepo, passwordManager) {
        this._userRepo = userRepo;
        this._passwordManager = passwordManager;
    }

}

module.exports = LoginHandler;