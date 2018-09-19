const SessionRepo = require("../repos/SessionRepo");
const UserRepo = require("../repos/UserRepo");
const PasswordManager = require("./PasswordManager");
const CryptoUtils = require("../utils/CryptoUtils");
const SessionModel = require("../models/SessionModel");
const config = require("../../config");
const jwt = require("jwt-simple");
const ms = require("ms");
const UserModel = require("../models/UserModel");

/**
 * Manager for everything authentication related.
 */
class AuthManager {

    /**
     * @param {SessionRepo} sessionRepo repo where sessions are stored
     * @param {UserRepo} userRepo repo where users are stored
     * @param {PasswordManager} passwordManager password manager
     */
    constructor(sessionRepo, userRepo, passwordManager) {
        this._sessionRepo = sessionRepo;
        this._userRepo = userRepo;
        this._passwordManager = passwordManager;
    }

    /**
     * Logs a user in
     * 
     * @param {String} username 
     * @param {String} password
     * 
     * @return {Promise<String>} a jwt token including user id and session id.
     */
    async login(username, password) {
        if (!await this._passwordManager.validatePasswordForUser(password, username))
            throw "Invalid username and/or password";

        const user = await this._userRepo.getByUsername(username);

        return this._generateNewSession(user.toViewModel());
    }

    /**
     * Generates a new session for a user
     * 
     * @param {UserModel.ViewModel} user 
     *
     * @return {Promise<String>} a jwt token including user id and session id.
     */
    async _generateNewSession(user) {
        const sessionToken = await CryptoUtils.randomBytes(128);
        const session = await this._sessionRepo.saveSession(new SessionModel(user.id, sessionToken));
        const jwtToken = await this._generateJwtToken(user, session.sessionId);

        return jwtToken;
    }

    /**
     * Generates a jwt token for a user
     * 
     * @param {UserModel.ViewModel} user 
     * @param {String} sessionToken 
     * 
     * @return {String}
     */
    _generateJwtToken(user, sessionToken) {
        const jwtObject = { exp: this._getExpirationDate(), user, sessionId: sessionToken };
        return jwt.encode(jwtObject, config.jwtSecret);
    }

    /**
     * Decodes a jwt token
     * 
     * @typedef {Object} JwtToken
     * @property {String} sessionId
     * @property {Number} exp
     * @property {UserModel.ViewModel} user
     * 
     * @param {String|String[]} jwtToken 
     * 
     * @return {JwtToken}
     */
    decodeJwtToken(jwtToken) {
        return jwt.decode(jwtToken, config.jwtSecret);
    }

    /**
     * Logs a user out
     * 
     * @param {String} userId 
     * 
     * @return {Promise<Void>}
     */
    async logout(userId) {
        await this._sessionRepo.deleteSessionsByUserId(userId);
    }

    /**
     * Prepares expiration date
     * 
     * @return {Number}
     */
    _getExpirationDate() {
        return (Date.now() + ms(config.jwtExpiresIn)) / 1000;
    }

    /**
     * Validates if an inputted session token was the session token for the inputted user's current session.
     * 
     * @param {String} userId 
     * @param {String} sessionToken 
     * 
     * @return {Promise<Boolean>}
     */
    async validateSession(userId, sessionToken) {
        const session = await this._sessionRepo.getSessionByUserId(userId);

        if (!session || session.sessionId !== sessionToken)
            return false;
        else
            return true;
    }

}

module.exports = AuthManager;