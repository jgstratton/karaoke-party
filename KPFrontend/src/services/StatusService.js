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

const StatusService = {
	getStatusName,
	getStatusId,
	getStatuses,
	getLiveStatus,
};

export default StatusService;
