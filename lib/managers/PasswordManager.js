const UserRepo = require("../repos/UserRepo");
const crypto = require("crypto");
const secureRandom = require("csprng");
const config = require("../../config");

/**
 * Manager for everything password related
 */
class PasswordManager {

    /**
     * @param {UserRepo} userRepo repo where users are stored
     */
    constructor(userRepo) {
        this._userRepo = userRepo;

        /** Note: Changing these will make old accounts unable to login */
        this._peppers = [
            "e66d75fa-b262-48b8-a6da-2eb5df7083db",
            "5767a55a-2da2-48a3-808d-a215a87c20e1",
            "9bf7a71b-4cd3-4ddf-82c7-d52a12651bb2",
            "ee1d2892-7c95-4aa9-b5f8-27178e0fe874",
            "9d6cfff0-f032-46dc-a990-80af23fe6243",
            "13401b38-369f-4f5d-94a2-c326713adfb2",
            "d479bd88-18e7-47fa-824f-16c6cac1c409",
            "76853554-fb79-4869-b608-167b98c283bf",
            "5d11db5d-dfa9-4f47-9db1-f48b5c745763",
            "847086dd-ea00-48e2-b122-592823030e04",
            "e980b3c5-71d2-4355-a879-44fa98f69fb2",
            "511093c0-a508-423a-b051-23e83d41041b",
            "73f096be-21fa-4408-962b-b8474b2487f8",
            "b3928f83-b254-479c-a7c2-aba464c86264",
            "47a24812-d97e-407f-bb87-5487981c6501",
            "7ba06984-1d15-49dc-8cec-84453b38484d",
            "85203b40-75fb-4782-bba0-9ab74ffa36e0",
            "3b6f8cf4-3696-4b2c-83db-bbebf648f145",
            "dfc54a80-58dc-4b70-a64f-6ebd4df61993",
            "ad9f02ae-3d61-4323-ae50-c37af38c11e9",
            "aff7a6c6-67be-4426-ac14-c100b0ae0ee9",
            "00245d7e-09ac-4bac-962f-f84258710de0"
        ];
    }

    /**
     * @typedef {Object} HashResult
     * @property {String} hashValue
     * @property {String} salt
     * 
     * @param {String} password 
     * 
     * @return {Promise<HashResult>}
     */
    async hashPassword(password) {
        const salt = this._generateSalt();
        const pepper = this._getPepper();
        const hashValue = await this._hashPassword(password, salt, pepper);

        return { hashValue, salt };
    }

    /**
     * Checks if a hashed version of the inputted password matches the hashed password of a user.
     * 
     * @param {String} inputPassword 
     * @param {String} username 
     * 
     * @return {Promise<Boolean>}
     */
    async validatePasswordForUser(inputPassword, username) {
        const user = await this._userRepo.getByUsername(username);

        if (!user)
            return false;

        return await this._validatePassword(user.hashedPassword, user.salt, inputPassword);
    }

    /**
     * Validates if hashedPassword is matching inputPassword with the inputted salt
     * 
     * @param {String} hashedPassword 
     * @param {String} salt 
     * @param {String} inputPassword 
     * 
     * @return {Promise<Boolean>}
     */
    async _validatePassword(hashedPassword, salt, inputPassword) {
        let wasValidated = false;

        /** To make the password hashing a bit slower to make brute force harder/more time consuming */
        for (let i = 0; i < this._peppers.length; i++) {
            const pepper = this._peppers[i];
            const hashValue = await this._hashPassword(inputPassword, salt, pepper);

            if (hashValue === hashedPassword)
                wasValidated = true;
        }

        return wasValidated;
    }

    /**
     * Validates if inputted password follows the password guidelines
     * 
     * @param {String} password 
     * 
     * @return {Boolean}
     */
    validatePasswordFollowsRegExp(password) {
        if (new RegExp(config.passwordValidationRegex).test(password))
            return true;
    }

    /**
     * Generates a personal salt
     * 
     * @return {String}
     */
    _generateSalt() {
        return secureRandom(256, 36);
    }

    /**
     * Picks a pepper
     * 
     * @return {String}
     */
    _getPepper() {
        /** 
         * Typically you'd want this to generate a token rather than grabbing one by (predictable) Math.random()
         * This would be done with a function generating any of the peppers in this._peppers from data in the user object.
         * This works for now:
        */
        return this._peppers[Math.round(Math.random() * this._peppers.length)];
    }

    /**
     * Hashes the inputted password with the inputted salt and inputted pepper
     * 
     * @param {String} password 
     * @param {String} salt 
     * @param {String} pepper 
     * 
     * @return {String}
     */
    _hashPassword(password, salt, pepper) {
        const hashedPassword = crypto.createHmac("sha512", password + pepper).digest("hex");
        const hashValue = crypto.createHmac("sha512", salt + hashedPassword).digest("hex");

        return hashValue.toString();
    }

}

module.exports = PasswordManager;