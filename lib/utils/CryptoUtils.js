const crypto = require("crypto");

/**
 * Crypto related util functions
 */
class CryptoUtils {

    /**
     * A async/await wrapper for the crypto.randomBytes function
     * 
     * @param {Number} numberOfBytes
     * 
     * @return {Promise<String>}
     */
    static randomBytes(numberOfBytes) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(numberOfBytes, (err, buffer) => {
                if (err)
                    reject(err);

                resolve(buffer.toString("hex"));
            });
        });
    }

}

module.exports = CryptoUtils