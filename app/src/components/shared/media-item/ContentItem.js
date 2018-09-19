import React from "react";
import "./MediaItem.css";
import APIClient from "../../network/APIClient";
import "./ContentItem.css";

/**
 * Content item for displaying content
 * Note: only supports images!
 */
export default class ContentItem extends React.Component {

    state = {
        fullscreenImage: undefined,
        loading: false
    };

    render() {
        return (
            <span>
                {this.state.loading ? "Loading... " : ""} {this._getContent()}
            </span>
        );
    }

    /**
     * Returns the correct markup for the content type provided.
     */
    _getContent() {
        switch (this.props.contentType) {
            case "image":
                return (<span>
                    <img
                        onClick={async e => { await this._enterFullscreen(e) }}
                        className="media-item__image"
                        src={this.props.src}
                        title="Click for fullscreen"
                        alt={this.props.title}
                    />

                    <div
                        className="content-item--fullscreen"
                        title="Click to close"
                        ref={ref => this.img = ref}
                        hidden={!this.state.fullscreenImage}
                        onClick={() => this._clickToExitFullscreen()}>

                        <img
                            className="content-item__image--fullscreen"
                            title="Click to close"
                            alt="Highres version"
                            src={this.state.fullscreenImage} />

                    </div>
                </span>
                );
            default:
                return <span>Unsupported media format, src: {this.props.src || "unable to determine src"}</span>
        }
    }

    /**
     * Enters fullscreen mode for the content
     * 
     * @param {React.SyntheticEvent<HTMLImageElement>} e 
     */
    async _enterFullscreen(e) {
        e.preventDefault();

        this.setState({
            ...this.state,
            loading: true
        });

        const resp = await APIClient.getMediaById(this.props.id);
        const imageUrl = !resp.collection.items[0].href.includes(".tif") ? resp.collection.items[0].href : resp.collection.items[1].href

        this.setState({
            fullscreenImage: imageUrl,
            loading: false
        });
    }

    /**
     * Exits fullscreen
     */
    _exitFullscreen() {
        this.setState({
            fullscreenImage: undefined
        });
    }

    /**
     * Clicks to exit fullscreen
     */
    _clickToExitFullscreen() {
        this._exitFullscreen();
    }

}