/**
 * Generic repo class, only to be extended.
 */
class Repo {

    constructor() { }

    _handleDbError(err) {
        console.error("database error:", err);
        throw err;
    }
}

module.exports = Repo;