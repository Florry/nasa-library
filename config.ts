/**
 * Configs can be set by setting environment variables, e.g. export FRONTEND_PORT="9090"
 */
export const PASSWORD_VALIDATION_REGEX = parseRegexConfig(process.env.PASSWORD_VALIDATION_REGEX || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,100}$/);

export const BACKEND_PORT = parseIntConfig(process.env.BACKEND_PORT || 8080);

export const FRONTEND_PORT = parseIntConfig(process.env.FRONTEND_PORT || 8181);

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

export const JWT_SECRET = process.env.JWT_SECRET || "14110e2ce7e3b0fe3a36e05b23324c18eac391280c269a1e53c58214ee9d5e2ef91d124529ed097397c7112627ab5a88f5fcfa9c5f6273029ad75ac6f542e67ca5e5c248102e860639eba54ad93878d88385a9b152a8fb98638f78a59f0e7bc58b42db7b39328fae610bdc428bd5848a2d34a838fa57876fbbb25184b47a5635";

/**
 * Parses a string into a number
 */
function parseIntConfig(configVal: string | number) {
	if (typeof configVal === "number")
		return configVal;
	else
		return Number.parseInt(configVal);
}

/**
 * Parses a string into a regex
 */
function parseRegexConfig(configVal: string | RegExp) {
	if (configVal instanceof RegExp)
		return configVal;
	else
		return new RegExp(configVal);
}
