const FavoritesRepo = require("../repos/FavoritesRepo");
const express = require("express");
const FavoriteModel = require("../models/FavoriteModel");

class AddFavoriteHandler {

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
        /** 
         * Typically you wouldn't want to save the whole asset in the database, 
         * but since the data structure was so wastly different and having to do multiple requests when getting metadata
         * I decided to go for this approach.
         */
        try {
            const nasaId = req.body.nasaId;
            const asset = req.body.asset;
            const userId = req.user.id;
            const favorite = new FavoriteModel(nasaId, userId, asset);
            try {
                const addedFavorite = await this._favoritesRepo.addFavorite(favorite);
                res.json(addedFavorite);
            }
            catch (err) {
                res.json(favorite);
            }

        } catch (err) {
            res.statusCode = 500;
            res.end(err.message ? err.message : err);
        }
    }

}

module.exports = AddFavoriteHandler;