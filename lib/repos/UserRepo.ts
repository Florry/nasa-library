import { Collection, Db } from "mongodb";
import { USERS } from "../constants/collection-constants";
import { UserModel } from "../models/UserModel";
import { Repo } from "./Repo";

/**
 * Mongo db version of a repo where users are stored
 */
export class UserRepo extends Repo {

	private collection: Collection;

	constructor(db: Db) {
		super();
		this.collection = db.collection(USERS);
	}

	/**
	 * Creates a user in the database
	 */
	async createUser(userData: UserModel) {
		try {
			const createdUser = (await this.collection.insertOne(userData)).ops[0];
			const createUserModel = new UserModel(createdUser.username,
				createdUser.hashedPassword,
				createdUser.salt,
				createdUser.metadata.created,
				createdUser.id);

			return createUserModel;
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

	/**
	 * Gets a user by its username
	 */
	async getByUsername(username: string) {
		return this._getByQuery({ username });
	}

	/**
	 * Gets a user by its id
	 */
	async getByUserId(userId: string) {
		return this._getByQuery({ id: userId });
	}

	/**
	 * Gets a user by a mongodb query
	 */
	async _getByQuery(query: any) {
		try {
			const dbResponse = await this.collection.findOne(query);

			let user = null;

			if (dbResponse != null)
				user = new UserModel(dbResponse.username,
					dbResponse.hashedPassword,
					dbResponse.salt,
					dbResponse.metadata.created,
					dbResponse.id);

			return user;
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

}
