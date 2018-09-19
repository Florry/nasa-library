const Db = require("mongodb").Db;
const UserModel = require("../models/UserModel");
const Repo = require("./Repo");

/**
 * Mongo db version of a repo where users are stored
 */
class UserRepo extends Repo {

    /**
     * @param {Db} db database object
     */
    constructor(db) {
        super();
        this._collection = db.collection("users");
    }

    /**
     * Creates a user in the database
     * 
     * @param {UserModel} userData user data to be created
     * 
     * @return {Promise<UserModel>} the created user
     */
    async createUser(userData) {
        try {
            const createdUser = (await this._collection.insertOne(userData)).ops[0];
            const createUserModel = new UserModel(createdUser.username,
                createdUser.hashedPassword,
                createdUser.salt,
                createdUser.metadata.created,
                createdUser.id);

            return createUserModel;
        } catch (err) {
            super._handleDbError(err);
        }
    }

    /**
     * Gets a user by its username
     * 
     * @param {String} username the username to get the user by
     *
     * @return {Promise<UserModel>} the user with the inputted username, if it exists
     */
    async getByUsername(username) {
        return this._getByQuery({ username })
    }

    /**
     * Gets a user by its id
     * 
     * @param {String} userId the id of the user to get
     *
     * @return {Promise<UserModel>} the user matching the inputted id, if it exists
     */
    async getByUserId(userId) {
        return this._getByQuery({ id: userId })
    }

    /**
     * Gets a user by a mongodb query
     * 
     * @param {Object} query the mongodb query to get the user by
     * 
     * @return {Promise<UserModel>} the user matching the inputted query, if any was found
     */
    async _getByQuery(query) {
        try {
            const dbResponse = await this._collection.findOne(query);

            let user = null;

            if (dbResponse != null)
                user = new UserModel(dbResponse.username,
                    dbResponse.hashedPassword,
                    dbResponse.salt,
                    dbResponse.metadata.created,
                    dbResponse.id);

            return user;
        } catch (err) {
            super._handleDbError(err);
        }
    }

}

module.exports = UserRepo;