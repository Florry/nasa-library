const Db = require("mongodb").Db;
const UserModel = require("../models/UserModel");

class UserRepo {

    /**
     * @param {Db} db 
     */
    constructor(db) {
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
            console.error("error:", err);
            throw err;
        }
    }

}

module.exports = UserRepo;