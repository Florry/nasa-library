/**
 * Frontend constants
 */
export default {

    API_ROOT: "http://localhost:8080/api",

    views: {

        LOGIN: "/login",
        REGISTER: "/register",

        FAVORITES: "/favorites",
        MEDIA_SEARCH: "/search-media"

    },

    apiEndpoints: {

        REGISTER: "/user",
        LOGIN: "/login",
        LOGOUT: "/logout",

        MEDIA_SEARCH: "/media",
        GET_MEDIA_BY_ID: "/media/:nasaId",
        GET_MEDIA_METADATA: "/media/:nasaId/metadata",

        ADD_FAVORITE: "/favorite",
        REMOVE_FAVORITE: "/favorite/:nasaId",
        GET_FAVORITES: "/favorite",
    }

};