const express = require("express");
const NasaMediaLibraryClient = require("../clients/NasaMediaLibraryClient");

class GetMediaMetadataHandler {

    constructor() { }

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
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