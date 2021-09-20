import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import StateProvider from "../components/state/StateProvider";
import "../styles/index.css";

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
	// TODO: Move Head stuff to _document
	// Due to a bug in the latest version of nextjs it cannot be created at this point w/ getting Error: next/document should not be imported outside of pages/_document.js 😬
	return (
		<>
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				{/* @ts-ignore */}
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
				<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap" rel="stylesheet" />
			</Head>
			<StateProvider {...pageProps}>
				<Component {...pageProps} />
			</StateProvider>
		</>
	);
}
export default MyApp
