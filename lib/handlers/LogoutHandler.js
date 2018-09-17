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

            res.json({ ok: 1 }); // TODO: fix return data
        } catch (err) {
            // TODO: Handle this
            res.status(401);
            res.json(err);

            throw err;
        }
    }

}

module.exports = LogoutHandler;