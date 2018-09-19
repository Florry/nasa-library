const uuid = require("uuid");

/**
 * Model for a user account
 */
class UserModel {

    /**
     * @param {String} username username for the account
     * @param {String} hashedPassword the hashed password, to be used to compare with when logging in
     * @param {String} salt the salt of the account, to be used together with any inputted password when logging in
     * @param {Date=} created when the account was created
     * @param {String=} id id of the account. Leave empty if user is a new user and an id is generated
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
     * For instance we don't want to send out critical information about password
     * 
     * @return {UserModel.ViewModel}
     */
    toViewModel() {
        return new UserModel.ViewModel(this);
    }

}

module.exports = UserModel;

/**
 * Model for the view model of the user model
 * Mainly used for intellisens/jsdoc/code completion
 */
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