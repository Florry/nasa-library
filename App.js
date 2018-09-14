// Creating a front end to the NASA Image and Video Library JSON API with the ability to create a user and add favourites connected to the user

// https://api.nasa.gov/api.html#Images

// What we expect to see (minimum)

//     Mobile first (or only) design
//     Using more than one NASA API endpoint
//     A well structured project with code and resources divided into folders and files. E.g. the code for each view should be contained in separate files (one or more per view).
//     Using a proper build script (and tools). (Please write instructions on how to build).
//     Fullscreen image viewing
//     Possibility to view metadata
//     Some sorting and/or filtering options for the items
//     User login
//     Possibility to add/remove favourites
//     View the users favourites

/**
 * Create user
 * Login
 *      auth header token
 *          auth sessions saved in database
 *          new token after each request
 *          middleware for getting user in request
 * Favorite image
 *      add 
 *      remove
 *      get
 * Get image / video
 *      sorting
 *      filtering
 * Get image metadata
 *      
 * 
 * Frontend
 *      mobile first 
 *      static
 *          signup
 *          login
 *      react app
 *          view images
 *               sorting
 *              filtering
 *          view image
 *              fullscreen
 *              
 */



const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const mongo = require("mongodb");
const config = require("./config");
const port = config.backendPort;
const constants = require("./lib/constants");

class App {

    constructor() { }

    async start(mongodbUrl = "mongodb://localhost:27017/nasa-library") {
        this.db = await this._setupMongoDb(mongodbUrl);
        this._setupHttpServer();
    }

    /**
     * @param {String} mongodbUrl 
     */
    _setupHttpServer() {
        const app = express();

        app.use(bodyParser.json());

        routes(app, this.db);

        app.listen(port, () => console.log(`App running on ${port}`));
    }

    /**
     * @param {String} mongodbUrl 
     */
    async  _setupMongoDb(mongodbUrl) {
        const db = await mongo.connect(mongodbUrl);

        /** Sets index for username so that we cannot have two identical usernames */
        db.collection(constants.collections.USERS)
            .createIndex({ username: 1 }, {
                unique: true,
                partialFilterExpression: {
                    username: { $exists: true }
                }
            });

        return db;
    }

}

module.exports = App;