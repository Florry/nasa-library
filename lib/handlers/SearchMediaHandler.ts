import { Request, Response } from "express";
import { NasaMediaLibraryClient } from "../clients/NasaMediaLibraryClient";
import { SearchQuery } from "../models/SearchQuery";
import { FavoritesRepo } from "../repos/FavoritesRepo";

export class SearchMediaHandler {

	constructor(private favoritesRepo: FavoritesRepo) { }

	async handle(req: Request, res: Response) {
		try {
			const nasaQuery = new SearchQuery(req.query as any);
			const resp: any = await NasaMediaLibraryClient.searchAssets(nasaQuery);
			const output = {
				data: {
					items: [],
					totalItems: 0
				}
			};

			if (!resp.collection) {
				res.json(output);
				return;
			}

			output.data.items = resp.collection.items;
			output.data.totalItems = resp.collection.metadata.total_hits;

			const ids = output.data.items.map((item: any) => {
				if (item.data && item.data[0])
					return item.data[0].nasa_id;
			});

			// @ts-ignore
			const favorites = await this.favoritesRepo.getFavoritesForUserByNasaIds(ids, req.user.id);
			const isFavoritedById: Record<string, boolean> = {};

			favorites?.forEach(favorite => isFavoritedById[favorite.nasaId] = true);

			output.data.items.map((item: any) => {
				if (item.data && item.data[0] && item.data[0].nasa_id)
					item.isFavorited = isFavoritedById[item.data[0].nasa_id];
				else
					item.isFavorited = false;

				return item;
			});

			console.log("\n");
			console.log("=======================================");
			console.log("output.data.totalItems");
			console.log("=======================================");
			console.log(require("util").inspect(output.data.totalItems, null, null, true));
			console.log("\n");

			res.json(output);
		} catch (err) {
			res
				.status(500)
				.json(err);

			console.error("SearchMediaHandler:", err);
		}
	}

}
