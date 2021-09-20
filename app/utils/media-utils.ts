import { MediaItem } from "../models/MediaItem";

const unsupportedFormats = [".tif", ".mp4", ".json"];

const formatIsSupported = (href: string) => {
	if (!href)
		return true;

	let isSupported = true;

	unsupportedFormats.forEach((format) => {
		if (href.includes(format))
			isSupported = false;
	});

	return isSupported;
};

export function getSupportedMedia(mediaItem: any) {
	// TODO: not working properly, see http://localhost:3000/?q=video&page=1 & Video File - Russian Space Pioneer Alexei Leonov
	const supportedMedia = mediaItem?.collection?.items
		.filter((media) => formatIsSupported(media.href));

	return supportedMedia?.length ? supportedMedia[0].href : undefined;
};

export function getNasaId(item: MediaItem) {
	return item.data && item.data.length > 0 ? item.data[0].nasa_id : null;
}
