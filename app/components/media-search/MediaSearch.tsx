import { observer } from "mobx-react";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { DEFAULT_QUERY } from "../../stores/MediaStore";
import { useStore } from "../../stores/StoreContext";
import { queryIsEmpty, toQueryString } from "../../utils/query-utils";
import Input from "../shared/Input";
import MediaItem from "../shared/media-item/MediaItem";
import styles from "./MediaSearch.module.css";
import MediaSearchPagination from "./MediaSearchPagination";

const searchQueryFields = {
	q: "search query",
	description: "description",
	keywords: "keywords",
	nasa_id: "nasa_id",
	location: "location",
	title: "title",
	year_start: "from year",
	year_end: "to year"
};

/**
 * Media search view
 */
const MediaSearch = () => {
	const router = useRouter();
	const { mediaStore } = useStore();
	const { mediaItems, totalCount, query: mediaQuery } = mediaStore;
	const [query, setQuery] = useState(mediaQuery);
	let page = router.query.page ? Number.parseInt(router.query.page as string) : 1;

	const [showOnlyImages, setShowOnlyImages] = useState(false);

	const search = async (e, page = 1) => {
		e.preventDefault();

		if (queryIsEmpty(query))
			return;

		router.push({ query: toQueryString({ ...query, page }) });
	};

	const clearSearchQuery = (e) => {
		e.preventDefault();

		mediaStore.clearItems();

		setQuery(DEFAULT_QUERY);

		router.push({ query: "" });
	};

	const renderQueryInputs = () => {
		return Object.keys(searchQueryFields)
			.map(key =>
				<Input
					key={key}
					value={query[key]}
					onChange={value => setQuery({ ...query, [key]: value })}
					placeholder={searchQueryFields[key]}
				/>
			);
	};

	const mediaItemsToShow = mediaItems
		.filter(item => {
			const media: any = item.links && item.links.length > 0 ? item.links[0] : {};

			if (showOnlyImages && media.render !== "image")
				return;
			else
				return true;
		});

	return (
		<div className={styles["media-search"]}>
			<div className={styles["query-header"]}>

				<h1>Search Media</h1>
				<p>Click images to zoom to fullscreen</p>

				<form
					className={styles["media-search__form"]}
					onSubmit={search}
				>

					{renderQueryInputs()}

					<div>
						<button
							className={styles["media-search__form__search-button"]}
							type="submit">
							Search
						</button>

						<button
							onClick={clearSearchQuery}
							className={styles["media-search__form__clear-search-button"]}
						>
							Clear search
						</button>
					</div>

				</form>

				<span>
					<label htmlFor="only-images">
						Show only images
					</label>
					<Input
						checked={showOnlyImages}
						onChange={() => setShowOnlyImages(!showOnlyImages)}
						id="only-images"
						type="checkbox"
					/>
				</span>
			</div>

			<MediaSearchPagination />

			<div className={styles["media-search__search-result"]}>
				{
					mediaItemsToShow
						.map((item, i) =>
							<MediaItem
								key={item.id}
								resultNumber={i + ((page - 1) * mediaItems.length)}
								id={item.id}
							/>
						)
				}

				<MediaSearchPagination />

			</div>

		</div >
	);
}

export default observer(MediaSearch);
