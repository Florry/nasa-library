import Constants from "../../Constants";

let accesstoken = ""; // TODO: Maybe encrypt this before saving in localstorage?

export default class APIClient {

    static _get(path) {
        return this._request("GET", path);
    }

    static _post(path, body, secure = false) {
        return this._request("POST", path, body, secure);
    }

    static _put(path, body) {
        return this._request("PUT", path, body);
    }

    static async _request(method, path, body = null, secure) {
        const options = {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        };

        if (secure)
            options.headers["Authentication"] = `Bearer ${window.localStorage.getItem("accesstoken")}`;

        if (body)
            options.body = JSON.stringify(body);

        try {
            const response = await fetch(Constants.API_ROOT + path, options);
            accesstoken = response.headers.get("accesstoken");

            // TODO: look at how this should be saved
            window.localStorage.setItem("accesstoken", accesstoken);

            if (response.status == 401)
                APIClient._clearAccessToken();

            const responseBody = await response.json();

            if (response.status >= 400)
                throw responseBody;

            return responseBody;
        } catch (err) {
            throw err;
        }
    }

    static _clearAccessToken() {
        accesstoken = "";
        localStorage.clear();
        window.location.reload();
    }
}
