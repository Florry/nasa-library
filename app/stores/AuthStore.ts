import { action, computed, observable } from "mobx";
import BaseStore from "./BaseStore";

export class AuthStore extends BaseStore {

	@observable
	private _isLoggedIn = observable.box(false);

	@computed
	get isLoggedIn() {
		return this._isLoggedIn.get();
	}

	set isLoggedIn(newValue: boolean) {
		this._isLoggedIn.set(newValue);
	}

	@action
	async login(username: string, password: string) {
		try {
			await this.rootStore.apiClient.login(username, password);
			this.isLoggedIn = true;
		} catch (err) {
			throw err;
		}
	}

	@action
	async logout() {
		try {
			await this.rootStore.apiClient.logout();
			this.isLoggedIn = false;
		} catch (err) {
			throw err;
		}
	}

	@action
	async register(username: string, password: string) {
		await this.rootStore.apiClient.register(username, password);
	}

}
