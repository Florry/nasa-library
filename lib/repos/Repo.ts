/**
 * Generic repo class, only to be extended.
 */
export class Repo {

	/**
	 * Handles any unexpected mongodb database errors
	 */
	protected handleDbError(err: Error) {
		console.error("database error:", err);
		throw err;
	}

}
