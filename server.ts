import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import mongo, { Db } from "mongodb";
import { BACKEND_PORT } from "./config";
import { FAVORITES, SESSIONS, USERS } from "./lib/constants/collection-constants";
import routes from "./routes";

let server: http.Server;
let app: express.Express;
let db: Db;

/**
 * Starts server
 */
export async function start(mongodbUrl: string = "mongodb://localhost:27017/nasa-library") {
	db = await setupMongoDb(mongodbUrl);
	return setupHttpServer();
}

/**
 * Closes server
 */
export async function close() {
	if (server)
		await server.close();
}

/**
 * Starts the http server
 */
function setupHttpServer() {
	app = express();

	app.use(bodyParser.json());
	app.use(cookieParser());

	app.use(
		cors({
			origin: ["http://localhost:3000", "localhost:3000", "http://localhost:8080", "http://192.168.1.4:3000"],
			credentials: true,
			allowedHeaders: ["Authentication", "accesstoken", "X-Requested-With", "X-HTTP-Method-Override", "Content-Type", "Accept"],
			exposedHeaders: "accesstoken"
		})
	);

	routes(app, db);

	server = app.listen(BACKEND_PORT, () => { console.log(`Server running on ${BACKEND_PORT}.`); });

	return server;
}

/**
 * Connects to and sets up mongo db.
 */
async function setupMongoDb(mongodbUrl: string) {
	const db = await mongo.connect(mongodbUrl);

	await db.collection(USERS).createIndex({ username: 1 }, { unique: true, partialFilterExpression: { username: { $exists: true } } });

	await db.collection(SESSIONS).createIndex({ userId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } });

	await db.collection(FAVORITES).createIndex({ userId: 1, nasaId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true }, nasaId: { $exists: true } } });

	return db;
}
