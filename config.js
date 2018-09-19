/**
 * Configs can be set by setting environment variables, e.g. export FRONTEND_PORT="9090"
 */
module.exports = {

    /** Regex used to validate password has correct length, correct amount of characters etc. */
    passwordValidationRegex: parseRegexConfig(process.env.PASSWORD_VALIDATION_REGEX || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,100}$/),

    /** Port to be running the backend on */
    backendPort: parseIntConfig(process.env.BACKEND_PORT || 8080),

    /** Port to be running the frontened on */
    frontendPort: parseIntConfig(process.env.FRONTEND_PORT || 8181),

    /** How long the jwt should be valid */
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d",

    /** The secret to be used when generating the jwt token */
    jwtSecret: process.env.JWT_SECRET || "14110e2ce7e3b0fe3a36e05b23324c18eac391280c269a1e53c58214ee9d5e2ef91d124529ed097397c7112627ab5a88f5fcfa9c5f6273029ad75ac6f542e67ca5e5c248102e860639eba54ad93878d88385a9b152a8fb98638f78a59f0e7bc58b42db7b39328fae610bdc428bd5848a2d34a838fa57876fbbb25184b47a5635"

};


/**
 * Parses a string into a number
 * 
 * @param {String|Number} configVal 
 */
function parseIntConfig(configVal) {
    if (typeof configVal === "number")
        return configVal;
    else
        return Number.parseInt(configVal);
}

/**
 * Parses a string into a regex
 * 
 * @param {String|RegExp} configVal 
 */
function parseRegexConfig(configVal) {
    if (configVal instanceof RegExp)
        return configVal;
    else
        return new RegExp(configVal);
}