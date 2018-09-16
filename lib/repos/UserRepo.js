const Db = require("mongodb").Db;
const UserModel = require("../models/UserModel");
const Repo = require("./Repo");

class UserRepo extends Repo {

    /**
     * @param {Db} db 
     */
    constructor(db) {
        super();
        this._collection = db.collection("users");
    }

    /**
     * @param {UserModel} userData 
     * 
     * @return {Promise<UserModel>}
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
     * @param {String} username 
     *
     * @return {Promise<UserModel>}
     */
    async getByUsername(username) {
        return this.getByQuery({ username })
    }

    /**
     * @param {String} userId 
     *
     * @return {Promise<UserModel>}
     */
    async getByUserId(userId) {
        return this.getByQuery({ id: userId })
    }

    /**
     * @param {Object} query 
     * 
     * @return {Promise<UserModel>}
     */
    async getByQuery(query) {
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