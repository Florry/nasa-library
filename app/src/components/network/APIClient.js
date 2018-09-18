import Constants from "../../Constants";
import HttpClient from "./HttpClient";

export default class APIClient extends HttpClient {

    static async register(username, password) {
        return await this._post(Constants.apiEndpoints.REGISTER, { username, password });
    }

    static async login(username, password) {
        return await this._post(Constants.apiEndpoints.LOGIN, { username, password });
    }

    static async logout() {
        try {
            await this._post(Constants.apiEndpoints.LOGOUT, null, true);
            APIClient._clearAccessToken();
        } catch (err) {
            throw err;
        }
    }

    /** Media endpoints */

    static async searchMedia(query) {
        const queryString = APIClient._toQueryString(query);
        return await this._get(`${Constants.apiEndpoints.MEDIA_SEARCH}${queryString}`, true);
    }

    /**
     * @param {String} nasaId 
     */
    static async getMediaById(nasaId) {
        return await this._get(`${Constants.apiEndpoints.GET_MEDIA_BY_ID}`.replace(":nasaId", nasaId), true);
    }

    /** Favorites endpoints */

    /**
     * @param {String} nasaId 
     * @param {Object} asset 
     */
    static async addFavorite(nasaId, asset) {
        return await this._post(Constants.apiEndpoints.ADD_FAVORITE, { nasaId, asset }, true);
    }

    static async removeFavorite(nasaId) {
        return await this._delete(Constants.apiEndpoints.REMOVE_FAVORITE.replace(":nasaId", nasaId), null, true);
    }

    static async getFavorites() {
        return await this._get(Constants.apiEndpoints.GET_FAVORITES, true);
    }

    /**
     * @param {Object} query 
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