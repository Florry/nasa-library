import React from "react";
import "./Login.css";
import { Redirect } from "react-router-dom";
import APIClient from "../../network/APIClient";
import Constants from "../../../Constants";
import { AppContext } from "../../../AppContext";

/**
 * Login view
 */
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
                {(appState) => (

                    <div className="login">
                        <h2>Login</h2>

                        <form onSubmit={async e => {
                            try {
                                await this._login(e);

                                if (this.state.submitSucessful)
                                    appState.setLoggedIn();
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
     * Logs in using the inputted username and password in the inputs in the markup
     * 
     * @param {React.SyntheticEvent<HTMLFormElement>} e 
     */
    async _login(e) {
        e.preventDefault();

        try {
            const resp = await APIClient.login(this.state.credentials.username, this.state.credentials.password);
            this.setState({ ...this.state, submitSucessful: true });
            return resp;
        } catch (err) {
            this.setState({ ...this.state, serverError: err.message ? err.message : err });
        }
    }

}
