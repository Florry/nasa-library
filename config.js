module.exports = {

    /** Regex used to validate password has correct length, correct amount of characters etc. */
    passwordValidationRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,100}$/,

    /** Port to be running the backend on */
    backendPort: 8080,

    /** Port to be running the frontened on */
    frontendPort: 8181

};