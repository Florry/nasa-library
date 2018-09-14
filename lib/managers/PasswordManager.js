const UserRepo = require("../repos/UserRepo");
const crypto = require("crypto");
const secureRandom = require("csprng");
const config = require("../../config");

class PasswordManager {

    /**
     * @param {UserRepo} userRepo 
     */
    constructor(userRepo) {
        this._userRepo = userRepo;

        /** TODO: change these into real peppers. https://en.wikipedia.org/wiki/Pepper_(cryptography)*/
        this._peppers = ["a,", "b", "c", "d", "e"];
    }

    /**
     * @param {String} password 
     */
    async hashPassword(password) {
        const salt = this._generateSalt();
        const pepper = this._getPepper();
        const hashValue = await this._hashPassword(password, salt, pepper);

        return { hashValue, salt };
    }

    async hashPasswordForUserId(userId, password) {
        const salt = this._generateSalt();
        const pepper = this._getPepper();
        const hashValue = await this._hashPassword(password, salt, pepper);

        return {
            password: hashValue,
            salt: salt
        }
    }

    async validatePasswordForUser(inputPassword, userId) {
        const user = await this._userRepo.getById(userId);
        return await this.validatePassword(user.password, user.salt, userId, inputPassword);
    }

    async validatePassword(hashedPassword, salt, id, inputPassword) {
        let wasValidated = false;

        for (let i = 0; i < this._peppers.length; i++) {
            const pepper = this._peppers[i];
            const hashValue = await this._hashPassword(inputPassword, salt, pepper);

            wasValidated = hashValue === hashedPassword;
        }

        return wasValidated;
    }

    validatePasswordFollowsRegExp(password) {
        if (new RegExp(config.passwordValidationRegex).test(password))
            return true;
    }

    _generateSalt() {
        return secureRandom(256, 36);
    }

    _getPepper() {
        return this._peppers[Math.round(Math.random() * this._peppers.length)];
    }

    async _hashPassword(password, salt, pepper) {
        const hashedPassword = crypto.createHmac("sha512", password + pepper).digest("hex");
        const hashValue = crypto.createHmac("sha512", salt + hashedPassword).digest("hex");

        return hashValue;
    }

}

module.exports = PasswordManager;