const Db = require("mongodb").Db;
const Repo = require("./Repo");
const constants = require("../constants");

class FavoritesRepo extends Repo {

    /**
     * @param {Db} db 
     */
    constructor(db) {
        super();
        this._collection = db.collection(constants.collections.FAVORITES);
    }

}

module.exports = FavoritesRepo;