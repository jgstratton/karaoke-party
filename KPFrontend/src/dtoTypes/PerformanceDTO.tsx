export default interface PerformanceDTO {
	performanceId: number;
	userId: number;
	singerId: number;
	userName: string;
	singerName: string;
	fileName: string;
	songTitle: string;
	url: string;
	status: number;
	sortOrder: number;
	completedOrder: number;
	deleteFlag: boolean;
}
