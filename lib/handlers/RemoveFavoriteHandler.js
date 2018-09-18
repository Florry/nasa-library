const FavoritesRepo = require("../repos/FavoritesRepo");
const express = require("express");
const FavoriteModel = require("../models/FavoriteModel");

class RemoveFavoriteHandler {

    /**
     * @param {FavoritesRepo} favoritesReso 
     */
    constructor(favoritesReso) {
        this._favoritesRepo = favoritesReso;
    }

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     * 
     * @return {Promise<Void>}
     */
    async handle(req, res) {
        try {
            const nasaId = req.params.nasaId;
            const userId = req.user.id;
            const favorite = new FavoriteModel(nasaId, userId);
            const wasRemoved = await this._favoritesRepo.removeFavorite(favorite);

            res.json({ favoriteRemoved: wasRemoved });
        } catch (err) {
            res.statusCode = 500;
            res.json(err.message ? err.message : err);
        }
    }

}

module.exports = RemoveFavoriteHandler;