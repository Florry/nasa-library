const Db = require("mongodb").Db;
const constants = require("../constants");
const SessionModel = require("../models/SessionModel");
const Repo = require("./Repo");

class SessionRepo extends Repo {

    /**
     * @param {Db} db 
     */
    constructor(db) {
        super();
        this._collection = db.collection(constants.collections.SESSIONS);
    }
    /**
     * @param {SessionModel} sessionModel 
     * 
     * @return {Promise<SessionModel>}
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
     * @param {String} userId 
     * 
     * @return {Promise<SessionModel>}
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
     * @param {String} userId 
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