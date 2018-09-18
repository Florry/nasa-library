import React from "react";
import "./MediaSearch.css";
import Input from "../../shared/Input";
import APIClient from "../../network/APIClient";
import MediaItem from "../../shared/media-item/MediaItem";
import { MediaItemContext } from "../../shared/media-item/context/MediaItemContext";

export default class MediaSearch extends React.Component {

    render() {
        return (
            <div className="media-search">

                <h2>Search Media</h2>

                <form
                    className="media-search__form"
                    onSubmit={async () => await this._doSearch()}>
                    <Input
                        onChange={(value) => { this.setState({ ...this.state, query: { ...this.state.query, q: value } }) }}
                        placeholder="search query"
                        value={this.state.query.q}
                    />
                    <Input
                        onChange={(value) => { this.setState({ ...this.state, query: { ...this.state.query, description: value } }) }}
                        placeholder="description"
                        value={this.state.query.description}
                    />
                    <Input
                        onChange={(value) => { this.setState({ ...this.state, query: { ...this.state.query, keywords: value } }) }}
                        placeholder="keywords"
                        value={this.state.query.keywords}
                    />
                    <Input
                        onChange={(value) => { this.setState({ ...this.state, query: { ...this.state.query, nasa_id: value } }) }}
                        placeholder="nasa_id"
                        value={this.state.query.nasa_id}
                    />
                    <Input
                        onChange={(value) => { this.setState({ ...this.state, query: { ...this.state.query, location: value } }) }}
                        placeholder="location"
                        value={this.state.query.location}
                    />
                    <Input
                        onChange={(value) => { this.setState({ ...this.state, query: { ...this.state.query, title: value } }) }}
                        placeholder="title"
                        value={this.state.query.title}
                    />
                    <Input
                        onChange={(value) => { this.setState({ ...this.state, query: { ...this.state.query, year_start: value } }) }}
                        placeholder="from year"
                        value={this.state.query.year_start}
                    />
                    <Input
                        onChange={(value) => { this.setState({ ...this.state, query: { ...this.state.query, year_end: value } }) }}
                        placeholder="to year"
                        value={this.state.query.year_end}
                    />

                    <button
                        className="media-search__form__search-button"
                        type="submit">
                        Search
                    </button>

                    <button
                        onClick={e => this._clearSearchQuery(e)}
                        className="media-search__form__clear-search-button">
                        Clear search
                    </button>
                </form>

                <div className="media-search__search-result">
                    <MediaItemContext.Provider value={this.state}>

                        {this._getResults()}

                        <button
                            className="media-search__form__load-more-button"
                            hidden={!(
                                this.state.mediaItems.length > 0 &&
                                this.state.mediaItems.length < this.state.currentNumberOfResults
                            )}
                            onClick={e => this._loadNextPage(e)} >
                            Load more...
                    </button>

                    </MediaItemContext.Provider>
                </div>

            </div >
        );
    }

    constructor(props) {
        super(props);

        this.toggleFavorited = async (nasaId, state) => {
            if (state)
                await APIClient.removeFavorite(nasaId);
            else
                await APIClient.addFavorite(nasaId, this.state.mediaItems.find(item => item.data[0].nasa_id === nasaId));

            const mediaItems = this.state.mediaItems.map(item => {
                if (item.data[0].nasa_id === nasaId) {
                    item.isFavorited = state ? false : true;
                    return Object.assign({}, item);
                }
                else
                    return item;
            });

            this.setState({
                ...this.state,
                mediaItems
            });
        }

        this.state = {
            query: {
                q: "",
                description: "",
                keywords: "",
                nasa_id: "",
                location: "",
                title: "",
                year_start: "",
                year_end: "",
            },
            resultsQuery: {},
            mediaItems: [],
            currentPage: 0,
            currentNumberOfResults: -1,
            toggleFavorited: this.toggleFavorited,
            loading: false
        };
    }

    _getResults() {
        if (this.state.mediaItems.length === 0)
            return <span />;

        const mediaItems = [];

        this.state.mediaItems.forEach((item, i) => {
            const media = item.links && item.links.length > 0 ? item.links[0] : {};
            const title = item.data && item.data.length > 0 ? item.data[0].title : "No title";
            const created = item.data && item.data.length > 0 ? item.data[0].date_created : "No data"
            const id = item.data && item.data.length > 0 ? item.data[0].nasa_id : null;
            const isFavorited = item.isFavorited || false;

            mediaItems.push(
                <MediaItem
                    key={i}
                    resultNumber={i}
                    media={media}
                    title={title}
                    date={created}
                    isFavorited={isFavorited}
                    id={id}
                    parent={this}
                />
            );
        });

        return mediaItems;
    }

    _queryIsEmpty() {
        return this.state.query.q === ""
            && this.state.query.description === ""
            && this.state.query.keywords === ""
            && this.state.query.nasa_id === ""
            && this.state.query.location === ""
            && this.state.query.title === ""
            && this.state.query.year_start === ""
            && this.state.query.year_end === "";
    }

    async _doSearch() {
        if (this.state.loading || this._queryIsEmpty())
            return;

        this.setState({
            ...this.state,
            loading: true
        });

        const query = this.state.query;
        query.page = this.state.currentPage;

        const resp = await APIClient.searchMedia(query);

        this.setState({
            ...this.state,
            mediaItems: resp.data.items,
            currentPage: 1,
            resultsQuery: Object.assign({}, this.state.query),
            currentNumberOfResults: resp.data.totalItems,
            loading: false
        });
    }

    /**
     * @param {React.SyntheticEvent<HTMLButtonElement>} e 
     */
    async _loadNextPage(e) {
        if (this.state.loading)
            return;
        e.preventDefault();

        this.setState({
            ...this.state,
            loading: true
        });

        const query = this.state.resultsQuery;
        query.page = this.state.currentPage + 1;

        const resp = await APIClient.searchMedia(query);

        this.setState({
            ...this.state,
            mediaItems: this.state.mediaItems.concat(resp.data.items),
            currentPage: this.state.currentPage++,
            loading: false
        });
    }

    /**
     * @param {React.SyntheticEvent<HTMLButtonElement>} e 
     */
    _clearSearchQuery(e) {
        e.preventDefault();

        const cleanQuery = this.state.query;

        Object.keys(cleanQuery).forEach(key => {
            cleanQuery[key] = "";
        });

        this.setState({
            ...this.state,
            query: cleanQuery,
            resultsQuery: {},
            mediaItems: [],
            currentPage: 1,
            currentNumberOfResults: -1
        });
    }

}