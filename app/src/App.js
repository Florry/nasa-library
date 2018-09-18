import React from 'react';
import LoggedInLayout from "./components/shared/LoggedInLayout"
import LoggedOutLayout from "./components/shared/LoggedOutLayout"
import './App.css';
import { AppContext } from "./AppContext";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.setLoggedIn = (user) => this.setState({ ...this.state, loggedIn: true, loggedInUser: user })

        this.state = {
            loggedIn: window.localStorage.getItem("accesstoken") !== null,
            setLoggedIn: this.setLoggedIn,
            loggedInUser: {}
        };

        // TODO: if loggedIn; get user
    }

    render() {
        return (
            <AppContext.Provider
                value={this.state}>

                <div
                    className="App">
                    <div
                        className="App-header">
                        <h1>Nasa image library</h1>
                    </div>

                    {this.state.loggedIn ? <span>Logged in as {Object.keys(this.state.loggedInUser)}</span> : ""}

                    <div
                        className="App-content">
                        {
                            this.state.loggedIn
                                ? <LoggedInLayout />
                                : <LoggedOutLayout />
                        }
                    </div>
                </div>

            </AppContext.Provider>
        );
    }

}

export default App;
