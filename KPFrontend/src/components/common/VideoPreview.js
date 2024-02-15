import React from 'react';
import { useState, useEffect } from 'react';

const VideoPreview = (props) => {
	const [imageNum, setImageNum] = useState(0);
	const imageList = ['mqdefault.jpg', 'mq1.jpg', 'mq2.jpg', 'mq3.jpg'];

	function GetIdFromUrl(url) {
		const splitStr = url.split('?v=');
		if (splitStr.length === 2) {
			return splitStr[1];
		}
		return '';
	}

	useEffect(() => {
		const timer = setInterval(() => setImageNum(imageNum === 3 ? 0 : imageNum + 1), 1000);
		return () => clearInterval(timer);
	}, [imageNum]);

	return (
		<div>
			<img
				id="youtube-thumb"
				src={`https://img.youtube.com/vi/${GetIdFromUrl(props.url)}/${imageList[imageNum]}`}
				alt="video-thumbnail"
			/>
		</div>
	);
};
export default VideoPreview;
