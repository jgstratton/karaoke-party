import React from 'react';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../../css/table-classes.css';
import Loading from '../common/Loading';
import VideoPreview from './VideoPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import YoutubeService from '../../services/YouTubeService';

const YouTubeResults = (props) => {
	const [downloadInProgress, setDownloadInProgress] = useState(false);

	async function downloadVideo(url) {
		setDownloadInProgress(true);
		let fileName = await YoutubeService.downloadYoutube(url);
		setDownloadInProgress(false);
		console.log(fileName);
	}
	return (
		<div>
			{downloadInProgress && (
				<Loading overlay={true} message="Download in progress... this may take a minute..." />
			)}
			<Card className="mt-3">
				<Card.Body>
					<Card.Text>
						<span className="text-warning mb-5">Songs found in youtube (top 10 results)</span>
						{props.loading ? (
							<Loading />
						) : (
							<div>
								{props.results.map((r) => (
									<div>
										<Button className="float-right" onClick={() => downloadVideo(r.url)}>
											<FontAwesomeIcon icon={faDownload} /> Download and add to queue
										</Button>
										<span>{r.title}</span>
										<VideoPreview id={r.id} />
										<a href={r.url}>{r.url}</a>
										<hr />
									</div>
								))}
							</div>
						)}
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};
export default YouTubeResults;
