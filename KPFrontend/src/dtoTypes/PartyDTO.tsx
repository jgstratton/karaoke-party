import PerformanceDTO from './PerformanceDTO';
import PlayerDTO from './PlayerDTO';
import { PlayerSettingsDTO } from './PlayerSettingsDTO';
import { ServerSettingsDTO } from './ServerSettingsDTO';
import SingerDTO from './SingerDTO';

export default interface PartyDTO {
	title: string;
	partyKey: string;
	djKey: string;
	player: PlayerDTO;
	performances: [PerformanceDTO];
	singers: [SingerDTO];
	settings: PlayerSettingsDTO;
	serverSettings: ServerSettingsDTO;
}
