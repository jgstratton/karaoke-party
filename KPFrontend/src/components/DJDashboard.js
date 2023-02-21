import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Menu from './common/Menu';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StatusService from '../services/StatusService';
import { sendMovePerformance } from '../slices/performancesSlice';
import Player from './dj/Player';

const DJDashboard = (props) => {
	const dispatch = useDispatch();
	const performances = useSelector((state) => state.performances);

	const onDragEnd = (result) => {
		if (result.reason === 'DROP' && result.destination) {
			const targetStatus = StatusService.getStatusId(result.destination.droppableId);
			const targetId = Number(result.draggableId);
			const targetPerformance = performances[result.source.droppableId].filter(
				(q) => q.performanceId === targetId
			)[0];
			const targetIndex = result.destination.index;
			dispatch(
				sendMovePerformance({
					performanceId: targetPerformance.id,
					TargetStatus: targetStatus,
					TargetIndex: targetIndex,
				})
			);
		}
	};
	useEffect(() => {
		console.log('DJ Dashboard: Performances', performances);
	}, [performances]);

	return (
		<div>
			<Menu />
			<Row>
				<DragDropContext onDragEnd={onDragEnd}>
					<Col md={4}>
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
															key={s.performanceId}
															draggableId={s.performanceId.toString()}
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
					<Col md={4}>
						<Player />
						<Card>
							<Card.Body>
								<Card.Title>Song Queue</Card.Title>
								<Card.Text className="text-warning">
									<Droppable droppableId="queued" type="performanceItem">
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
															key={s.performanceId}
															draggableId={s.performanceId.toString()}
															index={i}
														>
															{(provided) => (
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<ListGroup.Item key={s.performanceId}>
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

				<Col md={4}>
					<Card>
						<Card.Body>
							<Card.Title>Completed Songs (Most Recent First)</Card.Title>
							<Card.Text className="text-warning">
								<ListGroup>
									{performances.completed.map((s, i) => (
										<ListGroup.Item key={s.performanceId}>
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
