import React from "react";
import "./MediaItem.css";
import ContentItem from "./ContentItem";
import { MediaItemContext } from "./context/MediaItemContext";

export default class MediaItem extends React.Component {

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

                    </div>

                )}
            </MediaItemContext.Consumer>
        );
    }

}