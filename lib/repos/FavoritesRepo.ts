import { Collection, Db } from "mongodb";
import { FAVORITES } from "../constants/collection-constants";
import { FavoriteModel } from "../models/FavoriteModel";
import { Repo } from "./Repo";

/**
 * Mongo db version of a repo where favorites are stored
 */
export class FavoritesRepo extends Repo {

	private collection: Collection;

	constructor(db: Db) {
		super();
		this.collection = db.collection(FAVORITES);
	}

	/**
	 * Adds a favorite to the database
	 */
	async addFavorite(favorite: FavoriteModel) {
		try {
			const resp = await this.collection.insertOne(favorite);

			if (resp.result.ok !== 1)
				return null;
			else
				return new FavoriteModel(resp.ops[0].nasaId, resp.ops[0].userId, resp.ops[0].asset);
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

	/**
	 * Removes a favorite from the database
	 */
	async removeFavorite(favorite: FavoriteModel) {
		try {
			const resp = await this.collection.remove({ userId: favorite.userId, nasaId: favorite.nasaId });

			if (resp.result.ok === 1 && resp.result.n === 1)
				return true;
			else
				return false;
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

	/**
	 * Gets favorites for a user by a list of nasa isds
	 * Typically used for getting favorites for a set of search results
	 *
	 * @return an array of favorites found
	 */
	async getFavoritesForUserByNasaIds(nasaIds: string[], userId: string) {
		try {
			const result = await this.collection.find({
				nasaId: {
					$in: nasaIds
				}, userId
			}).toArray();

			return result.map((result: any) => new FavoriteModel(result.nasaId, result.userId, {}));
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

	/**
	 * Gets all favorites for a user
	 *
	 * @return {Promise<Array<FavoriteModel>>} an array with the favorites
	 */
	async getFavoritesForUser(userId: string) {
		try {
			const result = await this.collection.find({ userId }).toArray();

			return result.map((result: any) => new FavoriteModel(result.nasaId, result.userId, result.asset));
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

}
