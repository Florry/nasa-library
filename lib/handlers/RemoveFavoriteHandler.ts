import { Request, Response } from "express";
import { FavoriteModel } from "../models/FavoriteModel";
import { FavoritesRepo } from "../repos/FavoritesRepo";

/**
 * Handler for removing a favorite
 */
export class RemoveFavoriteHandler {

	constructor(private favoritesReso: FavoritesRepo) { }

	/**
	 * @param {express.Request} req
	 * @param {express.Response} res
	 *
	 * @return {Promise<Void>}
	 */
	async handle(req: Request, res: Response) {
		try {
			const nasaId: string = req.params.nasaId;
			const userId: string = (req as any).user.id;
			const favorite = new FavoriteModel(nasaId, userId);
			const wasRemoved = await this.favoritesReso.removeFavorite(favorite);

			res.json({ favoriteRemoved: wasRemoved });
		} catch (err) {
			res.status(500);
			res.json(err);

			console.error("RemoveFavoriteHandler:", err);
		}
	}

}
