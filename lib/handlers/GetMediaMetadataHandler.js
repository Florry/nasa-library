const express = require("express");
const NasaMediaLibraryClient = require("../clients/NasaMediaLibraryClient");

/**
 * Handler for getting metadata for an asset from nasa
 */
class GetMediaMetadataHandler {

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
            const asset = await NasaMediaLibraryClient.getMetadata(nasaId);

            res.json(asset);
        } catch (err) {
            res.status(500);
            res.json(err);
            console.error("GetMediaMetadataHandler:", err);
        }
    }

}

module.exports = GetMediaMetadataHandler;