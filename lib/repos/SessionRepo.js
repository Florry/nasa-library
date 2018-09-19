const Db = require("mongodb").Db;
const constants = require("../constants");
const SessionModel = require("../models/SessionModel");
const Repo = require("./Repo");

/**
 * Mongo db version of a repo where sessions are stored
 */
class SessionRepo extends Repo {

    /**
     * @param {Db} db database object
     */
    constructor(db) {
        super();
        this._collection = db.collection(constants.collections.SESSIONS);
    }

    /**
     * Saves a session in the database
     * 
     * @param {SessionModel} sessionModel the session to save
     * 
     * @return {Promise<SessionModel>} the saved session
     */
    async saveSession(sessionModel) {
        try {
            (await this._collection.updateOne({ userId: sessionModel.userId }, sessionModel, { upsert: true }));
            const createdSession = await this._collection.findOne({ userId: sessionModel.userId });
            return new SessionModel(createdSession.userId, createdSession.sessionId);
        } catch (err) {
            super._handleDbError(err);
        }
    }

    /**
     * Gets a session for a user by the user's id
     * 
     * @param {String} userId the id of the user to get a session by
     * 
     * @return {Promise<SessionModel>} the session of the user, if found
     */
    async getSessionByUserId(userId) {
        try {
            const result = await this._collection.findOne({ userId });

            if (result)
                return new SessionModel(result.userId, result.sessionId);
            else
                return result;
        } catch (err) {
            super._handleDbError(err);
        }
    }

    /**
     * Deletes a session for a user by the user's id
     * 
     * @param {String} userId the id of the user to delete the session for
     * 
     * @return {Promise<Void>}
     */
    async deleteSessionsByUserId(userId) {
        try {
            await this._collection.deleteMany({ userId });
        } catch (err) {
            super._handleDbError(err);
        }
    }

}

module.exports = SessionRepo;