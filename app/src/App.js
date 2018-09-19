import React from 'react';
import LoggedInLayout from "./components/shared/LoggedInLayout"
import LoggedOutLayout from "./components/shared/LoggedOutLayout"
import './App.css';
import { AppContext } from "./AppContext";

/**
 * Base App
 */
class App extends React.Component {

    /**
     * @param {Object} props react props
     */
    constructor(props) {
        super(props);

        this.setLoggedIn = (user) => this.setState({ ...this.state, loggedIn: true })

        this.state = {
            loggedIn: window.localStorage.getItem("accesstoken") !== null,
            setLoggedIn: this.setLoggedIn
        };
    }

    render() {
        return (
            <AppContext.Provider
                value={this.state}>

                <div className="App-header__background" />

                <div
                    className="App">

                    <div
                        className="App-header">
                        <h1>Nasa image library</h1>
                    </div>

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
