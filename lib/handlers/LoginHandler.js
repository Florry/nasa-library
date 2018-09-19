const express = require("express");
const constants = require("../constants");
const UserRepo = require("../repos/UserRepo");
const AuthManager = require("../managers/AuthManager");

/**
 * Handler for logging in.
 */
class LoginHandler {

    /**
     * @param {UserRepo} userRepo repo where users are stored
     * @param {AuthManager} authManager auth manager
     */
    constructor(userRepo, authManager) {
        this._userRepo = userRepo;
        this._authManager = authManager;
    }

    /**
     * Handles http request
     * 
     * @param {express.Request} req express request object
     * @param {express.Response} res express response object
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