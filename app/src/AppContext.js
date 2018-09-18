import React from "react";

export const AppContext = React.createContext({
    loggedIn: false,
    loggedInUser: {},
    setLoggedIn: (user) => { }
});