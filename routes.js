const express = require("express");
const validate = require("express-jsonschema").validate;
const CreateUserRequestSchema = require("./lib/schemas/CreateUserRequestSchema");
const AuthRepo = require("./lib/repos/AuthRepo");
const UserRepo = require("./lib/repos/UserRepo");
const FavoritesRepo = require("./lib/repos/FavoritesRepo");
const CreateUserHandler = require("./lib/handlers/CreateUserHandler");
const PasswordManager = require("./lib/managers/PasswordManager");


/**
 * @param {express.Application} app 
 */
module.exports = (app, db) => {

    const authRepo = new AuthRepo(db);
    const userRepo = new UserRepo(db);
    const favoritesRepo = new FavoritesRepo(db);

    const passwordManager = new PasswordManager(userRepo);

    const createUserHandler = new CreateUserHandler(userRepo, passwordManager);

    // @ts-ignore
    app.post("/user", validate({ body: CreateUserRequestSchema }), (req, res) => createUserHandler.handle(req, res));
}