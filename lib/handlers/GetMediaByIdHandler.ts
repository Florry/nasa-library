import { Request, Response } from "express";
import { NasaMediaLibraryClient } from "../clients/NasaMediaLibraryClient";

/**
 * Handler for getting media from nasa by its id
 */
export class GetMediaByIdHandler {

	/**
	 * Handles http request
	 */
	async handle(req: Request, res: Response) {
		try {
			const nasaId: string = decodeURIComponent(req.params.nasaId);
			const asset = await NasaMediaLibraryClient.getAsset(nasaId);

			res.json(asset);
		} catch (err) {
			res.status(500);
			res.json(err);

			console.error("GetMediaByIdHandler:", err);
		}
	}

}
