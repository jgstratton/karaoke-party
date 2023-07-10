import React from 'react';
import PropTypes from 'prop-types';
import styles from './VideoEmbed.module.css';
interface iProps {
	embedId: string;
}

const YoutubeEmbed = ({ embedId }: iProps) => {
	console.log(`https://www.youtube.com/embed/${embedId}`);

	return (
		<div className={styles.videoResponsive}>
			<iframe
				width="400"
				height="200"
				src={`https://www.youtube.com/embed/${embedId}`}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				title="Embedded youtube"
			/>
		</div>
	);
};

YoutubeEmbed.propTypes = {
	embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
