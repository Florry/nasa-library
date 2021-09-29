import mongodb from "mongodb";
import request from "request";
import { BACKEND_PORT } from "../../config";
import { CREATE_USER, LOGIN } from "../../lib/constants/endpoint-constants";
import { MONGO_SPEC_URL } from "./SpecConstants";

interface RequestResponseBody {

	body: Record<string, any>;

	headers: Record<string, any>;

	statusCode: number;

}

export default class SpecUtils {

	constructor() { }

	/**
	 * Cleans up data created during the tests
	 *
	 * @return {Promise<Void>}
	 */
	static async clearDatabases() {
		const db = await mongodb.connect(MONGO_SPEC_URL);
		await Promise.all((await db.collections()).map((collection: any) => collection.drop()));
		await db.dropDatabase();
	}

	/**
	 * @param {String} path
	 * @param {Object=} body
	 * @param {Object=} headers
	 *
	 * @return {Promise<Object>}
	 */
	static async post(path: string, body = {}, headers = {}) {
		return SpecUtils._request("post", path, body, headers);
	}

	/**
	 * @param {String} path
	 * @param {Object=} headers
	 *
	 * @return {Promise<Object>}
	 */
	static async delete(path: string, headers = {}) {
		return SpecUtils._request("delete", path, {}, headers);
	}

	static async _request(method: string, path: string, body: Record<string, any>, headers: Record<string, string>): Promise<RequestResponseBody> {
		return new Promise((resolve, reject) => {
			request(`http://localhost:${BACKEND_PORT}${path}`, {
				json: body,
				headers,
				method,
				callback: (error: any, response: any) => {
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
		return await SpecUtils.post(CREATE_USER, { username, password });
	}

	/**
	 * @param {String} username
	 * @param {String} password
	 */
	static async login(username = "username", password = "Localhost:8080") {
		return await SpecUtils.post(LOGIN, { username, password });
	}

	/**
	 * @param {Number} milliseconds
	 *
	 * @return {Promise<Void>}
	 */
	static delay(milliseconds: number) {
		return new Promise<void>(resolve => {
			setTimeout(() => resolve(), milliseconds);
		});
	}
}
