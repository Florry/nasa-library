const config = require("../../config");
const request = require("request");
const mongo = require("mongodb");
const SpecConstants = require("./SpecConstants");

class SpecUtils {

    constructor() { }

    /**
     * Cleans up data created during the tests
     * 
     * @return {Promise<Void>}
     */
    static async clearDatabases() {
        const db = await mongo.connect(SpecConstants.MONGO_SPEC_URL);
        await Promise.all((await db.collections()).map(collection => collection.drop()));
        await db.dropDatabase();
    }

    /**
     * @param {String} path 
     * @param {Object} body 
     * 
     * @return {Promise<Object>}
     */
    static async post(path, body) {
        return new Promise((resolve, reject) => {
            request.post(`http://localhost:${config.backendPort}${path}`, {
                json: body,
                callback: (error, response) => {
                    if (response.statusCode >= 300)
                        reject(response.toJSON());

                    if (error)
                        reject(error);
                    else
                        resolve(response.toJSON());
                }
            });
        });
    }

    /**
     * @param {Number} milliseconds 
     * 
     * @return {Promise<Void>}
     */
    static delay(milliseconds) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), milliseconds);
        });
    }
}

module.exports = SpecUtils;