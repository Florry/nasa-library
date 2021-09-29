import { useRouter } from "next/router";
import { useStore } from "../../stores/StoreContext";
import { toQueryString } from "../../utils/query-utils";
import styles from "./MediaSearch.module.css"

const MediaSearchPagination = () => {
	const { mediaStore } = useStore();
	const router = useRouter();
	const { totalCount, mediaItems } = mediaStore;

	let page = router.query.page ? Number.parseInt(router.query.page as string) : 1;

	const actualNumbersOfResults = Math.ceil(totalCount / 100);
	/**
	 * Technically the api returns more results than 10000
	 * but it only seems to support 100 pages before returning 'Maximum number of search results have been displayed. Please refine your search.'
	*/
	const numberOfPages = Math.min(actualNumbersOfResults, 100);

	const loadNextPage = async () => {
		router.push({ query: toQueryString({ ...router.query, page: ++page }) });
	};

	const loadPreviousPage = async () => {
		router.push({ query: toQueryString({ ...router.query, page: --page }) });
	};

	const goToPage = async (page) => {
		router.push({ query: toQueryString({ ...router.query, page }) });
	};

	if (mediaItems.length === 0 || totalCount < 100)
		return <span />;

	// Untested, the nasa api broke while implementing 😅
	const getNumberButtons = () => {
		const buttons = [];

		for (let i = 0; i < numberOfPages; i++) {
			buttons.push(
				<button
					key={i}
					onClick={() => goToPage(i + 1)}
					disabled={page === i + 1}
				>
					{i + 1}
				</button>
			);
		}

		return buttons;
	}

	return (
		<>
			<div
				className={styles.pagination_container}
			>
				<button
					className={styles["media-search__form__load-more-button"]}
					onClick={loadPreviousPage}
					disabled={page === 1 || !page}
				>
					Previous page
				</button>

				<div className={styles.number_buttons}>
					{getNumberButtons()}
				</div>

				<button
					className={styles["media-search__form__load-more-button"]}
					onClick={loadNextPage}
					disabled={page >= numberOfPages}
				>
					Next page
				</button>
			</div>
			<div>
				{
					actualNumbersOfResults > 100
						? <>There are <b>{actualNumbersOfResults * 100 - 10000}</b> more results after page 100, but nasa says <i>"Maximum number of search results have been displayed. Please refine your search."</i>. So do that to get more results 😁</>
						: ""
				}
			</div>
		</>
	);
};

export default MediaSearchPagination;
