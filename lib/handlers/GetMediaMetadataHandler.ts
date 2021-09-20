import { Request, Response } from "express";
import { NasaMediaLibraryClient } from "../clients/NasaMediaLibraryClient";

/**
 * Handler for getting metadata for an asset from nasa
 */
export class GetMediaMetadataHandler {

	/**
	 * Handles http request
	 */
	async handle(req: Request, res: Response) {
		try {
			const nasaId: string = req.params.nasaId;
			const asset = await NasaMediaLibraryClient.getMetadata(nasaId);

			res.json(asset);
		} catch (err) {
			res.status(500);
			res.json(err);

			console.error("GetMediaMetadataHandler:", err);
		}
	}

}
