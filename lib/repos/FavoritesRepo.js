const Db = require("mongodb").Db;
const Repo = require("./Repo");
const constants = require("../constants");
const FavoriteModel = require("../models/FavoriteModel");

/**
 * Mongo db version of a repo where favorites are stored
 */
class FavoritesRepo extends Repo {

    /**
     * @param {Db} db database object
     */
    constructor(db) {
        super();
        this._collection = db.collection(constants.collections.FAVORITES);
    }

    /**
     * Adds a favorite to the database
     * 
     * @param {FavoriteModel} favorite the favorite to add
     * 
     * @return {Promise<FavoriteModel>} the added favorite
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
     * Removes a favorite from the database
     * 
     * @param {FavoriteModel} favorite the favorite to be removed
     * 
     * @return {Promise<Boolean>} whether or not the operation was sucessful
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
     * Gets favorites for a user by a list of nasa isds
     * Typically used for getting favorites for a set of search results
     * 
     * @param {Array<String>} nasaIds a list of nasa ids to get favorites for
     * @param {String} userId the id of the user to get favorites for
     * 
     * @return {Promise<Array<FavoriteModel>>} an array of favorites found
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
     * Gets all favorites for a user
     * 
     * @param {String} userId the id of the user to get favorites for
     * 
     * @return {Promise<Array<FavoriteModel>>} an array with the favorites
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