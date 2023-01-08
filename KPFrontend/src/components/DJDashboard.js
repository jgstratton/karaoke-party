import React from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Menu from './common/Menu';
import Title from './common/Title';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DJDashboard = (props) => {
	// const dispatch = useDispatch();
	const party = useSelector((state) => state.party);
	const performances = useSelector((state) => state.performances);

	const onDragEnd = (result) => {
		if (result.reason === 'DROP') {
			console.log(result);
			if (result.destination.droppableId === 'queue') {
				let targetId = Number(result.draggableId);
				let targetLocation = result.destination.index + 1;
				for (var i = 0; i < party.queue.length; i++) {
					let newPerformance = { ...party.party.queue[i] };
					if (newPerformance.performanceID === targetId) {
						newPerformance.order = targetLocation;
						//props.updatePerformance(newPerformance);
					} else if (newPerformance.order >= targetLocation) {
						newPerformance.order += 1;
						//props.updatePerformance(newPerformance);
					}
				}
			}
		}
	};
	console.log(performances);
	return (
		<div>
			<Menu />
			<Title />
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
													{performances.requests.map((s, i) => (
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
													{performances.queued.map((s, i) => (
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
					<Card>
						<Card.Body>
							<Card.Title>Completed Songs (Most Recent First)</Card.Title>
							<Card.Text className="text-warning">
								<ListGroup>
									{performances.completed.map((s, i) => (
										<ListGroup.Item key={s.performanceID}>
											<div className="text-warning">{s.singer?.name}</div>
											{s.song?.title}
										</ListGroup.Item>
									))}
								</ListGroup>
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
};
export default DJDashboard;
