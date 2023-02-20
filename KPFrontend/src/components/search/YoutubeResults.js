import React from 'react';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../css/table-classes.css';
import Loading from '../common/Loading';
import Overlay from '../common/Overlay';
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
				<Overlay>
					<Loading>Download in progress... this may take a minute...</Loading>
				</Overlay>
			)}
			<Card className="mt-3">
				<Card.Body>
					<Card.Title>Online search results</Card.Title>
					<Card.Text className="text-warning">
						{props.loading ? (
							<Loading />
						) : (
							<>
								{props.results.map((r) => (
									<Row key={r.id}>
										<Col md={8}>
											<VideoPreview url={r.url} />
											<div>{r.title}</div>
											<a href={r.url}>{r.url}</a>
										</Col>
										<Col className="text-md-right mt-sm-3 mt-md-0" md={4}>
											<Button onClick={() => downloadVideo(r.title, r.url)}>
												<FontAwesomeIcon icon={faDownload} /> Download and add to queue
											</Button>
										</Col>
										<Col sm={12}>
											<hr />
										</Col>
									</Row>
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
