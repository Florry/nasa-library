import { Request, Response } from "express";
import { FavoriteModel } from "../models/FavoriteModel";
import { FavoritesRepo } from "../repos/FavoritesRepo";

/**
 * Handler for adding favorites for the logged in user
 */
export class AddFavoriteHandler {

	constructor(private favoritesRepo: FavoritesRepo) { }

	async handle(req: Request, res: Response) {
		/**
		 * Typically you wouldn't want to save the whole asset in the database,
		 * but since the data structure was so wastly different and having to do multiple requests when getting metadata
		 * I decided to go for this approach.
		 */
		try {
			const nasaId: string = req.body.nasaId;
			const asset: string = req.body.asset;
			const userId: string = (req as any).user.id;
			const favorite = new FavoriteModel(nasaId, userId, asset);

			try {
				const addedFavorite = await this.favoritesRepo.addFavorite(favorite);

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
