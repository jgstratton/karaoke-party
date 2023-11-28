import { useEffect, useRef, useState } from 'react';
import { downloadMessages } from '../search/DownloadResponses';
import { useSelector } from 'react-redux';
import { selectPlayerSettings } from '../../slices/playerSlice';
import { selectOpenAiEndpoint } from '../../slices/partySlice';

interface iProps {
	songTitle: string;
}

const DownloadResponseGenerator = ({ songTitle }: iProps) => {
	const settings = useSelector(selectPlayerSettings);
	const openAiEndpoint = useSelector(selectOpenAiEndpoint);
	const [responseMessage, setResponseMessage] = useState('');
	const titleRef = useRef('no-title');

	const _sumbitPrompt = async () => {
		if (openAiEndpoint.length === 0) {
			setResponseMessage(downloadMessages[Math.floor(Math.random() * downloadMessages.length)]);
			return;
		}
		const response = await fetch(openAiEndpoint, {
			method: 'POST',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				song: songTitle,
			}),
		});
		const reader = response.body?.getReader();
		const textEncoder = new TextDecoder();
		let textResponses = '';
		let complete = false;
		let messageQueue: string[] = [];
		let startedTime = new Date().valueOf();
		let curTime = null;
		let started = false;

		if (!reader) {
			console.warn(`No reader`);
			return;
		}

		// streamed response is very choppy, use the queue to smooth out the response
		const _controlledRead = () => {
			setTimeout(() => {
				curTime = new Date().valueOf();
				// if the stream hasn't returned any data after 10 seconds, then just quit
				if (!started && curTime - startedTime > 10000) {
					console.warn(`Start limit eached, dumping ${messageQueue.length} messages`);
					textResponses = textResponses + messageQueue.join('');
					setResponseMessage(textResponses);
					reader.cancel();
					return;
				} else if (curTime - startedTime > 20000) {
					console.warn(`Total limit reached, dumping remaining ${messageQueue.length} messages`);
					textResponses = textResponses + messageQueue.join('');
					setResponseMessage(textResponses);
					reader.cancel();
					return;
				}

				// stream is complete and all messages displayed, then quit
				if (complete && messageQueue.length === 0) {
					if (!started) {
						console.warn('No data returned from API, resorting to canned response');
						setResponseMessage(downloadMessages[Math.floor(Math.random() * downloadMessages.length)]);
					}
					return;
				}

				// if the messageQueue has any data, then add it to the display
				if (messageQueue.length > 0) {
					// console.log('dequeue', messageQueue.length);
					started = true;
					const decodedText = messageQueue.shift();
					textResponses = textResponses + decodedText;
					setResponseMessage(textResponses);
				}

				// read the next item from the queue
				_controlledRead();
			}, 20);
		};
		_controlledRead();

		// read the response stream from chatgpt
		while (!complete) {
			const { value, done } = await reader.read();
			if (done) {
				complete = true;
				break;
			}
			const text = textEncoder.decode(value);
			const newtext = text.replaceAll('}{', '}zz-SplitTextHere--zz{');
			const chunks = newtext.split('zz-SplitTextHere--zz');
			chunks.forEach((chunk) => {
				try {
					messageQueue.push(...(JSON.parse(chunk)?.choices[0]?.delta?.content?.split(/(?! )/g) ?? ''));
				} catch (ex) {
					console.warn('chunk size', chunks.length);
					console.warn(text);
					console.warn(newtext);
					console.warn(chunk);
					console.error(ex);
				}
			});
		}
	};

	useEffect(() => {
		if (songTitle.length === 0) {
			setResponseMessage('');
			return;
		}
		if (songTitle === titleRef.current) {
			return;
		}
		titleRef.current = songTitle;
		if (!settings.aiEnabled) {
			setResponseMessage('');
			return;
		}
		_sumbitPrompt().catch(() => {
			// if any error occurs, use the pre-downloaded responses
			setResponseMessage(downloadMessages[Math.floor(Math.random() * downloadMessages.length)]);
		});
	}, [songTitle, settings.aiEnabled]); //ignore warning about _submitPrompt

	return (
		<>
			{responseMessage.length > 0 && (
				<>
					<hr />
					<div style={{ minHeight: '120px' }}>{responseMessage}</div>
				</>
			)}
		</>
	);
};

export default DownloadResponseGenerator;
