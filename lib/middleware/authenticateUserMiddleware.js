const express = require("express");
const SessionRepo = require("../repos/SessionRepo");
const AuthManager = require("../managers/AuthManager");
const constants = require("../constants");
const UserModel = require("../models/UserModel");

/** @type {AuthManager} */
let _authManager;

/**
 * middleware for checking authentication token 
 * and setting logged in user (req.user) if one was found 
 * and successfully decoded and verified
 * 
 * @param {express.Request} req express request object
 * @param {express.Response} res express request object
 * @param {Function} next express next function
 * 
 * @return {Promise<Function>} next
 */
async function authenticateUser(req, res, next) {
    // @ts-ignore
    const jwtToken = req.headers[constants.AUTHENTICATION_TOKEN_NAME.toLowerCase()].replace("Bearer ", "");

    if (!jwtToken)
        badRequest(res);
    else {
        try {
            const decodedJwtToken = _authManager.decodeJwtToken(jwtToken);
            const sessionId = decodedJwtToken.sessionId;
            const expirationDate = new Date(decodedJwtToken.exp * 1000);

            /** @type {UserModel.ViewModel} */
            const user = decodedJwtToken.user;

            if (expirationDate <= new Date())
                unAuth(res);
            else {
                if (!_authManager.validateSession(user.id, sessionId))
                    unAuth(res);
                else
                    // @ts-ignore
                    req.user = user;
            }
        } catch (err) {
            console.error("error", err);
            unAuth(res);
        }
    }

    return next();
}

/**
 * Sends a bad request response
 * 
 * @param {express.Response} res
 * 
 * @return {Void}
 */
function badRequest(res) {
    res.status(400);
    res.end();
}

/**
 * Sends an unauthorized response
 * 
 * @param {express.Response} res
 * 
 * @return {Void}
 */
function unAuth(res) {
    res.status(401);
    res.end();
}

/**
 * @param {AuthManager} authManager auth manager
 * 
 * @return {express.RequestHandler} middleware function
 */
module.exports = (authManager) => {
    _authManager = authManager;

    return authenticateUser;
};