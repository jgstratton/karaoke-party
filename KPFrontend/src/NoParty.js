import React from 'react';
import { useState } from 'react';
import PartyService from './services/PartyService';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const NoParty = (props) => {
	const [form, setForm] = useState({
		partyName: '',
		joinCode: ''
	});

	function handlePartyNameChange(e) {
		setForm({
			...form,
			partyName: e.target.value
		});
	}

	function handleJoinCodeChange(e) {
		setForm({
			...form,
			joinCode: e.target.value
		});
	}

	async function handleCreate(e){
		let party = await PartyService.createParty(form.partyName);
		props.setParty(party);
	}

	async function handleJoin(e) {
		let party = await PartyService.fetchParty(form.joinCode);
		props.setParty(party);
	}

	return (
		<div>
			<h3 className="text-center">Welcome to Karaoke Party</h3>
				<Row>
					<Col xs={12} md={5}>
						<Card style={{height:"250px"}}>
							<Card.Body>
								<Card.Title>Create new party</Card.Title>
								<Card.Text className="text-warning">
									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Party Name</Form.Label>
										<Form.Control type="text" placeholder="Party Name" value={form.partyName} onChange={handlePartyNameChange}/>
										<Form.Text className="text-muted">
										Come up with a name and get the party started!
										</Form.Text>
									</Form.Group>
									<Button variant="primary" type="submit" onClick={handleCreate}>
										Create
									</Button>
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col xs={12} md={2} className="text-muted text-center">
						or
					</Col>
					<Col xs={12} md={5}>
						<Card style={{height:"250px"}}>
							<Card.Body>
								<Card.Title>Join an existing party</Card.Title>
								<Card.Text className="text-warning">
									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Enter party code</Form.Label>
										<Form.Control type="text" placeholder="Party Code" value={form.joinCode} onChange={handleJoinCodeChange} />
										<Form.Text className="text-muted">
										Enter the 4 character party code and join in on the fun!
										</Form.Text>
									</Form.Group>
									<Button variant="primary" type="submit" onClick={handleJoin}>
										Join
									</Button>
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
		</div>
	)
}
export default NoParty;