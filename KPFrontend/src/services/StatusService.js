const statuses = [
	{ id: 0, name: 'requests' },
	{ id: 1, name: 'queued' },
	{ id: 2, name: 'live' },
	{ id: 3, name: 'completed' },
];

const getStatusName = (statusId) => statuses.filter((s) => s.id === statusId).map((s) => s.name)[0];
const getStatusId = (statusName) => statuses.filter((s) => s.name === statusName).map((s) => s.id)[0];
const getStatuses = () => [...statuses];

const getLiveStatus = () => 2;

const requests = 0;
const queued = 1;
const live = 2;
const completed = 3;

const StatusService = {
	getStatusName,
	getStatusId,
	getStatuses,
	getLiveStatus,
	requests,
	queued,
	live,
	completed,
};

export default StatusService;
