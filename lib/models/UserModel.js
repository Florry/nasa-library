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
            this.id = uuid.v1();

        if (created)
            this.metadata = { created };
        else
            this.metadata = {
                created: new Date()
            }
    }

    toViewModel() {
        const viewModel = Object.assign({}, this);

        delete viewModel.hashedPassword;
        delete viewModel.salt;

        return viewModel;
    }

}

module.exports = UserModel;