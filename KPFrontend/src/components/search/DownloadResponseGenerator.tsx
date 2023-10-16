import { useEffect, useState } from 'react';
import { downloadMessages } from '../search/DownloadResponses';

interface iProps {
	songTitle: string;
}

const DownloadResponseGenerator = ({ songTitle }: iProps) => {
	const [responseMessage, setResponseMessage] = useState('');

	useEffect(() => {
		if (songTitle.length == 0) {
			setResponseMessage('');
			return;
		}
		_sumbitPrompt().catch(() => {
			// if any error occurs, use the pre-downloaded responses
			setResponseMessage(downloadMessages[Math.floor(Math.random() * downloadMessages.length)]);
		});
	}, [songTitle]);

	const _sumbitPrompt = async () => {
		const response = await fetch(`song/${encodeURIComponent(songTitle)}/openai-stream`);
		const reader = response.body?.getReader();
		const textEncoder = new TextDecoder();
		let textResponses = '';
		let complete = false;
		let messageQueue: string[] = [];
		let startedTime = new Date().valueOf();
		let curTime = null;
		let started = false;

		if (!reader) {
			throw 'no reader';
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
				if (complete && messageQueue.length == 0) {
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
			}, 35);
		};
		_controlledRead();

		// read the response stream from chatgpt
		while (!complete) {
			const { value, done } = await reader.read();
			if (done) {
				complete = true;
				break;
			}
			messageQueue.push(...textEncoder.decode(value).split(/(?! )/g));
		}
	};

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
