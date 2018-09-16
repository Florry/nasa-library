const UserRepo = require("../repos/UserRepo");
const express = require("express");
const PasswordManager = require("../managers/PasswordManager");
const UserModel = require("../models/UserModel");

class CreateUserHandler {

    /**
     * @param {UserRepo} userRepo 
     * @param {PasswordManager} passwordManager
     */
    constructor(userRepo, passwordManager) {
        this._userRepo = userRepo;
        this._passwordManager = passwordManager;
    }

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     * 
     * @return {Promise<Void>}
     */
    async  handle(req, res) {
        try {
            const username = req.body.username;
            const password = req.body.password;

            /** Validates if password follows any guidelines for password formatting */
            if (!this._passwordManager.validatePasswordFollowsRegExp(password))
                throw "NOPE!"; // TODO: Handle this

            /** Hashes password */
            const hashDetails = await this._passwordManager.hashPassword(password);

            /** Creates user in database */
            const userToBeCreated = new UserModel(username, hashDetails.hashValue, hashDetails.salt);
            const createdUser = await this._userRepo.createUser(userToBeCreated);

            res.json(createdUser.toViewModel());
        } catch (err) {
            // TODO: Handle this
            res.status(400);
            res.json(err);

            throw err;
        }
    }

}

module.exports = CreateUserHandler;