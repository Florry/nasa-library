import React from "react";
import "./Login.css";
import { Redirect } from "react-router-dom";
import AppAPIClient from "../../network/AppAPIClient";
import Constants from "../../../Constants";
import { AppContext } from "../../../AppContext";

export default class Login extends React.Component {

    state = {
        credentials: {
            username: "",
            password: ""
        },
        serverError: null,
        submitSucessful: false
    };

    render() {
        if (this.state.submitSucessful)
            return <Redirect to={Constants.views.MEDIA_SEARCH} />

        return (
            <AppContext.Consumer>
                {(state) => (

                    <div className="login">
                        <h2>Login</h2>

                        {/* TODO: REMOVE THIS */} Localhost:8080

                        <form onSubmit={async e => {
                            try {
                                const resp = await this._login(e);
                                if (this.state.submitSucessful)
                                    state.setLoggedIn(resp);
                            } catch (err) { }
                        }}>
                            <input
                                className="login__input"
                                placeholder="username"
                                type="text"
                                onChange={e => { this.setState({ credentials: { ...this.state.credentials, username: e.target.value } }) }}
                            />

                            <input
                                className="login__input"
                                placeholder="password"
                                type="password"
                                ref={ref => this.password = ref}
                                onChange={e => { this.setState({ credentials: { ...this.state.credentials, password: e.target.value } }) }}
                            />

                            <button
                                type="submit">
                                Login
                            </button>

                            <div
                                className="login__error-panel"
                                hidden={this.state.serverError == null}>
                                <p
                                    className="login__error-panel--error">
                                    {this.state.serverError}
                                </p>
                            </div>
                        </form>
                    </div>

                )}
            </AppContext.Consumer>
        );
    }

    /**
     * @param {React.SyntheticEvent<HTMLFormElement>} e 
     */
    async  _login(e) {
        e.preventDefault();

        try {
            const resp = await AppAPIClient.login(this.state.credentials.username, this.state.credentials.password);
            this.setState({ ...this.state, submitSucessful: true });
            return resp;
        } catch (err) {
            //TODO: casts AbortError "The operation was aborted"
            console.log("\n");
            console.log("=======================================");
            console.log("err");
            console.log("=======================================");
            console.log(require("util").inspect(err, null, null, true));
            console.log("\n");
            this.setState({ ...this.state, serverError: err.message ? err.message : err });
        }
    }

}
