const request = require("request");
const SearchQuery = require("../models/SearchQuery");

class NasaMediaLibraryClient {

    static get API_ROOT() {

        return "https://images-api.nasa.gov";

    }

    static get endpoints() {

        return {

            SEARCH: "/search",
            GET_ASSET_BY_ID: "/asset/:nasa_id",
            GET_METADATA: "/metadata/:nasa_id"

        };

    }

    /**
     * @param {SearchQuery} query 
     */
    static async searchAssets(query) {
        const queryString = query.toQueryString();
        return await NasaMediaLibraryClient._get(`${NasaMediaLibraryClient.API_ROOT}${NasaMediaLibraryClient.endpoints.SEARCH}${queryString}`);
    }

    static async getAsset(nasaId) {
        return await NasaMediaLibraryClient._get(`${NasaMediaLibraryClient.API_ROOT}${NasaMediaLibraryClient.endpoints.GET_ASSET_BY_ID}`.replace(":nasa_id", nasaId));
    }

    static async getMetadata(nasaId) {
        const metadataLocationObj = await NasaMediaLibraryClient._get(`${NasaMediaLibraryClient.API_ROOT}${NasaMediaLibraryClient.endpoints.GET_METADATA}`.replace(":nasa_id", nasaId));
        const metadata = await NasaMediaLibraryClient._get(metadataLocationObj.location);

        return metadata;
    }

    static async getCaption(nasaId) { }

    static _get(path) {
        return new Promise((resolve, reject) => {
            request.get(path, {
                callback: (error, response) => {
                    if (error)
                        reject(error);
                    else {
                        let body;

                        try {
                            body = JSON.parse(response.toJSON().body);
                        } catch (err) {
                            body = response.toJSON().body
                        }

                        resolve(body);
                    }
                }
            });
        });
    }

}

module.exports = NasaMediaLibraryClient;

// ?api_key=${constants.NASA_API_KEY}