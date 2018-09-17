import Constants from "../../Constants";
import APIClient from "./APIClient";

export default class AppAPIClient extends APIClient {

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

}
