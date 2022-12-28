import React from 'react';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SearchCard = (props) => {
	const [form, setForm] = useState({
		searchString: '',
	});

	function handleInputChange(e) {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	}

	function handleSubmit(e) {
		props.submitSearch(form.searchString);
		e.preventDefault();
	}

	return (
		<Card>
			<Card.Body>
				<Card.Title>Search / Add New</Card.Title>
				<Card.Text className="text-warning">
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Control
								type="text"
								placeholder="Search for song"
								name="searchString"
								value={form.searchString}
								onChange={handleInputChange}
							/>
							<Form.Text className="text-muted">Search for a song by title/artist</Form.Text>
						</Form.Group>
						<Button variant="primary" type="submit">
							Search
						</Button>
					</Form>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};
export default SearchCard;
