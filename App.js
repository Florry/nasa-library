const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const mongo = require("mongodb");
const config = require("./config");
const port = config.backendPort;
const constants = require("./lib/constants");

class App {

    constructor() { }

    /**
     * @param {String} mongodbUrl 
     */
    async start(mongodbUrl = "mongodb://localhost:27017/nasa-library") {
        this.db = await this._setupMongoDb(mongodbUrl);
        this._setupHttpServer();
    }

    /**
     * Starts the http server
     */
    _setupHttpServer() {
        const app = express();

        app.use(bodyParser.json());

        routes(app, this.db);

        app.listen(port, () => console.log(`App backend running on ${port}`));
    }

    /**
     * Connects to and sets up mongo db.
     * 
     * @param {String} mongodbUrl 
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

module.exports = App;