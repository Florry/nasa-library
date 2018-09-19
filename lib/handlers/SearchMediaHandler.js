const NasaMediaLibraryClient = require("../clients/NasaMediaLibraryClient");
const SearchQuery = require("../models/SearchQuery");
const express = require("express");
const FavoritesRepo = require("../repos/FavoritesRepo");

class SearchMediaHandler {

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
            const nasaQuery = new SearchQuery(req.query);
            const resp = await NasaMediaLibraryClient.searchAssets(nasaQuery);
            const output = {
                data: {
                    items: [],
                    totalItems: 0
                }
            };

            if (!resp.collection)
                res.json(output);

            output.data.items = resp.collection.items;
            output.data.totalItems = resp.collection.metadata.total_hits;

            const ids = output.data.items.map(item => {
                if (item.data && item.data[0])
                    return item.data[0].nasa_id;
            });

            // @ts-ignore
            const favorites = await this._favoritesRepo.getFavoritesForUserByNasaIds(ids, req.user.id);
            const isFavoritedById = {};

            favorites.forEach(favorite => isFavoritedById[favorite.nasaId] = true);

            output.data.items.map(item => {
                if (item.data && item.data[0] && item.data[0].nasa_id)
                    item.isFavorited = isFavoritedById[item.data[0].nasa_id];
                else
                    item.isFavorited = false;

                return item;
            });

            res.json(output);

        } catch (err) {
            res.status(500);
            res.json(err);
            console.error("SearchMediaHandler:", err);
        }
    }

}

module.exports = SearchMediaHandler;