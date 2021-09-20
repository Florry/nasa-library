import { Application } from "express";
import { validate } from "express-jsonschema";
import { JSONSchema4 } from "json-schema";
import { Db } from "mongodb";
import {
	ADD_FAVORITE,
	CREATE_USER,
	GET_FAVORITES,
	GET_MEDIA_BY_ID,
	GET_MEDIA_METADATA,
	IS_LOGGED_IN,
	LOGIN,
	LOGOUT,
	REMOVE_FAVORITE, SEARCH_MEDIA
} from "./lib/constants/endpoint-constants";
import { AddFavoriteHandler } from "./lib/handlers/AddFavoriteHandler";
import { CreateUserHandler } from "./lib/handlers/CreateUserHandler";
import { GetFavoritesHandler } from "./lib/handlers/GetFavoritesHandler";
import { GetMediaByIdHandler } from "./lib/handlers/GetMediaByIdHandler";
import { GetMediaMetadataHandler } from "./lib/handlers/GetMediaMetadataHandler";
import { IsLoggedInHandler } from "./lib/handlers/IsLoggedInHandler";
import { LoginHandler } from "./lib/handlers/LoginHandler";
import { LogoutHandler } from "./lib/handlers/LogoutHandler";
import { RemoveFavoriteHandler } from "./lib/handlers/RemoveFavoriteHandler";
import { SearchMediaHandler } from "./lib/handlers/SearchMediaHandler";
import { AuthManager } from "./lib/managers/AuthManager";
import { PasswordManager } from "./lib/managers/PasswordManager";
import { authenticateUser, initAuthenticateUserMiddleware } from "./lib/middleware/authenticateUserMiddleware";
import { FavoritesRepo } from "./lib/repos/FavoritesRepo";
import { SessionRepo } from "./lib/repos/SessionRepo";
import { UserRepo } from "./lib/repos/UserRepo";
import AddFavoriteRequestSchema from "./lib/schemas/AddFavoriteRequestSchema";
import CreateUserRequestSchema from "./lib/schemas/CreateUserRequestSchema";
import LoginRequestSchema from "./lib/schemas/LoginRequestSchema";

/**
 * All endpoints
 */
export default (app: Application, db: Db) => {

	const sessionRepo = new SessionRepo(db);
	const userRepo = new UserRepo(db);
	const favoritesRepo = new FavoritesRepo(db);

	const passwordManager = new PasswordManager(userRepo);
	const authManager = new AuthManager(sessionRepo, userRepo, passwordManager);

	initAuthenticateUserMiddleware(authManager);

	const createUserHandler = new CreateUserHandler(userRepo, passwordManager);
	const loginHandler = new LoginHandler(userRepo, authManager);
	const logoutHandler = new LogoutHandler(authManager);
	const isLoggedInHandler = new IsLoggedInHandler();

	const searchMediaHandler = new SearchMediaHandler(favoritesRepo);
	const getMediaByIdHandler = new GetMediaByIdHandler();
	const getMediaMetadataHandler = new GetMediaMetadataHandler();

	const addFavoriteHandler = new AddFavoriteHandler(favoritesRepo);
	const removeFavoriteHandler = new RemoveFavoriteHandler(favoritesRepo);
	const getFavoritesHandler = new GetFavoritesHandler(favoritesRepo);

	/**
	 * Endpoint for registering an account
	 */
	app.post(CREATE_USER, validate({ body: CreateUserRequestSchema as JSONSchema4 }), (req, res) => createUserHandler.handle(req, res));

	/**
	 * Endpoint for logging in with created account
	 */
	app.post(LOGIN, validate({ body: LoginRequestSchema as JSONSchema4 }), (req, res) => loginHandler.handle(req, res));
	app.post(LOGOUT, authenticateUser, (req, res) => logoutHandler.handle(req, res));
	app.get(IS_LOGGED_IN, authenticateUser, (req, res) => isLoggedInHandler.handle(req, res));

	/**
	 * Media endpoints
	 */
	app.get(SEARCH_MEDIA, authenticateUser, (req, res) => searchMediaHandler.handle(req, res));
	app.get(GET_MEDIA_BY_ID, authenticateUser, (req, res) => getMediaByIdHandler.handle(req, res));
	app.get(GET_MEDIA_METADATA, authenticateUser, (req, res) => getMediaMetadataHandler.handle(req, res));

	/**
	 * Favorite endpoints
	 */
	app.post(ADD_FAVORITE, validate({ body: AddFavoriteRequestSchema } as JSONSchema4), authenticateUser, (req, res) => addFavoriteHandler.handle(req, res));
	app.delete(REMOVE_FAVORITE, authenticateUser, (req, res) => removeFavoriteHandler.handle(req, res));  /** Would use json response schema validation */
	app.get(GET_FAVORITES, authenticateUser, (req, res) => getFavoritesHandler.handle(req, res)); /** Would use json response schema validation */

}
