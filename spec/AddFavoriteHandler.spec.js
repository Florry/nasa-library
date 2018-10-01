const Server = require("../Server");
const SpecUtils = require("./support/SpecUtils");
const constants = require("../lib/constants");
const SpecConstants = require("./support/SpecConstants");
const Db = require("mongodb").Db;
const mongo = require("mongodb");

describe("AddFavoriteHandler", () => {

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

    it("should be possible to add favorite", async done => {
        try {
            const nasaId = "hello-nasa";
            const asset = {
                data: [
                    {
                        title: "NASA 60th_SEAL_BLACK_300DPI",
                        secondary_creator: "NASA",
                        description: "Seal for NASA's 60th anniversary. Black 3,000 dpi",
                        nasa_id: "NASA 60th_SEAL_BLACK_300DPI",
                        date_created: "2018-05-14T00:00:00Z",
                        media_type: "image",
                        center: "HQ",
                        description_508: "Seal for NASA's 60th anniversary. Black 3,000 dpi"
                    }
                ],
                links: [
                    {
                        render: "image",
                        rel: "preview",
                        href: "https://images-assets.nasa.gov/image/NASA 60th_SEAL_BLACK_300DPI/NASA 60th_SEAL_BLACK_300DPI~thumb.jpg"
                    }
                ],
                href: "https://images-assets.nasa.gov/image/NASA 60th_SEAL_BLACK_300DPI/collection.json"
            };

            await SpecUtils.createUserAccount();

            const loginResponse = await SpecUtils.login();
            const accesstoken = loginResponse.headers[constants.AUTHENTICATION_TOKEN_NAME_OUT];

            const requestHeaders = {};
            requestHeaders[constants.AUTHENTICATION_TOKEN_NAME] = `Bearer ${accesstoken}`;

            const addFavoriteResponse = await SpecUtils.post(constants.endpoints.ADD_FAVORITE, { nasaId, asset }, requestHeaders);

            expect(addFavoriteResponse.body.userId).toBe(loginResponse.body.id, "addFavoriteResponse.body.userId");
            expect(addFavoriteResponse.body.nasaId).toBe(nasaId, "addFavoriteResponse.body.nasaId");
            expect(addFavoriteResponse.body.asset.title).toBe(asset.title, "addFavoriteResponse.body.asset.title");
            expect(addFavoriteResponse.body.asset.description).toBe(asset.description, "addFavoriteResponse.body.asset.description");

            const dbContents = await db.collection(constants.collections.FAVORITES).findOne({});

            expect(dbContents.userId).toBe(loginResponse.body.id, "dbContents.userId");
            expect(dbContents.nasaId).toBe(nasaId, "dbContents.nasaId");
            expect(dbContents.asset.title).toBe(asset.title, "dbContents.asset.title");
            expect(dbContents.asset.description).toBe(asset.description, "dbContents.asset.description");

            done();
        } catch (err) {
            console.error(err);
            done.fail();
        }
    });

    it("should not be possible to add favorites when not being logged in", async done => {
        try {
            const nasaId = "hello-nasa";
            const asset = {
                data: [
                    {
                        title: "NASA 60th_SEAL_BLACK_300DPI",
                        secondary_creator: "NASA",
                        description: "Seal for NASA's 60th anniversary. Black 3,000 dpi",
                        nasa_id: "NASA 60th_SEAL_BLACK_300DPI",
                        date_created: "2018-05-14T00:00:00Z",
                        media_type: "image",
                        center: "HQ",
                        description_508: "Seal for NASA's 60th anniversary. Black 3,000 dpi"
                    }
                ],
                links: [
                    {
                        render: "image",
                        rel: "preview",
                        href: "https://images-assets.nasa.gov/image/NASA 60th_SEAL_BLACK_300DPI/NASA 60th_SEAL_BLACK_300DPI~thumb.jpg"
                    }
                ],
                href: "https://images-assets.nasa.gov/image/NASA 60th_SEAL_BLACK_300DPI/collection.json"
            };

            await SpecUtils.post(constants.endpoints.ADD_FAVORITE, { nasaId, asset });

            done.fail();
        } catch (err) {
            expect(err.statusCode).toBe(400, "Response error status code");
            done();
        }
    });

});