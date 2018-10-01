const Server = require("../Server");
const SpecUtils = require("./support/SpecUtils");
const constants = require("../lib/constants");
const SpecConstants = require("./support/SpecConstants");

describe("LogoutHandler", () => {

    /** @type {Server} */
    let server;

    beforeEach(async done => {
        server = new Server();
        await server.start(SpecConstants.MONGO_SPEC_URL);

        done();
    });

    afterEach(async done => {
        await SpecUtils.clearDatabases();
        await server.close();
        done();
    });

    it("should not be possible to logout without being logged in", async done => {
        try {
            await SpecUtils.post(constants.endpoints.LOGOUT, {});
            done.fail();
        } catch (err) {
            expect(err.statusCode).toBe(400, "Response error status code");
            done();
        }
    });

    it("should be possible to logout if logged in", async done => {
        try {
            const username = "user1";
            const password = "Localhost:3030";

            await SpecUtils.post(constants.endpoints.CREATE_USER, { username, password });
            const loginResponse = await SpecUtils.post(constants.endpoints.LOGIN, { username, password });
            const logoutResponse = await SpecUtils.post(constants.endpoints.LOGOUT, {}, { Authentication: `Bearer ${loginResponse.headers.accesstoken}` });

            expect(logoutResponse.statusCode).toBe(200, "Response status code");
            expect(logoutResponse.headers[constants.AUTHENTICATION_TOKEN_NAME_OUT]).toBeUndefined("Should not have access token header");

            done();
        } catch (err) {
            console.error(err);
            done.fail(err);
        }
    });


});