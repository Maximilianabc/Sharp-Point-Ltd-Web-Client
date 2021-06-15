import {
	setAccountBalanaceAction,
	setAccountOrderAction,
	setAccountPositionAction,
	setAccountSummaryAction
} from "./Actions";

const serverIP = "192.168.123.136";
const port = "99";
const wsPort = "12000";
const wsAddress = `ws://${serverIP}:${wsPort}/websocketTraderAdmin/accountUpdate?session_token=`;

const opConsts = {
	SUMMARY: 1,
	BALANCE: 2,
	POSITION: 4,
	ORDER: 8
};

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

const getDispatchSelectCB = (opConst) => {
	let op = '';
	let actionCallback, selectCallback;

	switch (opConst) {
		case 1:
			op = 'Summary';        		
			actionCallback = () => setAccountSummaryAction;
			selectCallback = () => state => state.summary;
			break;
		case 2:
			op = 'Balance';
			actionCallback = () => setAccountBalanaceAction;
			selectCallback = () => state => state.balance;
			break;
		case 4:
			op = 'Position';
			actionCallback = () => setAccountPositionAction;
			selectCallback = () => state => state.position;
			break;
		case 8:
			op = 'Order';
			actionCallback = () => setAccountOrderAction;
			selectCallback = () => state => state.order;
			break;
		default:
			return;
	};
	return { id: op, action: actionCallback, select: selectCallback };
};

const AccOperations = async (
		op,
		payload,
		closeWSCallback = undefined,
		actionCallback = undefined
	) => {
	
	let result;
	console.log(`wscb: ${closeWSCallback}`);
	await postRequest(`/account/account${op}`, payload)
		.then(data => {
			if (data.result_code === "40011") {
				if (closeWSCallback) {
					closeWSCallback(false);
				} else {
					result = { close: true };				
				}
				return;
			}
			result = {
				data: data.data,
				action: actionCallback ? actionCallback(data.data) : undefined,
				close: false
			};
		});
	return result;
};

const descComparator = (a, b, orderBy) => b[orderBy] < a[orderBy] ? -1 : (b[orderBy] > a[orderBy] ? 1 : 0);

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
	opConsts,
	postRequest,
	getDispatchSelectCB,
	AccOperations,
	descComparator,
	getComparator,
	stableSort
}
