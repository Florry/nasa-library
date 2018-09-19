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
 * 
 * TODO:
 * =- Using a proper build script (and tools). (Please write instructions on how to build).
 * - Some sorting and/or filtering options for the items
 * - Fix sessionId not regenerating w/ each request
 * - Comments
 * 
 * Nice to have
 * - Error messages / exception handling
 * - Logged in as / get user on login/refresh
 * - Text such as "zoom", "favorite" and "unfavorite"
 * - css
 *      - table content goes outside tables if too small
 * - two inputs for registration & password
 * - registration / login input validation
 */

const Server = require("./Server");

(async () => {

    process.on("unhandledRejection", (err) => {
        console.error(err);
    });

    const server = new Server();
    await server.start();

})();