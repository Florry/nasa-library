import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import Registration from "../views/registration/Registration";
import Login from "../views/login/Login";
import Constants from "../../Constants";
import RedirectButton from "./RedirectButton";

/**
 * The app layout for the logged out state.
 */
export default class LoggedOutLayout extends React.Component {

    render() {
        return (
            <div>
                <RedirectButton label="Register" to={Constants.views.REGISTER} />
                <RedirectButton label="Login" to={Constants.views.LOGIN} />

                <HashRouter>
                    <Switch>
                        <Route path={Constants.views.REGISTER} component={Registration} />
                        <Route path={Constants.views.LOGIN} component={Login} />
                    </Switch>
                </HashRouter>
            </div>
        );
    }

}
