/**
 * Model for a favorite
 */
class FavoriteModel {

    /**
     * @param {String} nasaId the id of the asset to save
     * @param {String} userId the user whose favorite to save
     * @param {Object=} asset the asset to save as favorite
     */
    constructor(nasaId, userId, asset) {
        this.nasaId = nasaId;
        this.userId = userId;
        this.asset = asset;
    }

}

module.exports = FavoriteModel;