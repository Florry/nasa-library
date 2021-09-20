import { computed, observable } from "mobx";
import BaseStore from "./BaseStore";

export class MetadataStore extends BaseStore {

	@observable
	private metadataRegistry = observable.map<string, any>();

	@computed
	get metdata() {
		return [...this.metadataRegistry.values()];
	}

	getMetadatDataById(id: string) {
		return this.metadataRegistry.get(id);
	}

	async loadMetadataById(id: string) {
		const response = await this.rootStore.apiClient.getMediaMetadata(id);
		this.metadataRegistry.set(id, response);
	}

}
