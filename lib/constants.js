module.exports = {

    /** Header name to be used for the auth token */
    AUTHENTICATION_TOKEN_NAME: "Authentication",
    AUTHENTICATION_TOKEN_NAME_OUT: "accesstoken",

    endpoints: {

        CREATE_USER: "/api/user",
        LOGIN: "/api/login",
        LOGOUT: "/api/logout"

    },

    /** Mongo Db collections */
    collections: {

        USERS: "users",
        SESSIONS: "sessions",
        FAVORITES: "favorites"

    }

};