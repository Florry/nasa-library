/**
 * Model for a favorite
 */
export class FavoriteModel {
	constructor(public nasaId: string, public userId: string, public asset?: any) { } // TODO: fix structure for asset instead of using any
}
