import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../../css/table-classes.css';
import Loading from '../common/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import VideoPreview from './VideoPreview';

const LocalResults = (props) => {
	return (
		<Card className="mt-3">
			<Card.Body>
				<Card.Title>Songs found in library</Card.Title>
				<Card.Text className="text-warning">
					{props.loading ? (
						<Loading />
					) : (
						<>
							{props.results.length > 0 ? (
								<>
									{props.results.map((r, i) => (
										<div key={r.fileName}>
											<Button
												className="float-right"
												onClick={() => props.addToQueue(r.fileName)}
											>
												<FontAwesomeIcon icon={faDownload} /> Add to queue
											</Button>
											<VideoPreview url={r.url} />
											<div>{r.title}</div>
											<a href={r.url}>{r.url}</a>
											<hr />
										</div>
									))}
								</>
							) : (
								<div className="text-muted mt-3">No downloaded results found in library</div>
							)}
						</>
					)}
				</Card.Text>
			</Card.Body>
		</Card>
	);
};
export default LocalResults;
