import Constants from "../../Constants";

let accesstoken = ""; // TODO: Maybe encrypt this before saving in localstorage?

export default class APIClient {

    static _get(path, loggedIn = false) {
        return this._request("GET", path, loggedIn);
    }

    static _post(path, body, loggedIn = false) {
        return this._request("POST", path, body, loggedIn);
    }

    static _put(path, body, loggedIn = false) {
        return this._request("PUT", path, body, loggedIn);
    }

    static async _request(method, path, body = null, loggedIn) {
        const options = {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        };

        if (loggedIn)
            options.headers["Authentication"] = `Bearer ${window.localStorage.getItem("accesstoken")}`;

        if (body)
            options.body = JSON.stringify(body);

        try {
            const response = await fetch(Constants.API_ROOT + path, options);
            accesstoken = response.headers.get("accesstoken");

            // TODO: look at how this should be saved
            window.localStorage.setItem("accesstoken", accesstoken);

            if (response.status === 401)
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
