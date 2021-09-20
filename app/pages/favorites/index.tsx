import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import Favorites from "../../components/favorites/Favorites";
import { UseMobx } from "../../middleware/UseMobx";

const FavoritesPage = () => {
	return (
		<MainLayout mustBeLoggedIn={true}>
			<Favorites />
		</MainLayout>
	)
};

export default FavoritesPage;

export const getServerSideProps = UseMobx(async (_context, { mediaStore }) => {
	await mediaStore.loadFavorites();
});
