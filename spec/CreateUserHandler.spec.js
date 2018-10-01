const Server = require("../Server");
const SpecUtils = require("./support/SpecUtils");
const constants = require("../lib/constants");
const SpecConstants = require("./support/SpecConstants");
const Db = require("mongodb").Db;
const mongo = require("mongodb");

describe("CreateUserHandler", () => {

    /** @type {Server} */
    let server;

    /** @type {Db} */
    let db;

    beforeEach(async done => {
        db = await mongo.connect(SpecConstants.MONGO_SPEC_URL);
        server = new Server();
        await server.start(SpecConstants.MONGO_SPEC_URL);

        done();
    });

    afterEach(async done => {
        await SpecUtils.clearDatabases();
        await server.close();

        done();
    });

    it("should be possible to create user", async (done) => {
        try {
            const username = "user1";
            const password = "Localhost:3030";
            const response = await SpecUtils.post(constants.endpoints.CREATE_USER, { username, password });

            expect(response.body.username).toBe(username, "username should be the same as was sent in");
            expect(response.body.id).toBeDefined("should have a generated id");
            expect(SpecConstants.UUID_REGEXP.test(response.body.id)).toBeTruthy("id should be uuid");

            const dbResponse = await db.collection(constants.collections.USERS).find().toArray();

            expect(dbResponse[0].id).toBe(response.body.id, "created user in database should have the same id as the one that was returned");
            expect(dbResponse[0].username).toBe(response.body.username, "created user in database should have the same username as the one that was returned");
            expect(dbResponse[0].salt).toBeDefined();
            expect(dbResponse[0].hashedPassword).toBeDefined();
            expect(dbResponse[0].metadata).toBeDefined();

            done();
        } catch (err) {
            console.error("error", err);
            done.fail();
        }
    });

    it("each user should have its own unique salt", async (done) => {
        try {
            const username = "user";
            const password = "Localhost:3030";

            for (let i = 0; i < 10; i++)
                await SpecUtils.post(constants.endpoints.CREATE_USER, { username: username + i, password });

            const dbResponse = await db.collection(constants.collections.USERS).find().toArray();
            const salts = dbResponse.map(r => r.salt);

            salts.forEach(salt => {
                let matchingSalts = 0;

                for (let j = 0; j < salts.length; j++) {
                    if (salts[j] === salt)
                        matchingSalts++;
                }

                expect(matchingSalts).toBe(1, "should only find one matchin salt");
            });

            done();
        } catch (err) {
            console.error("error", err);
            done.fail();
        }
    });

    it("should not be possible to send in invalid request body", async (done) => {
        try {
            await SpecUtils.post(constants.endpoints.CREATE_USER, { user: "hello", firstName: "bob" });

            done.fail();
        } catch (err) {
            expect(err.statusCode).toBe(500);
            done();
        }
    });

    it("should not be possible to send in invalid request body types", async (done) => {
        try {
            await SpecUtils.post(constants.endpoints.CREATE_USER, { username: "hello", password: 133 });

            done.fail();
        } catch (err) {
            expect(err.statusCode).toBe(500);
            done();
        }
    });

    it("should not be possible to register with invalid password", async (done) => {
        try {
            await SpecUtils.post(constants.endpoints.CREATE_USER, { username: "hello", password: "12" });

            done.fail();
        } catch (err) {
            expect(err.statusCode).toBe(400);
            done();
        }
    });

});