/**
 * Entry point for running the server
 */
const Server = require("./Server");

(async () => {

    process.on("unhandledRejection", (err) => console.error(err));

    const server = new Server();
    await server.start();

})();