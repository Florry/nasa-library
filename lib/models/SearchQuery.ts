interface SearchQueryInput {

	/** Free text search terms to compare to all indexed metadata. */
	q?: string;

	/** NASA center which published the media. */
	center?: string;

	/** Terms to search for in “Description” fields. */
	description?: string;

	/** Terms to search for in “508 Description” fields */
	description_508?: string;

	/** Terms to search for in “Keywords” fields. Separate multiple values with commas. */
	keywords?: string;

	/** Terms to search for in “Location” fields. */
	location?: string;

	/** Media types to restrict the search to. Available types: [“image”, “audio”]. Separate multiple values with commas. */
	media_type?: string;

	/** The media asset’s NASA ID. */
	nasa_id?: string;

	/** The primary photographer’s name. */
	photographer?: string;

	/** A secondary photographer/videographer’s name. */
	secondary_creator?: string;

	/** Terms to search for in “Title” fields. */
	title?: string;

	/** The start year for results. Format: YYYY. */
	year_start?: string;

	/** The end year for results. Format: YYYY. */
	year_end?: string;

	/** the current page */
	page?: number;
}

/**
 * Model for search queries for the nasa search api
 */
export class SearchQuery {

	q?: string;
	center?: string;
	description?: string;
	description_508?: string;
	keywords?: string;
	location?: string;
	media_type?: string;
	nasa_id?: string;
	photographer?: string;
	secondary_creator?: string;
	title?: string;
	year_start?: string;
	year_end?: string;
	page?: number;

	/**
	 * Makes sure we don't input any invalid queries to the nasa api.
	 */
	constructor(httpQuery: SearchQueryInput) {
		this.q = httpQuery.q;
		this.center = httpQuery.center;
		this.description = httpQuery.description;
		this.description_508 = httpQuery.description_508;
		this.keywords = httpQuery.keywords;
		this.location = httpQuery.location;
		this.media_type = httpQuery.media_type;
		this.nasa_id = httpQuery.nasa_id;
		this.photographer = httpQuery.photographer;
		this.secondary_creator = httpQuery.secondary_creator;
		this.title = httpQuery.title;
		this.year_start = httpQuery.year_start;
		this.year_end = httpQuery.year_end;

		if (httpQuery.page! > 0)
			this.page = httpQuery.page;
		else
			this.page = 1;
	}

	toQueryString() {
		let queryString = "";

		Object.keys(this).forEach((queryKey, i) => {

			if ((this as any)[queryKey]) {
				if (i !== 0)
					queryString += "&";
				queryString += `${queryKey}=${(this as any)[queryKey]}`;
			}
		});

		if (queryString.length > 0)
			queryString = "?" + queryString;

		return queryString;
	}

}
