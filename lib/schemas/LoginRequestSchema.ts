/**
 * Json validation schema for logging in
 */
export default {
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
