import React from 'react';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../../css/table-classes.css';
import Loading from '../common/Loading';
import VideoPreview from './VideoPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import YTService from '../../services/YTService';
import ApiService from '../../services/ApiService';

const YouTubeResults = (props) => {
	const [downloadInProgress, setDownloadInProgress] = useState(false);

	async function downloadVideo(title, url) {
		setDownloadInProgress(true);
		let fileName = await YTService.downloadYoutube(url);
		await ApiService.addSong({
			fileName: fileName,
			title: title,
			url: url,
		});
		setDownloadInProgress(false);
		props.addToQueue(fileName);
	}
	return (
		<div>
			{downloadInProgress && (
				<Loading overlay={true} message="Download in progress... this may take a minute..." />
			)}
			<Card className="mt-3">
				<Card.Body>
					<Card.Title>Songs found on youtube</Card.Title>
					<Card.Text className="text-warning">
						{props.loading ? (
							<Loading />
						) : (
							<>
								{props.results.map((r) => (
									<div key={r.id}>
										<Button className="float-right" onClick={() => downloadVideo(r.title, r.url)}>
											<FontAwesomeIcon icon={faDownload} /> Download and add to queue
										</Button>
										<VideoPreview id={r.id} />
										<div>{r.title}</div>
										<a href={r.url}>{r.url}</a>
										<hr />
									</div>
								))}
							</>
						)}
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};
export default YouTubeResults;
