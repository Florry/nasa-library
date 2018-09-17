const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const mongo = require("mongodb");
const config = require("./config");
const port = config.backendPort;
const constants = require("./lib/constants");
const http = require("http");
const Db = require("mongodb").Db;

class Server {

    constructor() {
        /** @type {http.Server} */
        this.server;
    }

    /**
     * @param {String} mongodbUrl 
     * 
     * @return {Promise<Void>}
     */
    async start(mongodbUrl = "mongodb://localhost:27017/nasa-library") {
        this.db = await this._setupMongoDb(mongodbUrl);
        this._setupHttpServer();
    }

    /**
     * @return {Promise<Void>}
     */
    async close() {
        if (this.server)
            await this.server.close();
    }

    /**
     * Starts the http server
     * 
     * @return {Void}
     */
    _setupHttpServer() {
        this.app = express();
        this.app.use(bodyParser.json());

        routes(this.app, this.db);

        this.server = this.app.listen(port, () => { console.log(`App backend running on ${port}`); });
    }

    /**
     * Connects to and sets up mongo db.
     * 
     * @param {String} mongodbUrl 
     * 
     * @return {Promise<Db>}
     */
    async  _setupMongoDb(mongodbUrl) {
        const db = await mongo.connect(mongodbUrl);

        db.collection(constants.collections.USERS)
            .createIndex({ username: 1 }, { unique: true, partialFilterExpression: { username: { $exists: true } } });

        db.collection(constants.collections.SESSIONS)
            .createIndex({ userId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } });

        return db;
    }

}

module.exports = Server;