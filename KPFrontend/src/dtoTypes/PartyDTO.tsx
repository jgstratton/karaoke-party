import PlayerDTO from './PlayerDTO';
import { PlayerSettingsDTO } from './PlayerSettingsDTO';

export default interface PartyDTO {
	title: string;
	partyKey: string;
	player: PlayerDTO;
	performances: [PlayerDTO];
	playerSettings: PlayerSettingsDTO;
}
