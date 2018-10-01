const config = require("../../config");
const request = require("request");
const mongo = require("mongodb");
const SpecConstants = require("./SpecConstants");
const constants = require("../../lib/constants");

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
     * @param {Object=} body 
     * @param {Object=} headers 
     * 
     * @return {Promise<Object>}
     */
    static async post(path, body = {}, headers = {}) {
        return SpecUtils._request("post", path, body, headers);
    }

    /**
     * @param {String} path 
     * @param {Object=} headers 
     * 
     * @return {Promise<Object>}
     */
    static async delete(path, headers = {}) {
        return SpecUtils._request("delete", path, {}, headers);
    }

    static async _request(method, path, body, headers) {
        return new Promise((resolve, reject) => {
            request[method](`http://localhost:${config.backendPort}${path}`, {
                json: body,
                headers,
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
     * @param {String} username 
     * @param {String} password 
     */
    static async createUserAccount(username = "username", password = "Localhost:8080") {
        return await SpecUtils.post(constants.endpoints.CREATE_USER, { username, password });
    }

    /**
     * @param {String} username 
     * @param {String} password 
     */
    static async login(username = "username", password = "Localhost:8080") {
        return await SpecUtils.post(constants.endpoints.LOGIN, { username, password });
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