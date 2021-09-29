import { Server } from "http";
import mongodb, { Db } from "mongodb";
import { MONGO_SPEC_URL } from "./support/spec-constants";
import { AUTHENTICATION_TOKEN_NAME, AUTHENTICATION_TOKEN_NAME_OUT } from "../lib/constants/autentication-constants";
import { ADD_FAVORITE, REMOVE_FAVORITE } from "../lib/constants/endpoint-constants";
import { FAVORITES } from "../lib/constants/collection-constants";
import { start } from "../server";
import { clearDatabases, createUserAccount, deleteRequest, login, post } from "./support/spec-utils";

describe("RemoveFavoriteHandler", () => {

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

	it("should be possible to remove favorite", async () => {
		try {
			const nasaId = "hello-nasa";
			const asset = {
				data: [],
				links: [],
				href: "https://images-assets.nasa.gov/image/NASA 60th_SEAL_BLACK_300DPI/collection.json"
			};

			await createUserAccount();

			const loginResponse = await login();
			const accesstoken = loginResponse.headers[AUTHENTICATION_TOKEN_NAME_OUT];

			const requestHeaders: Record<string, string> = {};
			requestHeaders[AUTHENTICATION_TOKEN_NAME] = `Bearer ${accesstoken}`;

			await post(ADD_FAVORITE, { nasaId, asset }, requestHeaders);

			const removeFavoriteResponse = await deleteRequest(REMOVE_FAVORITE.replace(":nasaId", nasaId), requestHeaders);

			expect(removeFavoriteResponse.body.favoriteRemoved).toBeTruthy("Should return flag favoriteRemoved true");

			const dbContents = await db.collection(FAVORITES).findOne({});

			expect(dbContents).toBe(null, "Database should be empty");
		} catch (err) {
			console.error(err);
			fail();
		}
	});

	it("should not be possible to remove favorite without being logged in", async () => {
		try {
			const nasaId = "hello-nasa";
			const asset = {
				data: [],
				links: [],
				href: "https://images-assets.nasa.gov/image/NASA 60th_SEAL_BLACK_300DPI/collection.json"
			};

			await createUserAccount();

			await login();
			await post(ADD_FAVORITE, { nasaId, asset });

			fail();
		} catch (err: any) {
			expect(err.statusCode).toBe(400, "Status should be 400");
		}
	});

	it("should return not found if favorite cannot be found", async () => {
		try {
			const nasaId = "hello-nasa";

			await post(REMOVE_FAVORITE, { nasaId });

			fail();
		} catch (err: any) {
			expect(err.statusCode).toBe(404, "Status should be 404");
		}
	});

});
