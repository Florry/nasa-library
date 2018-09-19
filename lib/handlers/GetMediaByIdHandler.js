const express = require("express");
const NasaMediaLibraryClient = require("../clients/NasaMediaLibraryClient");

/**
 * Handler for getting media from nasa by its id
 */
class GetMediaByIdHandler {

    constructor() { }

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
            const nasaId = req.params.nasaId;
            const asset = await NasaMediaLibraryClient.getAsset(nasaId);

            res.json(asset);
        } catch (err) {
            res.status(500);
            res.json(err);
            console.error("GetMediaByIdHandler:", err);
        }
    }

}

module.exports = GetMediaByIdHandler;