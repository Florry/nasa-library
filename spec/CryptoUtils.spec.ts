import { randomBytes } from "../lib/utils/crypto-utils";

describe("CryptoUtils", () => {

	it("Should resolve await", async () => {
		try {
			const generatedRandomBytes = await randomBytes(200);

			expect(typeof generatedRandomBytes === "object").toBeFalsy();
			expect(generatedRandomBytes.length).toBe(400, "generatedRandomBytes.length");
		} catch (err: any) {
			console.error(err);
			fail(err);
		}
	});

});
