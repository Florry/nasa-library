/**
 * Model for search queries for the nasa search api
 */
class SearchQuery {

    /**
     * Makes sure we don't input any invalid queries to the nasa api.
     * 
     * @param {Object} httpQuery http request query object
     * @param {String} httpQuery.q Free text search terms to compare to all indexed metadata.
     * @param {String} httpQuery.center NASA center which published the media.
     * @param {String} httpQuery.description Terms to search for in “Description” fields.
     * @param {String} httpQuery.description_508 Terms to search for in “508 Description” fields
     * @param {String} httpQuery.keywords Terms to search for in “Keywords” fields. Separate multiple values with commas.
     * @param {String} httpQuery.location Terms to search for in “Location” fields.
     * @param {String} httpQuery.media_type Media types to restrict the search to. Available types: [“image”, “audio”]. Separate multiple values with commas.
     * @param {String} httpQuery.nasa_id The media asset’s NASA ID.
     * @param {String} httpQuery.photographer The primary photographer’s name.
     * @param {String} httpQuery.secondary_creator A secondary photographer/videographer’s name.
     * @param {String} httpQuery.title Terms to search for in “Title” fields.
     * @param {String} httpQuery.year_start The start year for results. Format: YYYY.
     * @param {String} httpQuery.year_end The end year for results. Format: YYYY.
     * @param {Number=} httpQuery.page the current page
     */
    constructor(httpQuery) {
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

        if (httpQuery.page > 0)
            this.page = httpQuery.page;
        else
            this.page = 1;
    }

    toQueryString() {
        let queryString = "";

        Object.keys(this).forEach((queryKey, i) => {
            if (this[queryKey]) {
                if (i !== 0)
                    queryString += "&";
                queryString += `${queryKey}=${this[queryKey]}`;
            }
        });

        if (queryString.length > 0)
            queryString = "?" + queryString;

        return queryString;
    }

}

module.exports = SearchQuery;
