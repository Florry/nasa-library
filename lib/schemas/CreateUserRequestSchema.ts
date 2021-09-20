/**
 * Json validation schema for creating a user
 */
export default {
	type: "object",
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
