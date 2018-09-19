const AuthManager = require("../managers/AuthManager");
const express = require("express");

class LogoutHandler {

    /**
     * @param {AuthManager} authManager 
     */
    constructor(authManager) {
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
            // @ts-ignore
            await this._authManager.logout(req.user.id);
            res.end();
        } catch (err) {
            res.status(401);
            res.json(err);
            console.error("LogoutHandler:", err);
        }
    }

}

module.exports = LogoutHandler;