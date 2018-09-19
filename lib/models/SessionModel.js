/**
 * Model for a user's session
 */
class SessionModel {

    /**
     * @param {String} userId id of the user of the session
     * @param {String} sessionId the id of the session
     */
    constructor(userId, sessionId) {
        this.userId = userId;
        this.sessionId = sessionId;
    }

}

module.exports = SessionModel;