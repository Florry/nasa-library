import {
	isBoxedObservable, isObservable, isObservableArray, isObservableMap, isObservableSet,
	runInAction, toJS
} from "mobx";
import { RootStore } from "./StoreContext";

class BaseStore {
	protected rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	}

	setInitialState(initialState: any) {
		if (initialState) {
			runInAction(() => {
				Object.keys(initialState)
					.forEach((key) => {
						let currentValue = initialState[key];

						if (isObservable((this as any)[key])) {
							const current = (this as any)[key];

							if (isObservableMap(current))
								currentValue.forEach((val: any) => current.set(val[0], val[1]));
							else if (isBoxedObservable(current))
								current.set(currentValue);
							else if (isObservableSet(current))
								currentValue.forEach((val: any) => current.add(val));
							else if (isObservableArray(current))
								currentValue.forEach((val: any) => current.push(val));
							else
								console.warn("Unimplemented observable type!", current);
						}
					});
			});
		}
	}

	toJS() {
		delete (this as any).rootStore;

		return JSON.parse(JSON.stringify(toJS(this), getCircularReplacer()));
	}
}

export default BaseStore;

const getCircularReplacer = () => {
	const seen = new WeakSet();

	return (_key: any, value: any) => {
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) return;

			seen.add(value);
		}

		return value;
	};
};
