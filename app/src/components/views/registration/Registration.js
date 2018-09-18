import React from "react";
import APIClient from "../../network/APIClient";
import "./Registration.css";
import Constants from "../../../Constants";
import RedirectButton from "../../shared/RedirectButton";

export default class Registration extends React.Component {

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
            <div className="registration">

                <h2>Register</h2>

                <div
                    className="registration__error-panel"
                    hidden={this.state.serverError == null}>
                    <p
                        className="registration__error-panel--error">
                        {this.state.serverError}
                    </p>
                </div>

                <p
                    hidden={this.state.submitSucessful}>
                    Password has to be at least 5 characters long, no more than 100 characters long, contain at least one special character, one capital letter and one lower case character. Example Localhost:8080
                </p>

                <p
                    hidden={!this.state.submitSucessful}>
                    Account <span className="registration__account-name">{this.state.credentials.username}</span> successfully created! Go to <RedirectButton label="login" to={Constants.views.LOGIN} /> to login
                </p>

                <form
                    hidden={this.state.submitSucessful}
                    onSubmit={async e => await this._submit(e)}>
                    <div className="registration__form-group">
                        <label
                            htmlFor="username">
                            Username:
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="example"
                            onChange={e => { this.setState({ credentials: { ...this.state.credentials, username: e.target.value } }) }}
                        />
                    </div>

                    <div className="registration__form-group">
                        <label
                            htmlFor="password">
                            Password:
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            onChange={e => { this.setState({ credentials: { ...this.state.credentials, password: e.target.value } }) }}
                        />
                    </div>

                    <button
                        type="submit">
                        Submit
                    </button>

                </form>

            </div>
        );
    }

    /**
     * @param {React.SyntheticEvent<HTMLFormElement>} e 
     */
    async _submit(e) {
        e.preventDefault();

        try {
            await APIClient.register(this.state.credentials.username, this.state.credentials.password);
            this.setState({ ...this.state, submitSucessful: true });
        } catch (err) {
            this.setState({ ...this.state, serverError: err.message ? err.message : err });
        }
    }

}