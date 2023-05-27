import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ApiService from '../api/ApiService';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { populateUser } from '../slices/userSlice';
import { populateParty } from '../slices/partySlice';
import { populatePlayer, populateSettings } from '../slices/playerSlice';
import { populatePerformances } from '../slices/performancesSlice';
import StorageService from '../services/StorageService';
import Menu from './common/Menu';
import { RootState } from '../store';

const NoParty = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const party = useSelector((state: RootState) => state.party);

	const [loading, setLoading] = useState(true);
	const [mode, setMode] = useState('Join');
	const [form, setForm] = useState({
		partyName: '',
		joinCode: '',
		djName: '',
		singerName: '',
		mode: 'Join',
	});
	const navigate = useNavigate();

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	}

	async function handleCreate() {
		let partyResponse = await ApiService.createParty(form.partyName, form.djName);
		if (partyResponse) {
			let { party, dj } = partyResponse;
			dispatch(populateUser(dj));
			dispatch(populateParty(party));
			dispatch(populateSettings(party.playerSettings));
			StorageService.storeUser(dj);
			StorageService.storeParty(party);
			navigate('/redirectHome');
		}
	}

	async function handleJoin() {
		let curParty = await ApiService.fetchParty(form.joinCode);
		let newUser = await ApiService.joinParty(form.joinCode, form.singerName);
		dispatch(populateParty(curParty));
		dispatch(populatePlayer(curParty.player));
		dispatch(populateSettings(curParty.playerSettings));
		dispatch(populateUser(newUser));
		dispatch(populatePerformances(curParty.performances));
		StorageService.storeUser(newUser);
		StorageService.storeParty(curParty);
	}

	useEffect(() => {
		if (user && user.userId && party && party.partyKey) {
			navigate('/home');
		}
		setLoading(false);
	}, [user, party, navigate]);

	return loading ? (
		<div>Loading...</div>
	) : (
		<div className="container" style={{ padding: '5px', maxWidth: '450px' }}>
			<Menu />
			{mode === 'Join' ? (
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
							<hr />
							<p className="text-muted">Looking to start a brand new party?</p>
							<Button variant="link" type="submit" onClick={() => setMode('Create')} className="p-0">
								Yes! Let's start a karaoke party!
							</Button>
						</Card.Text>
					</Card.Body>
				</Card>
			) : (
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
							<hr />
							<p className="text-muted">Looking to join an existing party?</p>
							<Button variant="link" type="submit" onClick={() => setMode('Join')} className="p-0">
								Yes! I want to join in the fun!
							</Button>
						</Card.Text>
					</Card.Body>
				</Card>
			)}
		</div>
	);
};
export default NoParty;
