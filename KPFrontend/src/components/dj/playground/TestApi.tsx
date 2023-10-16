import { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import DownloadResponseGenerator from '../../search/DownloadResponseGenerator';

const TestApi = () => {
	const [prompt, setPrompt] = useState('');
	const [submittedPrompt, setSubmittedPrompt] = useState('');

	return (
		<>
			<div className="container" style={{ padding: '5px', maxWidth: '900px' }}>
				<Form.Group as={Col} className="mb-3">
					<Form.Label>Prompt</Form.Label>
					<Form.Control
						type="text"
						name="prompt"
						value={prompt}
						onChange={(e) => {
							setPrompt(e.target.value);
						}}
					/>
				</Form.Group>
				<Button onClick={() => setSubmittedPrompt(prompt)}>Submit prompt</Button>
				<hr />
				<DownloadResponseGenerator songTitle={submittedPrompt} />
			</div>
		</>
	);
};

export default TestApi;
