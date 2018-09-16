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
        this._peppers = peppers;
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
     * @param {String} password 
     * 
     * @return {Boolean}
     */
    validatePasswordFollowsRegExp(password) {
        if (new RegExp(config.passwordValidationRegex).test(password))
            return true;
    }

    /**
     * @return {String}
     */
    _generateSalt() {
        return secureRandom(256, 36);
    }

    /**
     * @return {String}
     */
    _getPepper() {
        // TODO: Make these generate procedurally  
        return this._peppers[Math.round(Math.random() * this._peppers.length)];
    }

    /**
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

/** TEMP! */
const peppers = ['e66d75fa-b262-48b8-a6da-2eb5df7083db',
    '5767a55a-2da2-48a3-808d-a215a87c20e1',
    '9bf7a71b-4cd3-4ddf-82c7-d52a12651bb2',
    'ee1d2892-7c95-4aa9-b5f8-27178e0fe874',
    '9d6cfff0-f032-46dc-a990-80af23fe6243',
    '13401b38-369f-4f5d-94a2-c326713adfb2',
    'd479bd88-18e7-47fa-824f-16c6cac1c409',
    '76853554-fb79-4869-b608-167b98c283bf',
    '5d11db5d-dfa9-4f47-9db1-f48b5c745763',
    '847086dd-ea00-48e2-b122-592823030e04',
    'e980b3c5-71d2-4355-a879-44fa98f69fb2',
    '511093c0-a508-423a-b051-23e83d41041b',
    '73f096be-21fa-4408-962b-b8474b2487f8',
    'b3928f83-b254-479c-a7c2-aba464c86264',
    '47a24812-d97e-407f-bb87-5487981c6501',
    '7ba06984-1d15-49dc-8cec-84453b38484d',
    '85203b40-75fb-4782-bba0-9ab74ffa36e0',
    '3b6f8cf4-3696-4b2c-83db-bbebf648f145',
    'dfc54a80-58dc-4b70-a64f-6ebd4df61993',
    'ad9f02ae-3d61-4323-ae50-c37af38c11e9',
    'aff7a6c6-67be-4426-ac14-c100b0ae0ee9',
    '00245d7e-09ac-4bac-962f-f84258710de0',
    '6f420cf0-ace7-4c19-880c-088d8ec61ad3',
    'e6876fbc-4201-45f8-adad-12acd3974c06',
    '51bf46a9-32ab-4d7d-a03b-33216e1c519a',
    '755653f6-7c1b-40c1-be4d-767294b77444',
    'cf15684d-423f-44a2-b99e-2402fb495b6d',
    '39c41ede-c757-41b7-9da6-5c24667d96ed',
    'c992741a-4321-45b5-aa38-760494f49af1',
    '0eb251a8-b8bb-4215-8b75-97c68db779d1',
    'b74fad63-750a-41dd-addc-184c03d1023c',
    'cf7b1e56-70cb-4e3f-a4ba-e2ee90e2675e',
    '4b1b0984-b1df-4006-82f3-ce4b9c8464b7',
    '8a2f7a88-6cb5-44f9-8bc4-cae99b1b0577',
    '1bdc6b9e-45e7-4b80-99fa-3355187aa7a3',
    '36134e39-fd7c-4868-83e9-331c17e81c3b',
    'b22137a5-eecf-4f79-bf19-367ba8b151f3',
    '1eba295b-be6b-4340-b315-d382b80b2be2',
    '19b3f5cc-6f18-47d0-85b4-8eff8804450b',
    '14762a99-61e1-42b9-83dd-c35c06836ae2',
    'c9074d4f-ba62-43c6-8ae9-76c130c6de49',
    '6e6f320f-b5d9-4075-bcfe-0fc02db938cb',
    'e3359a61-ea81-45da-9a07-18ace5bb5bb7',
    'e03fbd2b-bca4-42b4-a1ae-693e88907de9',
    '16dad20b-9137-4a31-8f0f-95e86a212b57',
    'dd2b38ff-5067-48a0-9022-c4cc43881846',
    '4fad6776-d5c0-48c7-9cdf-afaf182ca6a7',
    '338eb765-e725-4bb6-a789-43616e2d39b4',
    '04494015-a7ec-4d23-bd4a-f377462425ae',
    'cd2e6e53-e49d-47c9-a2a7-439f33d08eea',
    '5bcbc14f-65df-47eb-b809-aa60bd2f9be9',
    '7eac191d-bfc3-4bf6-8dc9-fc6679e3c569',
    '67f0fea4-0240-4c1f-aaf4-7d94a455693d',
    '4c597a9f-a133-4625-ae1a-3f19c200daae',
    'eabb91ba-f630-492b-b54f-cced540b7476',
    '2f21898a-c96b-4c73-a294-d6a371580b79',
    'eb18ab3a-f696-462b-a0fb-85142613662d',
    'f65a8ad5-5ad5-41ac-aa09-fee76eedc21f',
    'aa01d86d-14d0-483a-8607-73c0f3eee1c7',
    'bae6e69b-3042-493b-ba88-29747070a498',
    '740efd89-92f0-42e3-9bb1-3b260a9bfe5c',
    'cc78afd7-0307-4c58-a06d-b91d342a77f0',
    '03061abd-6a64-4531-95a7-6f1eda7ffa57',
    '9bb87da8-97b4-4458-bb36-6f64e4f2c775',
    'a719611c-b96e-4864-81d3-7d724ed02414',
    '67ec584e-6c06-4df1-b2fa-3b36262af0a3',
    '5b39da9e-bd66-4e33-bcf4-20460dc165bf',
    'b7f7bbd1-9b02-47f9-864e-74b891ee853b',
    '7ffd17f4-b936-4311-8c0d-15b6e2f7ba73',
    '4b277243-4c3f-4f0c-bab8-da6ef0a0a83f',
    'c95245b4-8df5-476b-ac78-e83a2b0341f4',
    '49c33001-e932-48af-949c-25572e87a789',
    'd551741b-1f09-43cb-b947-7e84c3eddf89',
    '8250d69d-61dc-4c48-b581-191742a7070e',
    '2e262833-a94b-4c67-acb2-7df98772d939',
    '71cb5fbf-8bb3-4113-b9f1-29a6470b5858',
    'db332899-ee91-4d30-8352-ed9e68a2fe66',
    'd72efa57-249c-48a2-a794-03ecab61e1f8',
    '1b85e667-00ce-4bdf-a1c6-f57ad22401be',
    '71b626f7-6781-4b41-95f9-eb50e8129bd2',
    '3bd989fb-7c27-426c-bbe9-7b02a416c6aa',
    'd2783a54-fe99-40ef-8f37-397b87404c45',
    'a32b27f1-cedf-4caf-b88e-93173c6a632a',
    'bd33ce69-9221-43d0-aeee-b3effa1ede96',
    'e0465aee-43b7-4cac-89a2-21fcabed9429',
    'f6305b19-0419-47c2-a392-90fcb9b90567',
    '38843474-e22c-41e7-8258-d46be3dd965e',
    'a72c7e84-72c2-4a26-8dcc-3beb70561d86',
    'f3e0b436-6969-45fe-8366-a0d473516ceb',
    '57f9a24f-c4af-448d-a954-c4a5a141dc22',
    'd4dc76fc-996d-41ee-b1cf-5f5a3e0d23b9',
    '62e45962-69d1-41e7-875c-efbe53840407',
    '1f0d4379-497e-4a3e-9377-455caaf512ea',
    '7b6c9f98-2db8-4dca-adce-84c67c8d10be',
    '5db3867b-1526-42cc-be9a-cdbb637f04bd',
    'a39074d4-8a89-4fc5-a542-18bc598d8662',
    '9e9e9677-bbfe-4ce2-b157-ce9a694d40ec',
    'd0bd25dd-da19-4df7-98c7-832b6e9fa955',
    'c244b638-7136-4062-a7c9-c0ef922af23e',
    '3264c5c8-2769-4d98-ae19-778bcfbdf7df'];