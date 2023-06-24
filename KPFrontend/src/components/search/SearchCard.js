import React from 'react';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SearchCard = (props) => {
	function handleSearchChange(e) {
		props.setSearchString(e.target.value);
	}

	function handleSubmit(e) {
		props.submitSearch();
		e.preventDefault();
	}

	return (
		<Card>
			<Card.Body>
				<Card.Title>Search / Add New</Card.Title>
				<Card.Text className="text-warning">
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3">
							<Form.Control
								type="text"
								placeholder="Search for song"
								name="searchString"
								value={props.searchString}
								onChange={handleSearchChange}
							/>
							<Form.Text className="text-muted">Search for a song by title/artist</Form.Text>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Select
								value={props.isKaraoke}
								onChange={(e) => {
									const index = e.nativeEvent.target.selectedIndex;
									props.setIsKaraoke(parseInt(e.nativeEvent.target[index].value));
								}}
							>
								<option value="1">Karaoke Versions Only</option>
								<option value="0">
									Want a break from Karaoke? Find something else to add to the queue.
								</option>
							</Form.Select>
							<Form.Text className="text-muted">Select the type of video you want</Form.Text>
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
