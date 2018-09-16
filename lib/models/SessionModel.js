class SessionModel {

    /**
     * @param {String} userId 
     * @param {String} sessionId 
     */
    constructor(userId, sessionId) {
        this.userId = userId;
        this.sessionId = sessionId;
    }

}

module.exports = SessionModel;