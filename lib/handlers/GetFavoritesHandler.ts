import { Request, Response } from "express";
import { FavoritesRepo } from "../repos/FavoritesRepo";

/**
 * Handler for getting favorites
 */
export class GetFavoritesHandler {

	constructor(private favoritesRepo: FavoritesRepo) { }

	/**
	 * Handles http request
	 */
	async handle(req: Request, res: Response) {
		try {
			const userId = (req as any).user.id;
			const favorites = await this.favoritesRepo.getFavoritesForUser(userId);

			res.json(favorites?.map(favorite => {
				favorite.asset.isFavorited = true;

				return favorite.asset;
			}));
		} catch (err) {
			res.status(500);
			res.json(err);

			console.error("GetFavoritesHandler:", err);
		}
	}

}
