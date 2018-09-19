/**
 * Json validation schema for adding a favorite
 */
module.exports = {
    type: "object",
    description: "request body for adding a favorite",
    properties: {
        nasaId: {
            type: "string"
        },
        asset: {
            type: "object"
        }
    },
    required: [
        "nasaId",
        "asset"
    ]

};