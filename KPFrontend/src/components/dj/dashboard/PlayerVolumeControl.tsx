import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVolume } from '../../../slices/playerSlice';
import { RootState } from '../../../store';
import { Form } from 'react-bootstrap';

const PlayerMainControls: React.FC = () => {
    const dispatch = useDispatch();
    const playerVolume = useSelector((state: RootState) => state.player.volume);

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number((event.target as HTMLInputElement).value);
        dispatch(setVolume(targetValue));
    }

    return (
        <>
            <Form.Group>
                <Form.Label>Volume: {playerVolume}%</Form.Label>
                <Form.Control
                    type="range"
                    min="60"
                    max="100"
                    value={playerVolume}
                    onChange={handleVolumeChange}
                />
            </Form.Group>
        </>
    );
};

export default PlayerMainControls;