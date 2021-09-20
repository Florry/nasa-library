import { API_ROOT } from "../constants/constants";

/**
 * Generic http client
 */
export default class HttpClient {

	jwtToken: string | undefined;

	constructor(jwtToken?: string) {
		this.jwtToken = jwtToken;
	}

	/**
	 * Generic get request
	 */
	protected get(path: string) {
		return this.request("GET", path);
	}

	/**
	 * Generic post request
	 */
	protected post(path: string, body?: any) {
		return this.request("POST", path, body);
	}

	/**
	 * Generic delete request
	 */
	protected delete(path: string, body?: any) {
		return this.request("DELETE", path, body);
	}

	/**
	 * Generic put request
	 */
	protected put(path: string, body?: any) {
		return this.request("PUT", path, body);
	}

	/**
	 * Generic request
	 */
	protected async request(method: string, path: string, body: any = null): Promise<any> {
		const options: any = {
			method: method,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			}
		};

		if (typeof window === "undefined")
			options.headers = { ...options.headers, Authorization: `Bearer ${this.jwtToken}` };

		if (body)
			options.body = JSON.stringify(body);

		try {
			const response = await fetch(API_ROOT + path, options);

			let responseBody = {};

			try {
				responseBody = await response.json();
			} catch (err) { }

			if (response.status >= 400)
				throw responseBody;

			return responseBody;
		} catch (err) {
			throw err;
		}
	}
}
