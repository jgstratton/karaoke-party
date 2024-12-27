export default interface PlayerDTO {
	playerState: number;
	videoPosition: number;
	volume: number;
	videoLength: number;
	VideoId: string;
	title: string;
	showSplash?: boolean;
}
