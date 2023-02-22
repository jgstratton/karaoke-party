import PartyDTO from './PartyDTO';
import { UserDTO } from './UserDTO';

export interface CreatePartyResponse {
	party: PartyDTO;
	dj: UserDTO;
}
