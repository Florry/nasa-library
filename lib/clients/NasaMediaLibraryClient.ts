import request from "request";
import { SearchQuery } from "../models/SearchQuery";

/**
 * Service client for contacting the nasa api
 */
export class NasaMediaLibraryClient {

	static get API_ROOT() {

		return "https://images-api.nasa.gov";

	}

	/**
	 * The endpoints of the nasa api
	 */
	static get endpoints() {

		return {

			SEARCH: "/search",
			GET_ASSET_BY_ID: "/asset/:nasa_id",
			GET_METADATA: "/metadata/:nasa_id"

		};

	}

	/**
	 * Searches assets by a number of queries
	 *
	 * @param {SearchQuery} query query object
	 *
	 * @return {Promise<Object>} search results
	 */
	static async searchAssets(query: SearchQuery) {
		const queryString = query.toQueryString();
		return await NasaMediaLibraryClient._get(`${NasaMediaLibraryClient.API_ROOT}${NasaMediaLibraryClient.endpoints.SEARCH}${queryString}`);
	}

	/**
	 * Gets a nasa asset by its (nasa) id
	 *
	 * @param {String} nasaId the id of the asset to get
	 *
	 * @return {Promise<Object>} the asset
	 */
	static async getAsset(nasaId: string) {
		return await NasaMediaLibraryClient._get(`${NasaMediaLibraryClient.API_ROOT}${NasaMediaLibraryClient.endpoints.GET_ASSET_BY_ID}`.replace(":nasa_id", nasaId));
	}

	/**
	 * Gets metadata for an asset by its (nasa) id.
	 * Gets metadata local and then fetches that json data from the location.
	 *
	 * @param {String} nasaId the id of the asset to get metadata for
	 *
	 * @return {Promise<Object>} metadata
	 */
	static async getMetadata(nasaId: string) {
		const metadataLocationObj: any = await NasaMediaLibraryClient._get(`${NasaMediaLibraryClient.API_ROOT}${NasaMediaLibraryClient.endpoints.GET_METADATA}`.replace(":nasa_id", nasaId));

		if (metadataLocationObj.location) {
			const metadata = await NasaMediaLibraryClient._get(metadataLocationObj.location);
			return metadata;
		} else
			return metadataLocationObj;
	}

	/**
	 * Does a generic get request and returns response as a promise
	 *
	 * @param {String} path
	 *
	 * @return {Promise<Object>} response body
	 */
	static _get(path: string) {
		return new Promise((resolve, reject) => {
			request.get(path, {
				callback: (error: Error, response: any) => {
					if (error)
						reject(error);
					else {
						let body;

						try {
							body = JSON.parse(response.toJSON().body);
						} catch (err) {
							body = response.toJSON().body;
						}

						resolve(body);
					}
				}
			});
		});
	}

}
