import StoreContext, { RootStore } from "../../stores/StoreContext";

interface Props {
	state?: any;
	children?: any;
}

const StateProvider = ({ state, children }: Props) => (
	<StoreContext.Provider value={new RootStore(state)}>
		{children}
	</StoreContext.Provider>
);

export default StateProvider;
