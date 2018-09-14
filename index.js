const App = require("./App");


(async () => {

    const app = new App();
    await app.start();

})();

process.on("unhandledRejection", (reason) => {
    console.error(reason);
});