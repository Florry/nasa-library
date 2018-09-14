const constants = require("./lib/constants");
const express = require("express");
const validate = require("express-jsonschema").validate;
const authenticateUserMiddleware = require("./lib/middleware/authenticateUserMiddleware");

const SessionRepo = require("./lib/repos/SessionRepo");
const UserRepo = require("./lib/repos/UserRepo");
const FavoritesRepo = require("./lib/repos/FavoritesRepo");

const PasswordManager = require("./lib/managers/PasswordManager");
const AuthManager = require("./lib/managers/AuthManager");

const CreateUserHandler = require("./lib/handlers/CreateUserHandler");
const LoginHandler = require("./lib/handlers/LoginHandler");

const CreateUserRequestSchema = require("./lib/schemas/CreateUserRequestSchema");
const LoginRequestSchema = require("./lib/schemas/LoginRequestSchema");


/**
 * Handles all endpoints
 * 
 * @param {express.Application} app 
 */
module.exports = (app, db) => {

    const sessionRepo = new SessionRepo(db);
    const userRepo = new UserRepo(db);
    const favoritesRepo = new FavoritesRepo(db);

    const passwordManager = new PasswordManager(userRepo);
    const authManager = new AuthManager(sessionRepo, userRepo, passwordManager);

    const authenticateUser = authenticateUserMiddleware(sessionRepo, userRepo, authManager);

    const createUserHandler = new CreateUserHandler(userRepo, passwordManager);
    const loginHandler = new LoginHandler(userRepo, authManager);

    /**
     * Endpoint for registering an account
     */
    // @ts-ignore
    app.post(constants.endpoints.CREATE_USER, validate({ body: CreateUserRequestSchema }), (req, res) => createUserHandler.handle(req, res));

    /**
     * Endpoint for logging in with created account 
     */
    // @ts-ignore
    app.post(constants.endpoints.LOGIN, validate({ body: LoginRequestSchema }), (req, res) => loginHandler.handle(req, res));

    // TEMP!
    let i = 0;

    app.get("/test", authenticateUser, (req, res) => {
        res.setHeader("Content-Type", " text/html");

        res.end(`
            <html>
                <head>
                    <title>Hello</title>
                </head>

                <style>
                    body{
                        background-color: darkgrey;
                        padding: 30px;
                    }
                    h1{
                        background-color: green;
                    }
                    p{
                        overflow: hidden;
                        word-break: break-all;
                        color: white;
                        background-color: black;
                    }
                </style>

                <body>
                    <h1>This is html!</h1>
                    <p>Logged in as ${req.user.username}</p>
                    <p> ${Object.keys(req.user).map(k => {
                const obj = {};
                obj[k] = req.user[k];
                return JSON.stringify(obj);
            }).join(", ")}</p>
                <p>${i++}</p>
                </body>

            </html>        
        `);

    });

}