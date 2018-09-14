module.exports = {

    type: "object",
    description: "request body for logging in",
    properties: {
        username: {
            type: "string"
        },
        password: {
            type: "string"
        }
    },
    required: [
        "username",
        "password"
    ]

};