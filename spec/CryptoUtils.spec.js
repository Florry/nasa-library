const CryptoUtils = require("../lib/utils/CryptoUtils");

describe("CryptoUtils", () => {

    it("Should resolve await", async done => {
        try {
            const randomBytes = await CryptoUtils.randomBytes(200);

            expect(typeof randomBytes === "object").toBeFalsy();
            expect(randomBytes.length).toBe(400, "randomBytes.length");

            done();
        } catch (err) {
            console.error(err);
            done.fail(err);
        }
    });

});