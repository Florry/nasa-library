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
     */
    async handle(req, res) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const authToken = await this._authManager.login(username, password);

            res.setHeader(constants.AUTHENTICATION_TOKEN_NAME, authToken);

            res.json({ ok: authToken }); // TODO: change what is being returned.
        } catch (err) {
            // TODO: Handle this
            res.status(401);
            res.json(err);

            throw err;
        }
    }

}

module.exports = LoginHandler;