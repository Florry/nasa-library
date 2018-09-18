const Db = require("mongodb").Db;
const Repo = require("./Repo");
const constants = require("../constants");
const FavoriteModel = require("../models/FavoriteModel");

class FavoritesRepo extends Repo {

    /**
     * @param {Db} db 
     */
    constructor(db) {
        super();
        this._collection = db.collection(constants.collections.FAVORITES);
    }

    /**
     * @param {FavoriteModel} favorite 
     * 
     * @return {Promise<FavoriteModel>}
     */
    async addFavorite(favorite) {
        try {
            const resp = await this._collection.insertOne(favorite);

            if (resp.result.ok !== 1)
                return null;
            else
                return new FavoriteModel(resp.ops[0].nasaId, resp.ops[0].userId, resp.ops[0].asset);
        } catch (err) {
            super._handleDbError(err);
        }
    }

    /**
     * @param {FavoriteModel} favorite 
     * 
     * @return {Promise<Boolean>}
     */
    async removeFavorite(favorite) {
        try {
            const resp = await this._collection.remove({ userId: favorite.userId, nasaId: favorite.nasaId });

            if (resp.result.ok === 1 && resp.result.n === 1)
                return true;
            else
                return false;
        } catch (err) {
            super._handleDbError(err);
        }
    }

    /**
     * @param {Array<String>} nasaIds 
     * @param {String} userId 
     * 
     * @return {Promise<Array<FavoriteModel>>}
     */
    async getFavoritesForUserByNasaIds(nasaIds, userId) {
        try {
            const result = await this._collection.find({
                nasaId: {
                    $in: nasaIds
                }, userId
            }).toArray();

            return result.map(r => new FavoriteModel(r.nasaId, r.userId, {}));
        } catch (err) {
            super._handleDbError(err);
        }
    }

    /**
     * @param {String} userId 
     * 
     * @return {Promise<Array<FavoriteModel>>}
     */
    async getFavoritesForUser(userId) {
        try {
            const result = await this._collection.find({ userId }).toArray();

            return result.map(r => new FavoriteModel(r.nasaId, r.userId, r.asset));
        } catch (err) {
            super._handleDbError(err);
        }
    }

}

module.exports = FavoritesRepo;