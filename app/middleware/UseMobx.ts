import { IncomingMessage } from "http";
import request from "request";
import { RootStore } from "../stores/StoreContext";
import { AuthenticatedPageContext } from "./AuthenticatedPageContext";

export function UseMobx(nextFunction?: (req: AuthenticatedPageContext, rootStore: RootStore) => any) {
	const nextFn = nextFunction;

	return async function getServerSideProps(context: AuthenticatedPageContext) {
		const jwtToken = context.req.cookies.jwt;
		const rootStore = new RootStore({ jwtToken });

		{
			const statusCode = await authenticateUser(context.req);
			const isLoggedIn = statusCode === 200;
			rootStore.authStore.isLoggedIn = isLoggedIn;
		}

		let response;

		/** Runs the inputted getServerSideProps function */
		try {
			response = nextFn ? (await nextFn(context, rootStore)) || {} : {};
		} catch (err) {
			console.error(err);
		}

		if (!response)
			response = {};

		if (!response.props)
			response.props = {};

		if (!response.props.state)
			response.props.state = {};

		const storeStates: any = {};

		/** Sets store state from the stores after inputted getServerSideProps */
		Object.keys(rootStore)
			.forEach(key => {
				if (key.toLowerCase().includes("store"))
					storeStates[key] = { ...rootStore[key].toJS() }
			});

		return {
			...response,
			props: {
				...response.props,
				state: {
					...response.props.state,
					...storeStates
				}
			}
		};
	};
}

async function authenticateUser(req: IncomingMessage): Promise<any> {
	return new Promise(resolve => {
		const proxy = request({ url: "http://localhost:8080/api/is-logged-in" })

		proxy.on('response', response => resolve(response.statusCode));

		req.pipe(proxy);
	});
}
