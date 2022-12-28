import React from 'react';
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';

const SingerList = (props) => {
	return (
		<div>
			<Card>
				<Card.Body>
					<Card.Title>Singers</Card.Title>
					<Card.Text className="text-warning">
						<ListGroup>
							{props.singers.map((s) => (
								<ListGroup.Item key={s.singerId}>{s.name}</ListGroup.Item>
							))}
						</ListGroup>
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	)
}
export default SingerList;