import mongodb from "mongodb";
import request from "request";
import { BACKEND_PORT } from "../../config";
import { CREATE_USER, LOGIN } from "../../lib/constants/endpoint-constants";
import { MONGO_SPEC_URL } from "./spec-constants";

interface RequestResponseBody {

	body: Record<string, any>;

	headers: Record<string, any>;

	statusCode: number;

}


/**
 * Cleans up data created during the tests
 */
export async function clearDatabases() {
	const db = await mongodb.connect(MONGO_SPEC_URL);
	await Promise.all((await db.collections()).map((collection: any) => collection.drop()));
	await db.dropDatabase();
}

export async function post(path: string, body = {}, headers = {}) {
	return _request("post", path, body, headers);
}

export async function deleteRequest(path: string, headers = {}) {
	return _request("delete", path, {}, headers);
}

async function _request(method: string, path: string, body: Record<string, any>, headers: Record<string, string>): Promise<RequestResponseBody> {
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

export async function createUserAccount(username: string = "username", password: string = "Localhost:8080") {
	return await post(CREATE_USER, { username, password });
}

export async function login(username: string = "username", password: string = "Localhost:8080") {
	return await post(LOGIN, { username, password });
}

export function delay(milliseconds: number) {
	return new Promise<void>(resolve => {
		setTimeout(() => resolve(), milliseconds);
	});
}
