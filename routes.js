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
const LogoutHandler = require("./lib/handlers/LogoutHandler");

const SearchMediaHandler = require("./lib/handlers/SearchMediaHandler");
const GetMediaByIdHandler = require("./lib/handlers/GetMediaByIdHandler");
const GetMediaMetadataHandler = require("./lib/handlers/GetMediaMetadataHandler");

const AddFavoriteHandler = require("./lib/handlers/AddFavoriteHandler");
const RemoveFavoriteHandler = require("./lib/handlers/RemoveFavoriteHandler");
const GetFavoritesHandler = require("./lib/handlers/GetFavoritesHandler");

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

    const authenticateUser = authenticateUserMiddleware(sessionRepo, authManager);

    const createUserHandler = new CreateUserHandler(userRepo, passwordManager);
    const loginHandler = new LoginHandler(userRepo, authManager);
    const logoutHandler = new LogoutHandler(authManager);

    const searchMediaHandler = new SearchMediaHandler(favoritesRepo);
    const getMediaByIdHandler = new GetMediaByIdHandler();
    const getMediaMetadataHandler = new GetMediaMetadataHandler();

    const addFavoriteHandler = new AddFavoriteHandler(favoritesRepo);
    const removeFavoriteHandler = new RemoveFavoriteHandler(favoritesRepo);
    const getFavoritesHandler = new GetFavoritesHandler(favoritesRepo);

    // TODO: define response json schemas
    // TODO: add json schemas for all endpoints
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
    app.post(constants.endpoints.LOGOUT, authenticateUser, (req, res) => logoutHandler.handle(req, res));

    /**
     * Media endpoints
     */
    app.get(constants.endpoints.SEARCH_MEDIA, authenticateUser, (req, res) => searchMediaHandler.handle(req, res));
    app.get(constants.endpoints.GET_MEDIA_BY_ID, authenticateUser, (req, res) => getMediaByIdHandler.handle(req, res));
    app.get(constants.endpoints.GET_MEDIA_METADATA, authenticateUser, (req, res) => getMediaMetadataHandler.handle(req, res));

    /**
     * Favorite endpoints
     */
    app.post(constants.endpoints.ADD_FAVORITE, authenticateUser, (req, res) => addFavoriteHandler.handle(req, res));
    app.delete(constants.endpoints.REMOVE_FAVORITE, authenticateUser, (req, res) => removeFavoriteHandler.handle(req, res));
    app.get(constants.endpoints.GET_FAVORITES, authenticateUser, (req, res) => getFavoritesHandler.handle(req, res));

    app.use(express.static("app/build"))

}