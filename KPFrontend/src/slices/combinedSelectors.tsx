import { createSelector } from '@reduxjs/toolkit';
import StatusService from '../services/StatusService';
import { selectCompleted, selectLive, selectPerformances, selectQueued, selectRequests } from './performancesSlice';
import { selectSingerList } from './singerSlice';
import { selectUserId } from './userSlice';
import PerformanceDTO from '../dtoTypes/PerformanceDTO';

const cmp = (a: number, b: number) => +(a > b) - +(a < b);

export const selectSingerSummaryList = createSelector(
	selectSingerList,
	selectQueued,
	selectLive,
	selectCompleted,
	(singers, queued, live, completed) => {
		return singers.map((s) => ({
			singerId: s.singerId,
			name: s.name,
			rotationNumber: s.rotationNumber,
			completedCount: completed.filter((p) => p.singerId === s.singerId && p.status === StatusService.completed)
				.length,
			queuedCount: queued.filter((p) => p.singerId === s.singerId && p.status === StatusService.queued).length,
			liveCount: live.filter((p) => p.singerId === s.singerId && p.status === StatusService.live).length,
			isPaused: s.isPaused,
		}));
	}
);

export const selectQueuedSorted = createSelector(
	selectQueued,
	selectLive,
	selectSingerList,
	(queued, live, singers) => {
		const sourcePerformances = singers
			.map((s) => {
				const singerDetails = {
					singer: s,
					performances: queued
						.filter((p) => p.singerId === s.singerId)
						.sort((a, b) => cmp(a.sortOrder ?? 0, b.sortOrder ?? 0)),
				};
				return singerDetails;
			})
			.filter((details) => details.performances.length > 0 && !details.singer.isPaused);
		const targetPerformances = [];

		let lastRotationNumber = 0;

		if (live.length > 0) {
			const lastSinger = singers.find((a) => a.singerId === live[0].singerId);
			lastRotationNumber = lastSinger?.rotationNumber ?? 0;
		}

		let curIndex = sourcePerformances.findIndex(
			(details: { singer: { rotationNumber: number } }) => details.singer.rotationNumber > lastRotationNumber
		);
		if (curIndex < 0) {
			curIndex = 0;
		}
		while (sourcePerformances.length > 0) {
			const nextSinger = sourcePerformances[curIndex];
			targetPerformances.push(nextSinger.performances.splice(0, 1)[0]);
			if (nextSinger.performances.length === 0) {
				sourcePerformances.splice(curIndex, 1);
				if (curIndex > sourcePerformances.length - 1) {
					curIndex = 0;
				}
			} else {
				curIndex = curIndex >= sourcePerformances.length - 1 ? 0 : curIndex + 1;
			}
		}
		return targetPerformances;
	}
);

export const selectCurrentSinger = createSelector(selectSingerList, selectLive, (singers, live) => {
	if (live.length === 0) {
		return null;
	}

	const curSingerId = live[0].singerId;
	const searchSinger = singers.filter((s) => s.singerId === curSingerId);
	if (searchSinger.length === 0) {
		return null;
	}
	return searchSinger[0];
});

export const selectUserPerformances = createSelector(
	[selectUserId, selectCompleted, selectLive, selectQueuedSorted, selectRequests],
	(userid, completed, live, queued, requested): PerformanceDTO[] => {
		console.log('getting singer song list', userid);
		const userCompleted = completed.filter((p) => p.userId === userid);
		const userLive = live.filter((p) => p.userId === userid);
		const userQueued = queued.filter((p) => p.userId === userid);
		const userRequested = requested.filter((p) => p.userId === userid);

		const sortedPerformances = userCompleted.concat(userLive).concat(userQueued).concat(userRequested);

		return sortedPerformances;
	}
);
