import {
	ADD_FAVORITE,
	GET_FAVORITES,
	GET_MEDIA_BY_ID,
	GET_MEDIA_METADATA,
	LOGIN,
	LOGOUT,
	MEDIA_SEARCH,
	REGISTER,
	REMOVE_FAVORITE
} from "../constants/nasa-api-constants";
import { MediaItem } from "../models/MediaItem";
import HttpClient from "./HttpClient";

/**
 * Http client for contacting the nasa library api
 */
export default class APIClient extends HttpClient {

	/**
	 * Registers an account
	 */
	async register(username, password) {
		return await this.post(REGISTER, { username, password });
	}

	/**
	 * Logs in a user
	 */
	async login(username, password) {
		return await this.post(LOGIN, { username, password });
	}

	/**
	 * Logs out the logged in user and clears the access token
	 */
	async logout() {
		try {
			await this.post(LOGOUT);
		} catch (err) {
			throw err;
		}
	}

	/** Media endpoints */

	/**
	 * Searches for media with inputted query
	 */
	async searchMedia(query): Promise<{ data: { items: MediaItem[], totalItems: number } }> {
		const queryString = APIClient.toQueryString(query);
		return await this.get(`${MEDIA_SEARCH}${queryString}`);
	}

	/**
	 * Gets media by its id
	 */
	async getMediaById(nasaId) {
		// TODO: ids contain ´ sometimes and that doesn't work with encodeURI
		return await this.get(`${GET_MEDIA_BY_ID}`.replace(":nasaId", encodeURI(nasaId)));
	}

	/**
	 * Gets media metadata by its id
	 */
	async getMediaMetadata(nasaId) {
		return await this.get(`${GET_MEDIA_METADATA}`.replace(":nasaId", encodeURI(nasaId)));
	}

	/** Favorites endpoints */

	/**
	 * Adds favorite for user
	 */
	async addFavorite(nasaId, asset) {
		return await this.post(ADD_FAVORITE, { nasaId, asset });
	}

	/**
	 * Removes a favorite by its (nasa) id
	 */
	async removeFavorite(nasaId) {
		return await this.delete(REMOVE_FAVORITE.replace(":nasaId", encodeURI(nasaId)));
	}

	/**
	 * Gets favorites of the logged in user
	 */
	async getFavorites() {
		return await this.get(GET_FAVORITES);
	}

	/**
	 * Converts a query object to a query string
	 */
	private static toQueryString(query) {
		let queryString = "";

		Object.keys(query).forEach((queryKey, i) => {
			if (query[queryKey]) {
				if (i !== 0)
					queryString += "&";
				queryString += `${queryKey}=${query[queryKey]}`;
			}
		});

		if (queryString.length > 0)
			queryString = "?" + queryString;

		return queryString;
	}

}
