const AuthManager = require("../managers/AuthManager");
const express = require("express");
const constants = require("../constants");

/**
 * Handler for logging out
 */
class LogoutHandler {

    /**
     * @param {AuthManager} authManager auth manager
     */
    constructor(authManager) {
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
            // @ts-ignore
            await this._authManager.logout(req.user.id);
            req.headers[constants.AUTHENTICATION_TOKEN_NAME_OUT.toLowerCase()] = "";

            res.end();
        } catch (err) {
            res.status(401);
            res.json(err);
            console.error("LogoutHandler:", err);
        }
    }

}

module.exports = LogoutHandler;