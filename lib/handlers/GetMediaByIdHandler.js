const express = require("express");
const NasaMediaLibraryClient = require("../clients/NasaMediaLibraryClient");

class GetMediaByIdHandler {

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