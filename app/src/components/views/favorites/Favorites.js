import React from "react";
import APIClient from "../../network/APIClient";
import MediaItem from "../../shared/media-item/MediaItem"
import { MediaItemContext } from "../../shared/media-item/context/MediaItemContext";

export default class Favorites extends React.Component {

    render() {
        return (
            <MediaItemContext.Provider value={this.state}>

                <div>
                    <h2>Favorites</h2>
                    {this._renderMediaItems()}
                </div>

            </MediaItemContext.Provider>

        );
    }

    constructor(props) {
        super(props);

        this.toggleFavorited = async (nasaId, state) => {
            if (state)
                await APIClient.removeFavorite(nasaId);
            else
                await APIClient.addFavorite(nasaId, this.state.favoriteMediaItems.find(item => item.data[0].nasa_id === nasaId));

            let favoriteMediaItems;

            if (state) {
                favoriteMediaItems = this.state.favoriteMediaItems.map(item => {
                    if (item.data[0].nasa_id === nasaId)
                        return undefined;
                    else
                        return item;
                });
                favoriteMediaItems = favoriteMediaItems.filter(item => !!item);
            }
            else {
                favoriteMediaItems = this.state.favoriteMediaItems.map(item => {
                    if (item.data[0].nasa_id === nasaId) {
                        item.isFavorited = state ? false : true;
                        return Object.assign({}, item);
                    }
                    else
                        return item;
                });
            }

            this.setState({
                ...this.state,
                favoriteMediaItems
            });
        }

        this.state = {
            toggleFavorited: this.toggleFavorited,
            favoriteMediaItems: []
        };
    }

    async componentDidMount() {
        const favoriteMediaItems = await APIClient.getFavorites();
        this.setState({ favoriteMediaItems });
    }

    _renderMediaItems() {
        if (this.state.favoriteMediaItems.length === 0)
            return <span />;

        const favoriteMediaItems = [];

        this.state.favoriteMediaItems.forEach((item, i) => {
            const media = item.links && item.links.length > 0 ? item.links[0] : {};
            const title = item.data && item.data.length > 0 ? item.data[0].title : "No title";
            const created = item.data && item.data.length > 0 ? item.data[0].date_created : "No data"
            const id = item.data && item.data.length > 0 ? item.data[0].nasa_id : null;
            const isFavorited = item.isFavorited || false;

            favoriteMediaItems.push(
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

        return favoriteMediaItems;
    }

}