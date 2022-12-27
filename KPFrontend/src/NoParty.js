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
		joinCode: '',
		djName: '',
		singerName: ''
	});

	function handleInputChange(e) {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value
		});
	};

	async function handleCreate(e){
		let party = await PartyService.createParty(form.partyName, form.djName);
		props.updateParty(party);
		props.setUser(party.singers[0]);
	}

	async function handleJoin(e) {
		debugger;
		let party = await PartyService.fetchParty(form.joinCode);
		let singer = await PartyService.joinParty(form.joinCode, form.singerName);
		props.updateParty(party);
		props.setUser(singer);
	}

	return (
		<div>
			<h3 className="text-center">Welcome to Karaoke Party</h3>
				<Row>
					<Col xs={12} md={5}>
						<Card>
							<Card.Body>
								<Card.Title>Create new party</Card.Title>
								<Card.Text className="text-warning">
									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Party Name</Form.Label>
										<Form.Control type="text" placeholder="Party Name" name="partyName" value={form.partyName} onChange={handleInputChange}/>
										<Form.Text className="text-muted">
										Come up with a name and get the party started!
										</Form.Text>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Singer's Name</Form.Label>
										<Form.Control type="text" placeholder="DJ's Name" name="djName" value={form.djName} onChange={handleInputChange} />
										<Form.Text className="text-muted">
										You are the DJ for the night, pick a name so people know who you are
										</Form.Text>
									</Form.Group>
									<Button variant="primary" type="submit" onClick={handleCreate}>
										Start the party
									</Button>
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col xs={12} md={2} className="text-muted text-center">
						or
					</Col>
					<Col xs={12} md={5}>
						<Card>
							<Card.Body>
								<Card.Title>Join an existing party</Card.Title>
								<Card.Text className="text-warning">
									<Form.Group className="mb-3">
										<Form.Label>Enter party code</Form.Label>
										<Form.Control type="text" placeholder="Party Code" name="joinCode" value={form.joinCode} onChange={handleInputChange} />
										<Form.Text className="text-muted">
										Enter the 4 character party code and join in on the fun!
										</Form.Text>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Singer's Name</Form.Label>
										<Form.Control type="text" placeholder="Singer's Name" name="singerName" value={form.singerName} onChange={handleInputChange} />
										<Form.Text className="text-muted">
										Everyone will be able to see your name
										</Form.Text>
									</Form.Group>
									<Button variant="primary" type="submit" onClick={handleJoin}>
										Join in on the fun
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