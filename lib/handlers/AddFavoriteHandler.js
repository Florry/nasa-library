const FavoritesRepo = require("../repos/FavoritesRepo");
const express = require("express");
const FavoriteModel = require("../models/FavoriteModel");

/**
 * Handler for adding favorites for the logged in user
 */
class AddFavoriteHandler {

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
        /** 
         * Typically you wouldn't want to save the whole asset in the database, 
         * but since the data structure was so wastly different and having to do multiple requests when getting metadata
         * I decided to go for this approach.
         */
        try {
            const nasaId = req.body.nasaId;
            const asset = req.body.asset;
            //@ts-ignore
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
            res.status(500);
            res.json(err);
            console.error("AddFavoriteHandler:", err);
        }
    }

}

module.exports = AddFavoriteHandler;