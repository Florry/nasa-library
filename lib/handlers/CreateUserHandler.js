const UserRepo = require("../repos/UserRepo");
const express = require("express");
const PasswordManager = require("../managers/PasswordManager");
const UserModel = require("../models/UserModel");

/**
 * Handler for creating user
 */
class CreateUserHandler {

    /**
     * @param {UserRepo} userRepo repo where users are stored
     * @param {PasswordManager} passwordManager password manager
     */
    constructor(userRepo, passwordManager) {
        this._userRepo = userRepo;
        this._passwordManager = passwordManager;
    }

    /**
     * Handles http request
     * 
     * @param {express.Request} req express request object
     * @param {express.Response} res express response object
     * 
     * @return {Promise<Void>}
     */
    async  handle(req, res) {
        try {
            const username = req.body.username;
            const password = req.body.password;

            /** Validates if password follows any guidelines for password formatting */
            if (!this._passwordManager.validatePasswordFollowsRegExp(password))
                throw "Invalid password!";

            /** Hashes password */
            const hashDetails = await this._passwordManager.hashPassword(password);

            /** Creates user in database */
            const userToBeCreated = new UserModel(username, hashDetails.hashValue, hashDetails.salt);
            const createdUser = await this._userRepo.createUser(userToBeCreated);

            res.json(createdUser.toViewModel());
        } catch (err) {
            res.status(400);
            res.json(err);
            console.error("CreateUserHandler:", err);
        }
    }

}

module.exports = CreateUserHandler;