import React from "react";
import "./MediaItem.css";
import ContentItem from "./ContentItem";
import { MediaItemContext } from "./context/MediaItemContext";
import APIClient from "../../network/APIClient";

export default class MediaItem extends React.Component {

    state = {
        metadataUnfolded: false
    };

    render() {
        return (
            <MediaItemContext.Consumer>
                {(context) => (

                    <div className="media-item">

                        <div className="media-item__media">

                            <ContentItem
                                contentType={this.props.media.render}
                                src={this.props.media.href}
                                title={this.props.title}
                                id={this.props.id}
                            />

                        </div>

                        <div className="media-item__details">

                            <b>

                                <span
                                    onClick={async e => await context.toggleFavorited(this.props.id, this.props.isFavorited)}
                                    className="media-item__starred">

                                    {this.props.isFavorited ? <img src={
                                        //@ts-ignore
                                        require("../../../img/star-full.png")
                                    }
                                        alt="filled star"
                                    />
                                        :
                                        <img src={
                                            //@ts-ignore
                                            require("../../../img/star-empty.png")
                                        }
                                            alt="empty star"
                                        />}

                                </span>

                                &nbsp; {this.props.resultNumber + 1}.

                            </b>

                            {this.props.title}

                            <p>{this.props.date}</p>

                        </div>

                        <div className="clearfix" />

                        <button onClick={async e => { await this._unfoldMetadata(e) }}>
                            {this.state.metadataUnfolded ? "V Metadata" : "> Metadata"}
                        </button>
                        <div
                            className="media-item__metadata"
                            hidden={!this.state.metadata || !this.state.metadataUnfolded}>
                            {this._getMetadataTable()}
                        </div>

                    </div>

                )}
            </MediaItemContext.Consumer>
        );
    }

    /**
     * @param {React.SyntheticEvent<HTMLButtonElement>} e 
     */
    async _unfoldMetadata(e) {
        try {
            e.preventDefault();
            let metadata;

            if (!this.state.metadata)
                metadata = await APIClient.getMediaMetadata(this.props.id);
            else
                metadata = this.state.metadata;

            this.setState({
                ...this.state,
                metadataUnfolded: !this.state.metadataUnfolded,
                metadata: metadata || {}
            });
        } catch (err) {
            console.error(err);
        }
    }

    _getMetadataTable() {
        //TODO: style table so that the content won't go outside the table cells
        if (!this.state.metadata)
            return <span />

        const rows = [];

        Object.keys(this.state.metadata).sort().forEach((key, i) => {
            rows.push(<tr key={i}>
                <td>
                    {
                        typeof key === "object"
                            && key ? Object.keys(key).join(", ")
                            : key
                    }
                </td>
                <td >
                    {
                        this.state.metadata[key]
                            && Array.isArray(this.state.metadata[key])
                            ? this.state.metadata[key].join(", ")
                            : typeof this.state.metadata[key] === "object"
                                && this.state.metadata[key]
                                ? Object.keys(this.state.metadata[key]).join(", ")
                                : this.state.metadata[key]
                    }
                </td>
            </tr>);
        });

        return (
            <table>
                <thead>
                    <tr>
                        <td><b>Key</b></td>
                        <td><b>Value</b></td>
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? rows : <tr><td>unable to fetch metadata</td></tr>}
                </tbody>
            </table>
        );
    }

}