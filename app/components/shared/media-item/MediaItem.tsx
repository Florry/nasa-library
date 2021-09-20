import React, { useState } from "react";
import { useStore } from "../../../stores/StoreContext";
import { formatDate } from "../../../utils/utils";
import ContentItem from "./ContentItem";
import styles from "./MediaItem.module.css";

interface Props {
	id: string;
	resultNumber: number;
	removeOnUnfavorite?: boolean;
}

const MediaItem = ({ id, resultNumber, removeOnUnfavorite }: Props) => {
	const { mediaStore, metadataStore } = useStore();
	const metadata = metadataStore.getMetadatDataById(id);

	const [metadataUnfolded, setMetadataUnfolded] = useState(false);
	const [loading, setLoading] = useState(false);

	const { isFavorited, data, links } = mediaStore.getMediaById(id);
	const media: any = links?.length > 0 ? links[0] : {};
	const title = data?.length > 0 ? data[0].title : "No title";
	const date = data?.length > 0 ? data[0].date_created : "No date found"

	const unfoldMetadata = async (e) => {
		e.preventDefault();

		if (loading)
			return;

		if (metadataUnfolded) {
			setMetadataUnfolded(false);
			return;
		} else if (metadata) {
			setMetadataUnfolded(true);
			return;
		}

		try {
			setLoading(true);
			await metadataStore.loadMetadataById(id);
			setMetadataUnfolded(true);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}


	/**
	 * Prepares markup for the metadata table
	 */
	const getMetadataTable = () => {
		if (!metadata)
			return <span />

		const formatData = (metadata) => {
			if (Array.isArray(metadata)) {
				if (isPrimitiveArray(metadata)) {
					return metadata.join(", ");
				} else if (isObjectArray(metadata)) {
					return Object.keys(metadata)
						.map(key => {
							return formatData(metadata[key]);
						})
						.join(",");
				}
			}
			else if (typeof metadata === "object" && !!metadata)
				return Object.keys(metadata).join(", ");
			else
				return metadata;

			function isPrimitiveArray(array: any[]) {
				return typeof array[0] === "string"
					|| typeof array[0] === "number"
					|| typeof array[0] === "bigint"
					|| typeof array[0] === "boolean"
					|| typeof array[0] === "undefined"
					|| !array[0];
			}

			function isObjectArray(array: any[]) {
				return typeof array[0] === "object" && !!array[0];
			}
		};

		const rows = [];

		Object.keys(metadata)
			.sort()
			.forEach((key, i) => {
				rows.push(
					<tr key={i}>
						<td>
							{
								typeof key === "object" && key
									? Object.keys(key).join(", ")
									: key
							}
						</td>
						<td>
							{formatData(metadata[key])}
						</td>
					</tr>
				);
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

	return (
		<div className={styles["media-item"]}>

			<div className={styles["media-item__media"]}>

				<ContentItem
					contentType={media.render}
					src={media.href}
					title={title}
					id={id}
				/>

			</div>

			<div className={styles["media-item__details"]}>

				<p className={styles["media-item__date"]}>{formatDate(date)}</p>

				<span
					title={isFavorited ? "unfavorite" : "favorite"}
					onClick={() => mediaStore.toggleFavorited(id, removeOnUnfavorite)}
					className={styles["media-item__starred"]}>

					{
						isFavorited
							? <img src="/star-full.png" alt="filled star" />
							: <img src="/star-empty.png" alt="empty star" />
					}

				</span>

				<span className={styles["media-item__title"]}>
					<b>{resultNumber + 1}.</b>
					{title}
				</span>

			</div>

			<div className="clearfix" />

			<button onClick={unfoldMetadata}>
				{metadataUnfolded ? "V Metadata" : "> Metadata"} {loading ? "- Loading..." : ""}
			</button>
			<div
				className={styles["media-item__metadata"]}
				hidden={!metadata || !metadataUnfolded}>
				{getMetadataTable()}
			</div>

		</div>
	);
};

export default MediaItem;
