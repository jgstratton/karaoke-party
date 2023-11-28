import { SongDTO } from '../dtoTypes/SongDTO';
import { SongSearchRequestDTO } from '../dtoTypes/SongSearchRequestDTO';
import { Result, validateResult } from './Result';

const searchSongs = async (searchDto: SongSearchRequestDTO): Promise<Result<SongDTO[]>> =>
	await validateResult(
		await fetch(
			`songs?${new URLSearchParams({
				searchString: searchDto.searchString,
				karaokeFlag: searchDto.karaokeFlag ? 'true' : 'false',
			}).toString()}`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			}
		),
		(body) => {
			return Array.isArray(body);
		},
		'Something went wrong when trying to search for songs'
	);

const downloadSong = async (songDto: SongDTO): Promise<Result<SongDTO>> =>
	await validateResult(
		await fetch(`song/download`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(songDto),
		}),
		(body) => body.fileName.length > 0,
		'Something went wrong when trying to download the song'
	);

const SingerApi = {
	searchSongs,
	downloadSong,
};

export default SingerApi;
