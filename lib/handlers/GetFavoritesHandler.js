const FavoritesRepo = require("../repos/FavoritesRepo");
const express = require("express");

class GetFavoritesHandler {

    /**
     * @param {FavoritesRepo} favoritesRepo 
     */
    constructor(favoritesRepo) {
        this._favoritesRepo = favoritesRepo;
    }

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     * 
     * @return {Promise<Void>}
     */
    async handle(req, res) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const favorites = await this._favoritesRepo.getFavoritesForUser(userId);

            res.json(favorites.map(favorite => {
                favorite.asset.isFavorited = true;
                return favorite.asset;
            }));
        } catch (err) {
            res.statusCode = 500;
            res.json(err.message ? err.message : err);
        }
    }

}

module.exports = GetFavoritesHandler;