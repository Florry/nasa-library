import { SearchQuery } from "../models/SearchQuery";

export function toQueryString(object: any) {
	let queryString = "";

	Object.keys(object)
		.forEach((queryKey, i) => {

			if (object[queryKey]) {
				if (i !== 0)
					queryString += "&";
				queryString += `${queryKey}=${object[queryKey]}`;
			}
		});

	return queryString;
}

export function queryIsEmpty(query: SearchQuery) {
	return query.q === ""
		&& query.description === ""
		&& query.keywords === ""
		&& query.nasa_id === ""
		&& query.location === ""
		&& query.title === ""
		&& query.year_start === ""
		&& query.year_end === "";
}
