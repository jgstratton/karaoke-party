import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import '../../css/table-classes.css';
import Loading from '../common/Loading';

const LocalResults = (props) => {
	return (
		<Card className="mt-3">
			<Card.Body>
				<Card.Text className="text-warning">
					Songs found in library
					{props.loading ? (
						<Loading />
					) : (
						<Table striped borderless hover>
							<tbody className="condensed">
								{props.results.map((r, i) => (
									<tr key={r}>
										<td>{i + 1}</td>
										<td>{r}</td>
										<td className="text-right">
											<Button variant="link" className="p-0">
												Add to queue
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					)}
				</Card.Text>
			</Card.Body>
		</Card>
	);
};
export default LocalResults;
