const express = require("express");
const next = require("next");
const cookieParser = require("cookie-parser");

const devProxy = {
	"/api": {
		target: "http://localhost:8080/api",
		cookieDomainRewrite: "",
		secure: true,
		changeOrigin: true,
		pathRewrite: {
			"^/api": "",
		},
	},
}

const port = 3000;
const env = process.env.NODE_ENV;
const dev = env !== "production";
const app = next({
	dir: ".",
	dev,
});

const handle = app.getRequestHandler();

let server;

app
	.prepare()
	.then(async () => {
		server = express();

		server.use(cookieParser());

		const { createProxyMiddleware } = require("http-proxy-middleware");

		Object.keys(devProxy).forEach(function (context) {
			server.use(context, createProxyMiddleware(devProxy[context]))
		});

		server.all("*", (req, res) => handle(req, res));

		server.listen(port, (err) => {
			if (err)
				throw err;

			console.log(`> Ready on port ${port} [${env}]`);
		});
	})
	.catch((err) => {
		console.log("An error occurred, unable to start the server");

		throw err;
	});
