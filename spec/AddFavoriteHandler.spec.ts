import { Server } from "http";
import mongodb, { Db } from "mongodb";
import { AUTHENTICATION_TOKEN_NAME, AUTHENTICATION_TOKEN_NAME_OUT } from "../lib/constants/autentication-constants";
import { FAVORITES } from "../lib/constants/collection-constants";
import { ADD_FAVORITE } from "../lib/constants/endpoint-constants";
import { start } from "../server";
import { MONGO_SPEC_URL } from "./support/spec-constants";
import { clearDatabases, createUserAccount, login, post } from "./support/spec-utils";

describe("AddFavoriteHandler", () => {

	let server: Server;

	let db: Db;

	beforeEach(async () => {
		db = await mongodb.connect(MONGO_SPEC_URL);
		server = await start(MONGO_SPEC_URL);
	});

	afterEach(async () => {
		await clearDatabases();
		await server.close();
	});

	it("should be possible to add favorite", async () => {
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

			await createUserAccount();

			const loginResponse: any = await login();
			const accesstoken = loginResponse.headers[AUTHENTICATION_TOKEN_NAME_OUT];

			const requestHeaders: Record<string, any> = {};
			requestHeaders[AUTHENTICATION_TOKEN_NAME] = `Bearer ${accesstoken}`;

			const addFavoriteResponse = await post(ADD_FAVORITE, { nasaId, asset }, requestHeaders);

			expect(addFavoriteResponse.body.userId).toBe(loginResponse.body.id, "addFavoriteResponse.body.userId");
			expect(addFavoriteResponse.body.nasaId).toBe(nasaId, "addFavoriteResponse.body.nasaId");
			expect(addFavoriteResponse.body.asset.data[0].title).toBe(asset.data[0].title, "addFavoriteResponse.body.asset.title");
			expect(addFavoriteResponse.body.asset.data[0].description).toBe(asset.data[0].description, "addFavoriteResponse.body.asset.description");

			const [dbContents] = await db.collection(FAVORITES).find({}).toArray();

			expect(dbContents.userId).toBe(loginResponse.body.id, "dbContents.userId");
			expect(dbContents.nasaId).toBe(nasaId, "dbContents.nasaId");
			expect(dbContents.asset.data[0].title).toBe(asset.data[0].title, "dbContents.asset.title");
			expect(dbContents.asset.data[0].description).toBe(asset.data[0].description, "dbContents.asset.description");
		} catch (err) {
			console.error(err);
		}
	});

	it("should not be possible to add favorites when not being logged in", async () => {
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

			await post(ADD_FAVORITE, { nasaId, asset });

			fail();
		} catch (err: any) {
			expect(err.statusCode).toBe(400, "Response error status code");
		}
	});

});
