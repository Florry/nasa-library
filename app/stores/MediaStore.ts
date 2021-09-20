import { action, computed, observable, runInAction } from "mobx";
import { MediaItem } from "../models/MediaItem";
import { SearchQuery } from "../models/SearchQuery";
import { getNasaId } from "../utils/media-utils";
import BaseStore from "./BaseStore";

export const DEFAULT_QUERY: SearchQuery = {
	center: "",
	description: "",
	description_508: "",
	keywords: "",
	location: "",
	media_type: "",
	nasa_id: "",
	page: 1,
	photographer: "",
	q: "",
	secondary_creator: "",
	title: "",
	year_end: "",
	year_start: ""
};

export class MediaStore extends BaseStore {

	@observable
	private mediaItemRegistry = observable.map<string, MediaItem>();

	@observable
	private queryStore = observable.box<SearchQuery>(DEFAULT_QUERY);

	@observable
	private totalCountStore = observable.box(0);

	@observable
	private pageStore = observable.box(0);

	@computed
	get mediaItems() {
		return [...this.mediaItemRegistry.values()];
	}

	@computed
	get totalCount() {
		return this.totalCountStore.get();
	}

	@computed
	get page() {
		return this.pageStore;
	}

	@computed
	get query() {
		return this.queryStore.get();
	}

	@action
	clearItems() {
		runInAction(() => {
			this.mediaItemRegistry.clear();
			this.totalCountStore.set(0);
		});
	}

	@action
	async searchMedia(query: SearchQuery) {
		if (!query.page) {
			runInAction(() => {
				this.mediaItemRegistry.clear();
				this.totalCountStore.set(0);
			});
		}

		this.queryStore.set(query);

		const { data: { totalItems, items } } = await this.rootStore.apiClient.searchMedia(query);

		runInAction(() => {
			this.totalCountStore.set(totalItems);

			items.map(item => {
				const id = getNasaId(item);

				this.mediaItemRegistry.set(id, { ...item, id });
			});

			this.pageStore.set(this.pageStore.get() + 1);
		});
	}

	@action
	async loadFavorites() {
		const response = await this.rootStore.apiClient.getFavorites();

		runInAction(() => {
			response.forEach(favoriteMediaItem => this.mediaItemRegistry.set(favoriteMediaItem.id, favoriteMediaItem));
		});
	}

	getMediaById(id: string) {
		return this.mediaItemRegistry.get(id);
	}

	async loadMediaItemById(id: string) {
		const mediaItem = this.mediaItemRegistry.get(id);
		const response = await this.rootStore.apiClient.getMediaById(id);

		runInAction(() => this.mediaItemRegistry.set(id, { ...mediaItem, collection: response.collection }));
	}

	async toggleFavorited(id: string, removeOnUnfavorite?: boolean) {
		const mediaItem = this.mediaItemRegistry.get(id);

		try {
			if (mediaItem.isFavorited)
				await this.rootStore.apiClient.removeFavorite(id);
			else
				await this.rootStore.apiClient.addFavorite(id, { ...mediaItem });

			if (mediaItem.isFavorited && removeOnUnfavorite)
				this.mediaItemRegistry.delete(id);
			else
				this.mediaItemRegistry.set(id, { ...mediaItem, isFavorited: !mediaItem.isFavorited });
		} catch (err) {
			// TODO:
		}
	}

}
