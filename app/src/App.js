import React from 'react';
import LoggedInLayout from "./components/shared/LoggedInLayout"
import LoggedOutLayout from "./components/shared/LoggedOutLayout"
import './App.css';

class App extends React.Component {

    state = {
        loggedIn: window.localStorage.getItem("accesstoken") !== null
    };

    render() {
        return (
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
        );
    }

    getRedirect() {
        return "/register";
    }
}

export default App;
