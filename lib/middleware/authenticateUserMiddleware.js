const express = require("express");
const SessionRepo = require("../repos/SessionRepo");
const AuthManager = require("../managers/AuthManager");
const constants = require("../constants");
const UserModel = require("../models/UserModel");

/** @type {SessionRepo} */
let _sessionRepo;
/** @type {AuthManager} */
let _authManager;

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {Function} next 
 * 
 * @return {Promise<Function>} next
 */
async function authenticateUser(req, res, next) {
    const jwtToken = req.headers[constants.AUTHENTICATION_TOKEN_NAME.toLowerCase()];

    if (!jwtToken)
        badRequest(res);
    else {
        const decodedJwtToken = _authManager.decodeJwtToken(jwtToken);
        const sessionId = decodedJwtToken.sessionId;
        const expirationDate = new Date(decodedJwtToken.exp * 1000);

        /** @type {UserModel.ViewModel} */
        const user = decodedJwtToken.user;

        if (expirationDate <= new Date())
            badRequest(res);
        else {
            const session = await _sessionRepo.getSessionByUserId(user.id);

            if (session.sessionId !== sessionId)
                badRequest(res);
            else {
                // @ts-ignore
                req.user = user;

                const newJWTToken = await _authManager.generateNewSession(user);

                res.setHeader(constants.AUTHENTICATION_TOKEN_NAME, newJWTToken);
            }
        }
    }

    return next();
}

/**
 * @param {express.Response} res
 * 
 * @return {Void}
 */
function badRequest(res) {
    // TODO: define what this should do
    res.status(400);
    res.end();
}

/**
 * @param {SessionRepo} sessionRepo 
 * @param {AuthManager} authManager 
 * 
 * @return {express.RequestHandler}
 */
module.exports = (sessionRepo, authManager) => {
    _sessionRepo = sessionRepo;
    _authManager = authManager;

    return authenticateUser;
};