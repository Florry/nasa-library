class FavoriteModel {

    /**
     * @param {String} nasaId 
     * @param {String} userId 
     * @param {Object} asset 
     */
    constructor(nasaId, userId, asset) {
        this.nasaId = nasaId;
        this.userId = userId;
        this.asset = asset;
    }

}

module.exports = FavoriteModel;