import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ApiService from '../api/ApiService';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { populateUser } from '../slices/userSlice';
import { joinHub, populateParty } from '../slices/partySlice';
import { populatePlayer, populateSettings } from '../slices/playerSlice';
import { populatePerformances } from '../slices/performancesSlice';
import StorageService from '../services/StorageService';
import Menu from './common/Menu';
import { RootState } from '../store';
import PartyApi from '../api/PartyApi';
import { populateSingers } from '../slices/singerSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { CreateParty } from '../mediators/PartyMediator';

const NoParty = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const party = useSelector((state: RootState) => state.party);
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(true);
	const [mode, setMode] = useState('Join');
	const [form, setForm] = useState({
		partyName: '',
		joinCode: '',
		djName: '',
		password: '',
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
		const createPartyResult = await CreateParty(form.partyName, form.djName, form.password);
		if (!createPartyResult.ok) {
			setErrorMessage(createPartyResult.error);
			return;
		}
		setErrorMessage('');
		navigate('/redirectHome');
	}

	async function handleJoin() {
		const curPartyResponse = await PartyApi.fetchParty(form.joinCode.toUpperCase());
		if (!curPartyResponse.ok) {
			setErrorMessage(curPartyResponse.error);
			return;
		}
		const curParty = curPartyResponse.value;
		setErrorMessage('');
		let newUser = await ApiService.joinParty(form.joinCode.toUpperCase(), form.singerName);
		dispatch(populateParty(curParty));
		dispatch(populatePlayer(curParty.player));
		dispatch(populateSettings(curParty.settings));
		dispatch(populateUser(newUser));
		dispatch(populatePerformances(curParty.performances));
		dispatch(populateSingers(curParty.singers));
		dispatch(joinHub());
		StorageService.storeUser(newUser);
		StorageService.storeParty(curParty);
	}

	useEffect(() => {
		if (user && user.userId && party && party.partyKey) {
			navigate('/navigateHome');
		}
		setLoading(false);
		setErrorMessage('');
	}, [user, party, navigate]);

	return loading ? (
		<div>Loading...</div>
	) : (
		<div className="container" style={{ padding: '5px', maxWidth: '450px' }}>
			<Menu />
			{errorMessage.length > 0 && (
				<Alert variant={'danger'} className="mt-3">
					<FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
					{errorMessage}
				</Alert>
			)}
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
							<Form.Group className="mb-3">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Password"
									name="password"
									value={form.password}
									onChange={handleInputChange}
								/>
								<Form.Text className="text-muted">
									This app is reserved for private use, password will be provided prior to event.
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
