const Server = require("../Server");
const SpecUtils = require("./support/SpecUtils");
const constants = require("../lib/constants");
const SpecConstants = require("./support/SpecConstants");
const Db = require("mongodb").Db;
const mongo = require("mongodb");

describe("RemoveFavoriteHandler", () => {

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

    it("should be possible to remove favorite", async done => {
        try {
            const nasaId = "hello-nasa";
            const asset = {
                data: [],
                links: [],
                href: "https://images-assets.nasa.gov/image/NASA 60th_SEAL_BLACK_300DPI/collection.json"
            };

            await SpecUtils.createUserAccount();

            const loginResponse = await SpecUtils.login();
            const accesstoken = loginResponse.headers[constants.AUTHENTICATION_TOKEN_NAME_OUT];

            const requestHeaders = {};
            requestHeaders[constants.AUTHENTICATION_TOKEN_NAME] = `Bearer ${accesstoken}`;

            await SpecUtils.post(constants.endpoints.ADD_FAVORITE, { nasaId, asset }, requestHeaders);

            const removeFavoriteResponse = await SpecUtils.delete(constants.endpoints.REMOVE_FAVORITE.replace(":nasaId", nasaId), requestHeaders);

            expect(removeFavoriteResponse.body.favoriteRemoved).toBeTruthy("Should return flag favoriteRemoved true");

            const dbContents = await db.collection(constants.collections.FAVORITES).findOne({});

            expect(dbContents).toBe(null, "Database should be empty");

            done();
        } catch (err) {
            console.error(err);
            done.fail();
        }
    });

    it("should not be possible to remove favorite without being logged in", async done => {
        try {
            const nasaId = "hello-nasa";
            const asset = {
                data: [],
                links: [],
                href: "https://images-assets.nasa.gov/image/NASA 60th_SEAL_BLACK_300DPI/collection.json"
            };

            await SpecUtils.createUserAccount();

            await SpecUtils.login();
            await SpecUtils.post(constants.endpoints.ADD_FAVORITE, { nasaId, asset });

            done.fail();
        } catch (err) {
            expect(err.statusCode).toBe(400, "Status should be 400");
            done();
        }
    });

    it("should return not found if favorite cannot be found", async done => {
        try {
            const nasaId = "hello-nasa";

            await SpecUtils.post(constants.endpoints.REMOVE_FAVORITE, { nasaId });

            done.fail();
        } catch (err) {
            expect(err.statusCode).toBe(404, "Status should be 404");
            done();
        }
    });

});