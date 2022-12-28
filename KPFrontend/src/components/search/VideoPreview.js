import React from 'react';
import { useState, useEffect } from 'react';

const VideoPreview = (props) => {
	const [imageNum, setImageNum] = useState(0);
	const imageList = ['mq1.jpg', 'mq2.jpg', 'mq3.jpg'];

	useEffect(() => {
		const timer = setInterval(() => setImageNum(imageNum === 2 ? 0 : imageNum + 1), 1000);
		return () => clearInterval(timer);
	}, [imageNum]);

	return (
		<div>
			<img
				id="youtube-thumb"
				src={`https://img.youtube.com/vi/${props.id}/${imageList[imageNum]}`}
				alt="video-thumbnail"
			/>
		</div>
	);
};
export default VideoPreview;
