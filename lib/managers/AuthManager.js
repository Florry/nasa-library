const SessionRepo = require("../repos/SessionRepo");
const UserRepo = require("../repos/UserRepo");
const PasswordManager = require("./PasswordManager");
const CryptoUtils = require("../utils/CryptoUtils");
const SessionModel = require("../models/SessionModel");
const config = require("../../config");
const jwt = require("jwt-simple");
const ms = require("ms");

class AuthManager {

    /**
     * @param {SessionRepo} sessionRepo 
     * @param {UserRepo} userRepo 
     * @param {PasswordManager} passwordManager 
     */
    constructor(sessionRepo, userRepo, passwordManager) {
        this._sessionRepo = sessionRepo;
        this._userRepo = userRepo;
        this._passwordManager = passwordManager;
    }

    /**
     * @param {String} username 
     * @param {String} password
     * 
     * @return {Promise<String>} a jwt token including user id and session id.
     */
    async login(username, password) {
        if (! await this._passwordManager.validatePasswordForUser(password, username))
            throw "Invalid username and/or password"; // TODO: Handle this

        const user = await this._userRepo.getByUsername(username);

        return this.generateNewSession(user.id);
    }

    /**
     * @param {String} userId 
     */
    async generateNewSession(userId) {
        const sessionToken = await CryptoUtils.randomBytes(128);
        const session = await this._sessionRepo.saveSession(new SessionModel(userId, sessionToken));
        const jwtToken = await this._generateJwtToken(session.userId, session.sessionId);

        return jwtToken;
    }

    /**
     * @param {String} userId 
     * @param {String} sessionToken 
     */
    _generateJwtToken(userId, sessionToken) {
        const jwtObject = { exp: this._getExpirationDate(), userId, sessionId: sessionToken };
        return jwt.encode(jwtObject, config.jwtSecret);
    }

    /**
     * @param {String|String[]} jwtToken 
     */
    decodeJwtToken(jwtToken) {
        return jwt.decode(jwtToken, config.jwtSecret);
    }

    /**
     * @param {String} userId 
     */
    async logout(userId) {
        await this._sessionRepo.deleteSessionsByUserId(userId);
    }

    _getExpirationDate() {
        return (Date.now() + ms(config.jwtExpiresIn)) / 1000;
    }

    /**
     * @param {String} sessionToken 
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