import { Server } from "http";
import { CREATE_USER, LOGIN, LOGOUT } from "../lib/constants/endpoint-constants";
import { start } from "../server";
import { MONGO_SPEC_URL } from "./support/spec-constants";
import { clearDatabases, post } from "./support/spec-utils";

describe("LogoutHandler", () => {

	let server: Server;

	beforeEach(async () => server = await start(MONGO_SPEC_URL));

	afterEach(async () => {
		await clearDatabases();
		await server.close();
	});

	it("should not be possible to logout without being logged in", async () => {
		try {
			await post(LOGOUT, {});
			fail();
		} catch (err: any) {
			expect(err.statusCode).toBe(400, "Response error status code");
		}
	});

	it("should be possible to logout if logged in", async () => {
		try {
			const username = "user1";
			const password = "Localhost:3030";

			await post(CREATE_USER, { username, password });
			const loginResponse = await post(LOGIN, { username, password });
			const logoutResponse = await post(LOGOUT, {}, { cookie: loginResponse.headers["set-cookie"] });

			expect(logoutResponse.statusCode).toBe(200, "Response status code");
			expect(logoutResponse.headers["set-cookie"][0]).toMatch(new RegExp("jwt=true;HttpOnly;Expires=.*.;SameSite=strict;Path=/"), "Should not have access token header");
		} catch (err: any) {
			console.error(err);
			fail(err);
		}
	});


});
