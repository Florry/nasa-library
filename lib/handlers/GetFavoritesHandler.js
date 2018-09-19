const FavoritesRepo = require("../repos/FavoritesRepo");
const express = require("express");

/**
 * Handler for getting favorites
 */
class GetFavoritesHandler {

    /**
     * @param {FavoritesRepo} favoritesRepo repo where favorites are stored
     */
    constructor(favoritesRepo) {
        this._favoritesRepo = favoritesRepo;
    }

    /**
     * Handles http request
     * 
     * @param {express.Request} req express request object
     * @param {express.Response} res express response object
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
            res.status(500);
            res.json(err);
            console.error("GetFavoritesHandler:", err);
        }
    }

}

module.exports = GetFavoritesHandler;