import { observer } from "mobx-react";
import type { NextPage } from "next";
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import MediaSearch from "../components/media-search/MediaSearch";
import { UseMobx } from "../middleware/UseMobx";
import { SearchQuery } from "../models/SearchQuery";
import { queryIsEmpty } from "../utils/query-utils";

const SearchMediaPage: NextPage = () => {

	return (
		<MainLayout mustBeLoggedIn={true}>
			<MediaSearch />
		</MainLayout>
	)
}

export default observer(SearchMediaPage);

export const getServerSideProps = UseMobx(
	async ({ query }, { mediaStore }) => {
		/**
		 * Nextjs's query can be both string and string[], otherwise it will be just an object
		 * thus the as any as SearchQuery
		*/
		const searchQuery = query as any as SearchQuery;

		if (!queryIsEmpty(searchQuery))
			await mediaStore.searchMedia(searchQuery);
	}
);
