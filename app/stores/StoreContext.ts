import React from "react";
import APIClient from "../network/APIClient";
import { AuthStore } from "./AuthStore";
import { MediaStore } from "./MediaStore";
import { MetadataStore } from "./MetadataStore";

export class RootStore {

	apiClient: APIClient;

	authStore: AuthStore;
	mediaStore: MediaStore;
	metadataStore: MetadataStore;

	constructor(initialState: any = {}) {
		this.apiClient = new APIClient(initialState.jwtToken);

		this.authStore = new AuthStore(this);
		this.authStore.setInitialState(initialState.authStore);

		this.mediaStore = new MediaStore(this);
		this.mediaStore.setInitialState(initialState.mediaStore);

		this.metadataStore = new MetadataStore(this);
		this.metadataStore.setInitialState(initialState.metadataStore);
	}

}

export const rootStore = new RootStore({});

const StoreContext = React.createContext(rootStore);

export default StoreContext;

export const useStore = () => React.useContext(StoreContext);
