import Constants from "../../Constants";

let accesstoken = "";

export default class HttpClient {

    static _get(path, loggedIn = false) {
        return this._request("GET", path, null, loggedIn);
    }

    static _post(path, body, loggedIn = false) {
        return this._request("POST", path, body, loggedIn);
    }
    static _delete(path, body, loggedIn = false) {
        return this._request("DELETE", path, body, loggedIn);
    }

    static _put(path, body, loggedIn = false) {
        return this._request("PUT", path, body, loggedIn);
    }

    static async _request(method, path, body = null, loggedIn) {
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        };

        if (loggedIn)
            options.headers["Authentication"] = `Bearer ${window.localStorage.getItem("accesstoken")}`;

        if (body)
            options.body = JSON.stringify(body);

        try {
            const response = await fetch(Constants.API_ROOT + path, options);

            if (response.status === 401) {
                HttpClient._clearAccessToken();
            }

            const responseBody = await response.json();

            if (response.status >= 400)
                throw responseBody;

            accesstoken = response.headers.get("accesstoken");

            /** We would want to store this more safely in a real situation */
            window.localStorage.setItem("accesstoken", accesstoken);

            return responseBody;
        } catch (err) {
            throw err;
        }
    }

    static _clearAccessToken() {
        if (accesstoken !== "") {
            accesstoken = "";
            localStorage.clear();
            window.location.reload();
        }
    }
}
