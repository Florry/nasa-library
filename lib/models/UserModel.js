const uuid = require("uuid");

class UserModel {

    /**
     * @param {String} username 
     * @param {String} hashedPassword 
     * @param {String} salt 
     * @param {Date=} created 
     * @param {String=} id 
     */
    constructor(username, hashedPassword, salt, created, id) {
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.salt = salt;

        if (id)
            this.id = id;
        else
            this.id = uuid.v4();

        if (created)
            this.metadata = { created };
        else
            this.metadata = { created: new Date() }
    }

    /**
     * Converts to view model. 
     * For instance we don't want to send out critical information about password.
     * 
     * @return {UserModel.ViewModel}
     */
    toViewModel() {
        return new UserModel.ViewModel(this);
    }

}

module.exports = UserModel;

UserModel.ViewModel = class {

    /**
     * @param {UserModel} user 
     */
    constructor(user) {
        this.username = user.username;
        this.id = user.id;
        this.metadata = user.metadata;
    }

};