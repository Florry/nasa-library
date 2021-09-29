import { Server } from "http";
import { CREATE_USER, LOGIN } from "../lib/constants/endpoint-constants";
import { start } from "../server";
import { MONGO_SPEC_URL } from "./support/spec-constants";
import { clearDatabases, post } from "./support/spec-utils";

describe("LoginHandler", () => {

	let server: Server;

	beforeEach(async () => server = await start(MONGO_SPEC_URL));

	afterEach(async () => {
		await clearDatabases();
		await server.close();
	});

	it("should be possible to login with correct details", async () => {
		try {
			const username = "user1";
			const password = "Localhost:3030";

			const registrationResponse = await post(CREATE_USER, { username, password });
			const loginResponse = await post(LOGIN, { username, password });

			expect(loginResponse.headers.accesstoken).toBeDefined("loginResponse.headers.accesstoken");
			expect(loginResponse.headers.accesstoken.length).toBeGreaterThan(632, "loginResponse.headers.accesstoken.legnth");
			expect(loginResponse.headers.accesstoken.length).toBeLessThan(636, "loginResponse.headers.accesstoken.legnth");
			expect(loginResponse.body.username).toBe(username, "loginResponse.body.username");
			expect(loginResponse.body.id).toBe(registrationResponse.body.id, "loginResponse.body.id");

			expect(loginResponse.headers["set-cookie"]).toBeDefined();
			expect(loginResponse.headers["set-cookie"][0]).toContain(loginResponse.headers.accesstoken);
		} catch (err: any) {
			console.error(err);
			fail(err);
		}
	});

	it("should not be possible to login with incorrect password", async () => {
		try {
			const username = "user1";
			const password = "Localhost:3030";

			await post(CREATE_USER, { username, password });

			try {
				await post(LOGIN, { username, password: "Localhost:4040" });
				fail();
			} catch (err: any) {
				expect(err.statusCode).toBe(401, "Response error status code");
			}
		} catch (err) {
			console.error(err);
			fail(err);
		}
	});

	it("should not be possible to login with incorrect username", async () => {
		try {
			const username = "user1";
			const password = "Localhost:3030";

			await post(CREATE_USER, { username, password });

			try {
				await post(LOGIN, { username: "username", password });
				fail();
			} catch (err: any) {
				expect(err.statusCode).toBe(401, "Response error status code");
			}
		} catch (err) {
			console.error(err);
			fail(err);
		}
	});

});
