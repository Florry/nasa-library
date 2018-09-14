module.exports = {

    type: "object",
    id: "CreateUserRequestSchema",
    description: "request body for registering an account",
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