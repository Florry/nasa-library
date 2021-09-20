/**
 * Json validation schema for adding a favorite
 */
export default {
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
