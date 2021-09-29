import { Server } from "http";
import { CREATE_USER, LOGIN, LOGOUT } from "../lib/constants/endpoint-constants";
import { start } from "../server";
import { MONGO_SPEC_URL } from "./support/SpecConstants";
import SpecUtils from "./support/SpecUtils";

describe("LogoutHandler", () => {

	let server: Server;

	beforeEach(async () => server = await start(MONGO_SPEC_URL));

	afterEach(async () => {
		await SpecUtils.clearDatabases();
		await server.close();
	});

	it("should not be possible to logout without being logged in", async () => {
		try {
			await SpecUtils.post(LOGOUT, {});
			fail();
		} catch (err: any) {
			expect(err.statusCode).toBe(400, "Response error status code");
		}
	});

	it("should be possible to logout if logged in", async () => {
		try {
			const username = "user1";
			const password = "Localhost:3030";

			await SpecUtils.post(CREATE_USER, { username, password });
			const loginResponse = await SpecUtils.post(LOGIN, { username, password });
			const logoutResponse = await SpecUtils.post(LOGOUT, {}, { cookie: loginResponse.headers["set-cookie"] });

			expect(logoutResponse.statusCode).toBe(200, "Response status code");
			expect(logoutResponse.headers["set-cookie"][0]).toBe("jwt=true;HttpOnly;Expires=1970-09-07;SameSite=strict;Path=/", "Should not have access token header");
		} catch (err: any) {
			console.error(err);
			fail(err);
		}
	});


});
