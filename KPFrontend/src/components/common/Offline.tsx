import { faCancel, faWifiStrong } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren, useEffect, useState } from 'react';
import { selectUserIsDj } from '../../slices/userSlice';
import Overlay, { Positions } from './Overlay';

const Offline = ({ children }: PropsWithChildren) => {
	const isDj = useSelector(selectUserIsDj);
	const [online, setStatus] = useState(true);

	useEffect(() => {
		window.addEventListener('online', () => setStatus(true));
		window.addEventListener('offline', () => setStatus(false));

		return () => {
			window.removeEventListener('online', () => setStatus(true));
			window.removeEventListener('offline', () => setStatus(false));
		};
	}, [setStatus]);

	return (
		<>
			{!online && (
				<Overlay backgroundOpacity={0.5} position={Positions.TopRight}>
					<div
						style={{
							width: '100%',
							backgroundColor: 'black',
							padding: '30px',
							lineHeight: '30px',
							borderRadius: '3px',
							maxWidth: '400px',
							border: '1px solid red',
						}}
					>
						<span className="fa-layers fa-fw fa-lg">
							<FontAwesomeIcon icon={faCancel} style={{ color: 'red' }} transform="grow-8" />
							<FontAwesomeIcon icon={faWifiStrong} transform="shrink-6" inverse />
						</span>
						<span className="ml-3">Oh No! The connection was lost...</span>
						{isDj && (
							<p className="text-warning">
								You've lost connection to the server and the player. We'll keep you list here until you
								get the connection fixed, but in the meantime you will not be able to make any changes.
							</p>
						)}
					</div>
				</Overlay>
			)}
			{children}
		</>
	);
};
export default Offline;
