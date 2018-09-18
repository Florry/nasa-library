import React from "react";
import { Switch, HashRouter, Route } from "react-router-dom";
import Favorites from "../views/favorites/Favorites";
import MediaSearch from "../views/media-search/MediaSearch";
import Constants from "../../Constants";
import RedirectButton from "../shared/RedirectButton";
import APIClient from "../network/APIClient";

export default class LoggedInLayout extends React.Component {

    render() {
        return (
            <div>
                <RedirectButton label="Search media" to={Constants.views.MEDIA_SEARCH} />
                <RedirectButton label="Favorites" to={Constants.views.FAVORITES} />
                <button onClick={async () => await this._logout()}>Logout</button>

                <HashRouter>
                    <Switch>
                        <Route path={Constants.views.MEDIA_SEARCH} component={MediaSearch} />
                        <Route path={Constants.views.FAVORITES} component={Favorites} />
                    </Switch>
                </HashRouter>
            </div>
        );
    }

    async  _logout() {
        await APIClient.logout();
    }

}
