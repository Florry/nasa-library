import Constants from "../../Constants";
import HttpClient from "./HttpClient";

const IS_AUTH_CALL = true;

/**
 * Http client for contacting the nasa library api
 */
export default class APIClient extends HttpClient {

    /**
     * Registers an account
     * 
     * @param {String} username username to register account with
     * @param {String} password password to register account with
     * 
     * @return {Promise<Object>}
     */
    static async register(username, password) {
        return await this._post(Constants.apiEndpoints.REGISTER, { username, password });
    }

    /**
     * Logs in a user
     * 
     * @param {String} username username of user to login with
     * @param {String} password password of user to login with
     * 
     * @return {Promise<Object>}
     */
    static async login(username, password) {
        return await this._post(Constants.apiEndpoints.LOGIN, { username, password }, false, IS_AUTH_CALL);
    }

    /**
     * Logs out the logged in user and clears the access token
     */
    static async logout() {
        try {
            await this._post(Constants.apiEndpoints.LOGOUT, null, true, IS_AUTH_CALL);
            APIClient._clearAccessToken();
        } catch (err) {
            throw err;
        }
    }

    /** Media endpoints */

    /**
     * Searches for media with inputted query
     * 
     * @param {Object} query query to search with
     * 
     * @return {Promise<Object>}
     */
    static async searchMedia(query) {
        const queryString = APIClient._toQueryString(query);
        return await this._get(`${Constants.apiEndpoints.MEDIA_SEARCH}${queryString}`, true);
    }

    /**
     * Gets media by its id
     * 
     * @param {String} nasaId the (nasa) id of the media to get
     *
     * @return {Promise<Object>}
     */
    static async getMediaById(nasaId) {
        return await this._get(`${Constants.apiEndpoints.GET_MEDIA_BY_ID}`.replace(":nasaId", encodeURI(nasaId)), true);
    }

    /**
     * Gets media metadata by its id
     * 
     * @param {String} nasaId the (nasa) id of the media to get metadata for
     * 
     * @return {Promise<Object>}
     */
    static async getMediaMetadata(nasaId) {
        return await this._get(`${Constants.apiEndpoints.GET_MEDIA_METADATA}`.replace(":nasaId", encodeURI(nasaId)), true);
    }

    /** Favorites endpoints */

    /**
     * Adds favorite for user
     * 
     * @param {String} nasaId (nasa) id of the media to add as favorite
     * @param {Object} asset the data of the media to add as favorite, not the best solution but see AddFavoriteHandler.js for more details 
     * 
     * @return {Promise<Object>}
     */
    static async addFavorite(nasaId, asset) {
        return await this._post(Constants.apiEndpoints.ADD_FAVORITE, { nasaId, asset }, true);
    }

    /**
     * Removes a favorite by its (nasa) id
     * 
     * @param {String} nasaId the (nasa) id of the favorite to remove
     * 
     * @return {Promise<Object>}
     */
    static async removeFavorite(nasaId) {
        return await this._delete(Constants.apiEndpoints.REMOVE_FAVORITE.replace(":nasaId", encodeURI(nasaId)), null, true);
    }

    /**
     * Gets favorites of the logged in user
     * 
    * @return {Promise<Array<Object>>}
     */
    static async getFavorites() {
        // @ts-ignore
        return await this._get(Constants.apiEndpoints.GET_FAVORITES, true);
    }

    /**
     * Converts a query object to a query string
     * 
     * @param {Object} query 
     * 
     * @return {String}
     */
    static _toQueryString(query) {
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