const express = require("express");
const UserRepo = require("../repos/UserRepo");
const SessionRepo = require("../repos/SessionRepo");
const AuthManager = require("../managers/AuthManager");
const constants = require("../constants");

/** @type {SessionRepo} */
let _sessionRepo;
/** @type {UserRepo} */
let _userRepo;
/** @type {AuthManager} */
let _authManager;

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {Function} next 
 */
async function authenticateUser(req, res, next) {
    const jwtToken = req.headers[constants.AUTHENTICATION_TOKEN_NAME.toLowerCase()];

    if (!jwtToken)
        badRequest(res);
    else {
        const decodedJwtToken = _authManager.decodeJwtToken(jwtToken);
        const userId = decodedJwtToken.userId;
        const sessionId = decodedJwtToken.sessionId;
        const expirationDate = new Date(decodedJwtToken.exp * 1000);

        if (expirationDate <= new Date())
            badRequest(res);
        else {
            const session = await _sessionRepo.getSessionByUserId(userId);

            if (session.sessionId !== sessionId)
                badRequest(res);
            else {
                const user = await _userRepo.getByUserId(userId);
                // @ts-ignore
                req.user = user;

                const newJWTToken = await _authManager.generateNewSession(userId);

                res.setHeader(constants.AUTHENTICATION_TOKEN_NAME, newJWTToken);
            }
        }
    }

    return next();
}

/**
 * @param {express.Response} res
 */
function badRequest(res) {
    // TODO: define what this should do
    res.status(400);
    res.end();
}

/**
 * @param {SessionRepo} sessionRepo 
 * @param {UserRepo} userRepo 
 * @param {AuthManager} authManager 
 */
module.exports = (sessionRepo, userRepo, authManager) => {
    _sessionRepo = sessionRepo;
    _userRepo = userRepo;
    _authManager = authManager;

    return authenticateUser;
};