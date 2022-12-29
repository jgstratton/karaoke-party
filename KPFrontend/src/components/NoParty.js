import React from 'react';
import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

const NoParty = (props) => {
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({
		partyName: '',
		joinCode: '',
		djName: '',
		singerName: '',
	});
	const navigate = useNavigate();

	function handleInputChange(e) {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	}

	async function handleCreate(e) {
		let party = await ApiService.createParty(form.partyName, form.djName);
		props.updateParty(party);
		props.setUser(party.singers[0]);
		navigate('/home');
	}

	async function handleJoin(e) {
		let party = await ApiService.fetchParty(form.joinCode);
		let singer = await ApiService.joinParty(form.joinCode, form.singerName);
		props.updateParty(party);
		props.setUser(singer);
		navigate('/home');
	}

	useEffect(() => {
		if (props.user && props.user.singerId && props.party && props.party.partyKey) {
			navigate('/home');
		}
		setLoading(false);
	}, [props.user, props.party, navigate]);

	return loading ? (
		<div>Loading...</div>
	) : (
		<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
			<h3 className="text-center">Welcome to Karaoke Party</h3>
			<Row>
				<Col xs={12} md={5}>
					<Card>
						<Card.Body>
							<Card.Title>Create new party</Card.Title>
							<Card.Text className="text-warning">
								<Form.Group className="mb-3" controlId="formBasicEmail">
									<Form.Label>Party Name</Form.Label>
									<Form.Control
										type="text"
										placeholder="Party Name"
										name="partyName"
										value={form.partyName}
										onChange={handleInputChange}
									/>
									<Form.Text className="text-muted">
										Come up with a name and get the party started!
									</Form.Text>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Singer's Name</Form.Label>
									<Form.Control
										type="text"
										placeholder="DJ's Name"
										name="djName"
										value={form.djName}
										onChange={handleInputChange}
									/>
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
									<Form.Control
										type="text"
										placeholder="Party Code"
										name="joinCode"
										value={form.joinCode}
										onChange={handleInputChange}
									/>
									<Form.Text className="text-muted">
										Enter the 4 character party code and join in on the fun!
									</Form.Text>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Singer's Name</Form.Label>
									<Form.Control
										type="text"
										placeholder="Singer's Name"
										name="singerName"
										value={form.singerName}
										onChange={handleInputChange}
									/>
									<Form.Text className="text-muted">Everyone will be able to see your name</Form.Text>
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
	);
};
export default NoParty;
