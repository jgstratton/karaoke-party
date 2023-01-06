import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
const Queue = (props) => {
	return (
		<div>
			<Card>
				<Card.Body>
					<Card.Title>Requests</Card.Title>
					<Card.Text className="text-warning">
						<ListGroup>
							{props.queue
								.filter((s) => s.order ?? 0 === 0)
								.map((s) => (
									<ListGroup.Item key={s.performanceID}>
										<div className="text-warning">{s.singer?.name}</div>
										{s.song?.title}
									</ListGroup.Item>
								))}
						</ListGroup>
					</Card.Text>
				</Card.Body>
			</Card>
			<Card>
				<Card.Body>
					<Card.Title>Song Queue</Card.Title>
					<Card.Text className="text-warning">
						<ListGroup>
							{props.queue
								.filter((s) => s.order > 0)
								.map((s) => (
									<ListGroup.Item key={s.performanceID}>
										<div className="text-warning">{s.singer?.name}</div>
										{s.song?.title}
									</ListGroup.Item>
								))}
						</ListGroup>
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};

export default Queue;
