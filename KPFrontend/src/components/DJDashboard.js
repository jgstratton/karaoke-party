import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SingerList from './common/SingerList';
import Menu from './common/Menu';
import Title from './common/Title';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DJDashboard = (props) => {
	const onDragEnd = (result) => {
		if (result.reason === 'DROP') {
			if (result.destination.droppableId === 'queue') {
				let newQueue = props.party.queue;
				let targetId = Number(result.draggableId);
				let targetLocation = result.destination.index + 1;
				for (var i = 0; i < newQueue.length; i++) {
					if (newQueue[i].performanceID === targetId) {
						newQueue[i].order = targetLocation;
					} else if (newQueue[i].order >= targetLocation) {
						newQueue[i].order += 1;
					}
				}
				props.updateQueue(newQueue);
			}
		}
	};
	return (
		<div>
			<Menu user={props.user} leaveParty={props.leaveParty} />
			<Title party={props.party} />
			<Row>
				<DragDropContext onDragEnd={onDragEnd}>
					<Col xs={4}>
						<Card>
							<Card.Body>
								<Card.Title>Requests</Card.Title>
								<Card.Text className="text-warning">
									<Droppable droppableId="requests" type="performanceItem">
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<ListGroup>
													{props.party.queue
														.filter((s) => !s.order || s.order === 0)
														.map((s, i) => (
															<Draggable
																key={s.performanceID}
																draggableId={s.performanceID.toString()}
																index={i}
															>
																{(provided) => (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																	>
																		<ListGroup.Item>
																			<div className="text-warning">
																				{s.singer?.name}
																			</div>
																			{s.song?.title}
																		</ListGroup.Item>
																	</div>
																)}
															</Draggable>
														))}
													{provided.placeholder}
												</ListGroup>
											</div>
										)}
									</Droppable>
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col xs={4}>
						<Card>
							<Card.Body>
								<Card.Title>Song Queue</Card.Title>
								<Card.Text className="text-warning">
									<Droppable droppableId="queue" type="performanceItem">
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className="pb-5"
											>
												<ListGroup>
													{props.party.queue
														.filter((s) => s.order > 0)
														.map((s, i) => (
															<Draggable
																key={s.performanceID}
																draggableId={s.performanceID.toString()}
																index={i}
															>
																{(provided) => (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																	>
																		<ListGroup.Item key={s.performanceID}>
																			<div className="text-warning">
																				{s.singer?.name}
																			</div>
																			{s.song?.title}
																		</ListGroup.Item>
																	</div>
																)}
															</Draggable>
														))}
													{provided.placeholder}
												</ListGroup>
											</div>
										)}
									</Droppable>
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</DragDropContext>

				<Col xs={4}>
					<SingerList singers={props.party.singers} />
				</Col>
			</Row>
		</div>
	);
};
export default DJDashboard;
