const serverIP = "192.168.123.136";
const port = "99";
const wsPort = "12000";
const wsAddress = `ws://${serverIP}:${wsPort}/websocketTraderAdmin/accountUpdate?session_token=`;


const postRequest = async (relativePath, payload) => {
	const path = `http://${serverIP}:${port}/apiCustomer`;
	const reqOpt = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	};
	let data;
	await fetch(path + relativePath, reqOpt)
		.then(response => response.json())
		.then(body => { data = body });
	return data;
};

const descComparator = (a, b, orderBy) => 
	b[orderBy] < a[orderBy] 
		? -1 
		: (
			b[orderBy] > a[orderBy] 
				? 1 
				: 0
			);

const getComparator = (order, orderBy) => 
	order === 'desc'
    ? (a, b) => descComparator(a, b, orderBy)
    : (a, b) => -descComparator(a, b, orderBy);

const stableSort = (array, comparator) => {
	const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export {
	wsAddress,
	postRequest,
	descComparator,
	getComparator,
	stableSort
}
