/**
 * Generic repo class, only to be extended.
 */
class Repo {

    constructor() { }

    /**
     * Handles any unexpected mongodb database errors
     * 
     * @param {Error} err 
     * 
     * @return {Void}
     */
    _handleDbError(err) {
        console.error("database error:", err);
        throw err;
    }
}

module.exports = Repo;