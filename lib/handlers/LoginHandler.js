const express = require("express");
const constants = require("../constants");
const UserRepo = require("../repos/UserRepo");
const AuthManager = require("../managers/AuthManager");

class LoginHandler {

    /**
     * @param {UserRepo} userRepo 
     * @param {AuthManager} authManager 
     */
    constructor(userRepo, authManager) {
        this._userRepo = userRepo;
        this._authManager = authManager;
    }

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     * 
     * @return {Promise<Void>}
     */
    async handle(req, res) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const authToken = await this._authManager.login(username, password);
            const user = await this._userRepo.getByUsername(username);

            res.setHeader(constants.AUTHENTICATION_TOKEN_NAME_OUT, authToken);

            res.json(user.toViewModel());
        } catch (err) {
            res.status(401);
            res.json(err);
            console.error("LoginHandler:", err);
        }
    }

}

module.exports = LoginHandler;