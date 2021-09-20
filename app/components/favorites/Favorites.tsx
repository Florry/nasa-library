import { observer } from "mobx-react";
import React, { useState } from "react";
import { useStore } from "../../stores/StoreContext";
import Input from "../shared/Input";
import MediaItem from "../shared/media-item/MediaItem";

const Favorites = () => {
	const { mediaStore } = useStore();
	const [showOnlyImages, setShowOnlyImages] = useState(false);
	const favoritesToShow = mediaStore.mediaItems.filter(favorite => favorite);

	return (
		<div>
			<h1>Favorites</h1>
			<p>Click images to zoom to fullscreen</p>
			<span>
				<label htmlFor="only-images">
					Show only images
				</label>
				<Input
					checked={showOnlyImages}
					onChange={() => setShowOnlyImages(!showOnlyImages)}
					id="only-images"
					type="checkbox"
				/>
			</span>

			{
				favoritesToShow
					.map((item, i) =>
						<MediaItem
							key={item.id}
							resultNumber={i}
							id={item.id}
							removeOnUnfavorite={true}
						/>
					)
			}
		</div>
	);
};

export default observer(Favorites);
