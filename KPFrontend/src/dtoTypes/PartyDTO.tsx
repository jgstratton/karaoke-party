import PerformanceDTO from './PerformanceDTO';
import PlayerDTO from './PlayerDTO';
import { PlayerSettingsDTO } from './PlayerSettingsDTO';
import SingerDTO from './SingerDTO';

export default interface PartyDTO {
	title: string;
	partyKey: string;
	player: PlayerDTO;
	performances: [PerformanceDTO];
	singers: [SingerDTO];
	playerSettings: PlayerSettingsDTO;
}
