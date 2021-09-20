export interface MediaItem {

	id: string;

	isFavorited: boolean;

	href: string;

	data: {

		nasa_id: string;

		keywords: string[];

		description: string;

		description_508: string;

		title: string;

		media_type: string;

		location: string;

		date_created: string;

	}[];

	links: {

		href: string;

		rel: string;

	}[];

	collection: undefined | {
		items: {
			href: string;
		}[];
	};
}
