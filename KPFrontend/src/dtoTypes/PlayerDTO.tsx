export default interface PlayerDTO {
	playerState: number;
	videoPosition: number;
	volume: number;
	videoLength: number;
	fileName: string;
	title: string;
	showSplash?: boolean;
}
