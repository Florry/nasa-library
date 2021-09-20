import { Collection, Db } from "mongodb";
import { SESSIONS } from "../constants/collection-constants";
import { SessionModel } from "../models/SessionModel";
import { Repo } from "./Repo";

/**
 * Mongo db version of a repo where sessions are stored
 */
export class SessionRepo extends Repo {

	private collection: Collection;

	/**
	 * @param {Db} db database object
	 */
	constructor(db: Db) {
		super();
		this.collection = db.collection(SESSIONS);
	}

	/**
	 * Saves a session in the database
	 *
	 * @return {Promise<SessionModel>} the saved session
	 */
	async saveSession(sessionModel: SessionModel) {
		try {
			(await this.collection.updateOne({ userId: sessionModel.userId }, sessionModel, { upsert: true }));

			const createdSession = await this.collection.findOne({ userId: sessionModel.userId });

			return new SessionModel(createdSession.userId, createdSession.sessionId);
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

	/**
	 * Gets a session for a user by the user's id
	 */
	async getSessionByUserId(userId: string) {
		try {
			const result = await this.collection.findOne({ userId });

			if (result)
				return new SessionModel(result.userId, result.sessionId);
			else
				return result;
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

	/**
	 * Deletes a session for a user by the user's id
	 */
	async deleteSessionsByUserId(userId: string) {
		try {
			await this.collection.deleteMany({ userId });
		} catch (err) {
			super.handleDbError(err as Error);
		}
	}

}
