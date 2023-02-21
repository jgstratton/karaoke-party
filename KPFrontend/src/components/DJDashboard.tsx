import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Menu from './common/Menu';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	ResponderProvided,
	DraggableLocation,
} from 'react-beautiful-dnd';
import StatusService from '../services/StatusService';
import { sendMovePerformance } from '../slices/performancesSlice';
import Player from './dj/Player';
import { RootState } from '../store';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';

interface state {
	requests: PerformanceDTO[];
	queued: PerformanceDTO[];
}
const DJDashboard = () => {
	const dispatch = useDispatch();
	const performances = useSelector((state: RootState) => state.performances);
	const [state, setState] = useState<state>({
		requests: [],
		queued: [],
	});

	const getItems = (itemKey: string) => {
		return itemKey === 'requests'
			? JSON.parse(JSON.stringify(state.requests))
			: JSON.parse(JSON.stringify(state.queued));
	};

	// a little function to help us with reordering the result
	const reorder = (list: PerformanceDTO[], startIndex: number, endIndex: number) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	/**
	 * Moves an item from one list to another list.
	 */
	const move = (
		source: PerformanceDTO[],
		destination: PerformanceDTO[],
		droppableSource: DraggableLocation,
		droppableDestination: DraggableLocation
	) => {
		const sourceClone = Array.from(source);
		const destClone = Array.from(destination);
		const [removed] = sourceClone.splice(droppableSource.index, 1);

		destClone.splice(droppableDestination.index, 0, removed);

		const result = {};
		// @ts-ignore
		result[droppableSource.droppableId] = sourceClone;
		// @ts-ignore
		result[droppableDestination.droppableId] = destClone;

		return result;
	};

	const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
		const { source, destination } = result;

		// dropped outside the list
		if (!destination || !(result.reason === 'DROP')) {
			return;
		}

		if (source.droppableId === destination.droppableId) {
			const items = reorder(getItems(source.droppableId), source.index, destination.index);

			let state = {
				requests: getItems('requests'),
				queued: getItems('queued'),
			};
			// @ts-ignore
			state[source.droppableId] = items;

			// @ts-ignore
			setState(state);
		} else {
			const result = move(getItems(source.droppableId), getItems(destination.droppableId), source, destination);
			setState({
				// @ts-ignore
				requests: result.requests,
				// @ts-ignore
				queued: result.queued,
			});
		}

		// dispatch the changes to the server
		const targetStatus = StatusService.getStatusId(destination.droppableId);
		const targetId = Number(result.draggableId);
		// @ts-ignore
		const targetPerformanceRef = performances[result.source.droppableId].filter(
			// @ts-ignore
			(q) => q.performanceId === targetId
		)[0];
		const targetPerformance = { ...targetPerformanceRef };
		const targetIndex = destination.index;

		dispatch(
			sendMovePerformance({
				performanceId: targetPerformance.performanceId,
				targetStatus: targetStatus,
				targetIndex: targetIndex,
			})
		);
	};

	useEffect(() => {
		setState({
			requests: performances.requests,
			queued: performances.queued,
		});
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
												// @ts-ignore
												{...provided.draggableProps}
												// @ts-ignore
												{...provided.dragHandleProps}
											>
												<ListGroup>
													{state.requests.map((s, i) => (
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
																			{s.singerName}
																		</div>
																		{s.songTitle}
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
												// @ts-ignore
												{...provided.draggableProps}
												// @ts-ignore
												{...provided.dragHandleProps}
												className="pb-5"
											>
												<ListGroup>
													{state.queued.map((s, i) => (
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
																			{s.singerName}
																		</div>
																		{s.songTitle}
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
											<div className="text-warning">{s.singerName}</div>
											{s.songTitle}
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
