const Server = require("../Server");
const SpecUtils = require("./support/SpecUtils");
const constants = require("../lib/constants");
const SpecConstants = require("./support/SpecConstants");

describe("LoginHandler", () => {

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

    it("should be possible to login with correct details", async done => {
        try {
            const username = "user1";
            const password = "Localhost:3030";

            const registrationResponse = await SpecUtils.post(constants.endpoints.CREATE_USER, { username, password });
            const loginResponse = await SpecUtils.post(constants.endpoints.LOGIN, { username, password });

            expect(loginResponse.headers.accesstoken).toBeDefined("loginResponse.headers.accesstoken");
            expect(loginResponse.headers.accesstoken.length).toBeGreaterThan(632, "loginResponse.headers.accesstoken.legnth");
            expect(loginResponse.headers.accesstoken.length).toBeLessThan(636, "loginResponse.headers.accesstoken.legnth");
            expect(loginResponse.body.username).toBe(username, "loginResponse.body.username");
            expect(loginResponse.body.id).toBe(registrationResponse.body.id, "loginResponse.body.id");

            done();
        } catch (err) {
            console.error(err);
            done.fail(err);
        }
    });

    it("should not be possible to login with incorrect password", async done => {
        try {
            const username = "user1";
            const password = "Localhost:3030";

            await SpecUtils.post(constants.endpoints.CREATE_USER, { username, password });

            try {
                await SpecUtils.post(constants.endpoints.LOGIN, { username, password: "Localhost:4040" });
                done.fail();
            } catch (err) {
                expect(err.statusCode).toBe(401, "Response error status code");
                done();
            }
        } catch (err) {
            console.error(err);
            done.fail(err);
        }
    });

    it("should not be possible to login with incorrect username", async done => {
        try {
            const username = "user1";
            const password = "Localhost:3030";

            await SpecUtils.post(constants.endpoints.CREATE_USER, { username, password });

            try {
                await SpecUtils.post(constants.endpoints.LOGIN, { username: "username", password });
                done.fail();
            } catch (err) {
                expect(err.statusCode).toBe(401, "Response error status code");
                done();
            }
        } catch (err) {
            console.error(err);
            done.fail(err);
        }
    });

});