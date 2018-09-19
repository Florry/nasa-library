import Constants from "../../Constants";

let accesstoken = window.localStorage.getItem("accesstoken") || "";

/**
 * Generic http client
 */
export default class HttpClient {

    /**
     * Generic get request
     * 
     * @param {String} path path to get
     * @param {Boolean=} mustBeLoggedIn whether or not you have to be logged in (if accesstoken should be sent or not)
     */
    static _get(path, mustBeLoggedIn = false) {
        return this._request("GET", path, null, mustBeLoggedIn);
    }

    /**
     * Generic post request
     * 
     * @param {String} path path to post to
     * @param {Object} body request body
     * @param {Boolean} mustBeLoggedIn whether or not you have to be logged in (if accesstoken should be sent or not)
     * @param {Boolean} authCall if call is an authentication call; alters accesstoken in any way.
     */
    static _post(path, body, mustBeLoggedIn = false, authCall = false) {
        return this._request("POST", path, body, mustBeLoggedIn, authCall);
    }

    /**
     * Generic delete request
     * 
     * @param {String} path path to delete to
     * @param {Object} body request body
     * @param {Boolean} mustBeLoggedIn whether or not you have to be logged in (if accesstoken should be sent or not)
     */
    static _delete(path, body, mustBeLoggedIn = false) {
        return this._request("DELETE", path, body, mustBeLoggedIn);
    }

    /**
     * Generic put request
     * 
     * @param {String} path path to put to
     * @param {Object} body request body
     * @param {Boolean} mustBeLoggedIn whether or not you have to be logged in (if accesstoken should be sent or not)
     */
    static _put(path, body, mustBeLoggedIn = false) {
        return this._request("PUT", path, body, mustBeLoggedIn);
    }

    /**
     * Generic request
     * 
     * @param {String} method method to use
     * @param {String} path path to send request to
     * @param {Object=} body request body
     * @param {Boolean=} mustBeLoggedIn whether or not you have to be logged in (if accesstoken should be sent or not)
     * @param {Boolean=} authCall if call is an authentication call; alters accesstoken in any way.
     */
    static async _request(method, path, body = null, mustBeLoggedIn, authCall) {
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        };

        if (mustBeLoggedIn)
            options.headers["Authentication"] = `Bearer ${window.localStorage.getItem("accesstoken")}`;

        if (body)
            options.body = JSON.stringify(body);

        try {
            const response = await fetch(Constants.API_ROOT + path, options);

            if (response.status === 401)
                HttpClient._clearAccessToken();

            let responseBody = {};

            try {
                responseBody = await response.json();
            } catch (err) { }

            if (response.status >= 400)
                throw responseBody;

            if (authCall) {
                accesstoken = response.headers.get("accesstoken");
                /** We would want to store this more safely in a real situation */
                window.localStorage.setItem("accesstoken", accesstoken);
            }

            return responseBody;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Clears the accesstoken and reloads page
     */
    static _clearAccessToken() {
        if (accesstoken !== "") {
            accesstoken = "";
            localStorage.clear();
            window.location.reload();
        }
    }
}
