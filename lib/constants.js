module.exports = {

    /** Header name to be used for the auth token */
    AUTHENTICATION_TOKEN_NAME: "Authentication",
    AUTHENTICATION_TOKEN_NAME_OUT: "accesstoken",

    endpoints: {

        CREATE_USER: "/api/user",
        LOGIN: "/api/login",
        LOGOUT: "/api/logout",

        SEARCH_MEDIA: "/api/media",
        GET_MEDIA_BY_ID: "/api/media/:nasaId",
        GET_MEDIA_METADATA: "/api/media/:nasaId/metadata",

        ADD_FAVORITE: "/api/favorite",
        REMOVE_FAVORITE: "/api/favorite/:nasaId",
        GET_FAVORITES: "/api/favorite"

    },

    /** Mongo Db collections */
    collections: {

        USERS: "users",
        SESSIONS: "sessions",
        FAVORITES: "favorites"

    }

};