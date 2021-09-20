import React, { useState } from "react";
import { useStore } from "../../../stores/StoreContext";
import { getSupportedMedia } from "../../../utils/media-utils";
import "./ContentItem.module.css";
import styles from "./ContentItem.module.css";
import "./MediaItem.module.css";
import MediaItemStyles from "./MediaItem.module.css";

interface Props {
	id: string;
	src: string;
	title: string;
	contentType: string;
}

const ContentItem = ({ id, src, title, contentType }: Props) => {
	const { mediaStore } = useStore();
	const [loading, setLoading] = useState(false);
	const [showingInFullscreen, setShowingInFullscreen] = useState(false);
	const mediaItem = mediaStore.getMediaById(id);
	const imageUrl = getSupportedMedia(mediaItem);

	const getContent = () => {
		switch (contentType) {
			case "image":
				return (
					<span>
						<img
							onClick={enterFullscreen}
							className={MediaItemStyles["media-item__image"]}
							src={src}
							title="Click for fullscreen"
							alt={title}
						/>
						{
							showingInFullscreen &&
							<div
								className={styles["content-item--fullscreen"]}
								title="Click to close"
								onClick={exitFullscreen}>
								<div className={styles.close_button}>X</div>
								<img
									className={styles["content-item__image--fullscreen"]}
									title="Click to close"
									alt="Highres version"
									src={imageUrl}
								/>
							</div>
						}
					</span>
				);
			case undefined:
				return "No content type";
			default:
				// @ts-ignore
				return <span>Unsupported media format, src: {src || "unable to determine src"}</span>
		}
	};

	const enterFullscreen = async (e) => {
		e.preventDefault();

		setLoading(true);

		if (!imageUrl)
			await mediaStore.loadMediaItemById(id);

		setTimeout(() => console.log(imageUrl), 1000);

		setShowingInFullscreen(true);
		setLoading(false);
	};

	/**
	 * Exits fullscreen
	 */
	const exitFullscreen = () => {
		setShowingInFullscreen(false);
	};

	return (
		<span>
			{loading ? "Loading... " : ""} {getContent()}
		</span>
	);
};

export default ContentItem;
