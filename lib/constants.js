module.exports = {

    /** Header name to be used for the auth token */
    AUTHENTICATION_TOKEN_NAME: "Authentication",

    endpoints: {

        CREATE_USER: "/user",
        LOGIN: "/login"

    },

    /** Mongo Db collections */
    collections: {

        USERS: "users",
        SESSIONS: "sessions",
        FAVORITES: "favorites"

    }

};