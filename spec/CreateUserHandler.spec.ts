import { Server } from "http";
import mongodb, { Db } from "mongodb";
import { USERS } from "../lib/constants/collection-constants";
import { CREATE_USER } from "../lib/constants/endpoint-constants";
import { start } from "../server";
import { MONGO_SPEC_URL, UUID_REGEXP } from "./support/SpecConstants";
import SpecUtils from "./support/SpecUtils";

describe("CreateUserHandler", () => {

	let server: Server;

	let db: Db;

	beforeEach(async () => {
		db = await mongodb.connect(MONGO_SPEC_URL);
		server = await start(MONGO_SPEC_URL);
	});

	afterEach(async () => {
		await server.close();
		await SpecUtils.clearDatabases();
	});

	it("should be possible to create user", async () => {
		try {
			const username = "user1";
			const password = "Localhost:3030";
			const response = await SpecUtils.post(CREATE_USER, { username, password });

			expect(response.body.username).toBe(username, "username should be the same as was sent in");
			expect(response.body.id).toBeDefined("should have a generated id");
			expect(UUID_REGEXP.test(response.body.id)).toBeTruthy("id should be uuid");

			const dbResponse = await db.collection(USERS).find().toArray();

			expect(dbResponse[0].id).toBe(response.body.id, "created user in database should have the same id as the one that was returned");
			expect(dbResponse[0].username).toBe(response.body.username, "created user in database should have the same username as the one that was returned");
			expect(dbResponse[0].salt).toBeDefined();
			expect(dbResponse[0].hashedPassword).toBeDefined();
			expect(dbResponse[0].metadata).toBeDefined();
		} catch (err: any) {
			console.error("error", err);
		}
	});

	it("each user should have its own unique salt", async () => {
		try {
			const username = "user";
			const password = "Localhost:3030";

			for (let i = 0; i < 10; i++)
				await SpecUtils.post(CREATE_USER, { username: username + i, password });

			const dbResponse = await db.collection(USERS).find().toArray();
			const salts = dbResponse.map(r => r.salt);

			salts.forEach(salt => {
				let matchingSalts = 0;

				for (let j = 0; j < salts.length; j++) {
					if (salts[j] === salt)
						matchingSalts++;
				}

				expect(matchingSalts).toBe(1, "should only find one matchin salt");
			});
		} catch (err: any) {
			console.error("error", err);
		}
	});

	it("should not be possible to send in invalid request body", async () => {
		try {
			await SpecUtils.post(CREATE_USER, { user: "hello", firstName: "bob" });

			fail();
		} catch (err: any) {
			expect(err.statusCode).toBe(500);
		}
	});

	it("should not be possible to send in invalid request body types", async () => {
		try {
			await SpecUtils.post(CREATE_USER, { username: "hello", password: 133 });

			fail();
		} catch (err: any) {
			expect(err.statusCode).toBe(500);
		}
	});

	it("should not be possible to register with invalid password", async () => {
		try {
			await SpecUtils.post(CREATE_USER, { username: "hello", password: "12" });

			fail();
		} catch (err: any) {
			expect(err.statusCode).toBe(400);
		}
	});

});
