import React from "react";
import "./MediaItem.css";
import APIClient from "../../network/APIClient";
import "./ContentItem.css";

export default class ContentItem extends React.Component {

    state = {
        fullscreenImage: undefined
    };

    render() {
        return (
            <span>
                {this._getContent()}
            </span>
        );
    }

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
     * @param {React.SyntheticEvent<HTMLImageElement>} e 
     */
    async _enterFullscreen(e) {
        e.preventDefault();

        // if ("fullscreenEnabled" in document || "webkitFullscreenEnabled" in document || "mozFullScreenEnabled" in document || "msFullscreenEnabled" in document) {
        //     // @ts-ignore
        //     if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
        //         if ("requestFullscreen" in this.img)
        //             this.img.requestFullscreen();
        //         else if ("webkitRequestFullscreen" in this.img)
        //             // @ts-ignore
        //             this.img.webkitRequestFullscreen();
        //         else if ("mozRequestFullScreen" in this.img)
        //             // @ts-ignore
        //             this.img.mozRequestFullScreen();
        //         else if ("msRequestFullscreen" in this.img)
        //             // @ts-ignore
        //             this.img.msRequestFullscreen();
        //     }
        // }
        // else
        //     alert("Browser does not allow fullscreen");

        document.addEventListener("fullscreenchange", () => { this._exitFullscreen() });
        document.addEventListener("webkitfullscreenchange", () => { this._exitFullscreen() });
        document.addEventListener("mozfullscreenchange", () => { this._exitFullscreen() });
        document.addEventListener("MSFullscreenChange", () => { this._exitFullscreen() });

        const resp = await APIClient.getMediaById(this.props.id);
        const imageUrl = !resp.collection.items[0].href.includes(".tif") ? resp.collection.items[0].href : resp.collection.items[1].href

        this.setState({
            fullscreenImage: imageUrl
        });
    }

    _exitFullscreen() {
        this.setState({
            fullscreenImage: undefined
        });
    }

    _clickToExitFullscreen() {
        this._exitFullscreen();

        if ("exitFullscreen" in document)
            document.exitFullscreen();
        else if ("webkitExitFullscreen" in document)
            // @ts-ignore
            document.webkitExitFullscreen();
        else if ("mozCancelFullScreen" in document)
            // @ts-ignore
            document.mozCancelFullScreen();
        else if ("msExitFullscreen" in document)
            // @ts-ignore
            document.msExitFullscreen();
    }

}