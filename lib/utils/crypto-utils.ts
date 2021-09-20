import crypto from "crypto";

/**
 * Crypto related util functions
 */

/**
 * A async/await wrapper for the crypto.randomBytes function
 */
export function randomBytes(numberOfBytes: number): Promise<string> {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(numberOfBytes, (err, buffer) => {
			if (err)
				reject(err);

			resolve(buffer.toString("hex"));
		});
	});
}
