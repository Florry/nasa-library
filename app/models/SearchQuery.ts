export interface SearchQuery {

	/** Free text search terms to compare to all indexed metadata. */
	q: string;

	/** NASA center which published the media. */
	center: string;

	/** Terms to search for in “Description” fields. */
	description: string;

	/** Terms to search for in “508 Description” fields */
	description_508: string;

	/** Terms to search for in “Keywords” fields. Separate multiple values with commas. */
	keywords: string;

	/** Terms to search for in “Location” fields. */
	location: string;

	/** Media types to restrict the search to. Available types: [“image”, “audio”]. Separate multiple values with commas. */
	media_type: string;

	/** The media asset’s NASA ID. */
	nasa_id: string;

	/** The primary photographer’s name. */
	photographer: string;

	/** A secondary photographer/videographer’s name. */
	secondary_creator: string;

	/** Terms to search for in “Title” fields. */
	title: string;

	/** The start year for results. Format: YYYY. */
	year_start: string;

	/** The end year for results. Format: YYYY. */
	year_end: string;

	/** the current page */
	page: number;
}
