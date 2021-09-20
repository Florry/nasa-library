/**
 * Entry point for running the server
 */
import { start } from "./server";

(async () => {

	process.on("unhandledRejection", (err) => console.error(err));

	await start();

})();
