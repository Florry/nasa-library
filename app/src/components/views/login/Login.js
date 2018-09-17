import React from "react";
import "./Login.css";
import AppAPIClient from "../../network/AppAPIClient";
import Constants from "../../../Constants";

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
        return (
            <div className="login">
                <h2>Login</h2>

                <form onSubmit={async e => await this._login(e)}>
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
        );
    }

    /**
     * @param {React.SyntheticEvent<HTMLFormElement>} e 
     */
    async  _login(e) {
        e.preventDefault();

        try {
            await AppAPIClient.login(this.state.credentials.username, this.state.credentials.password);

            //TODO: fix better solution!
            window.location.hash = Constants.views.MEDIA_SEARCH;
            window.location.reload();
        } catch (err) {
            this.setState({ ...this.state, serverError: err.message ? err.message : err });
        }
    }

}
