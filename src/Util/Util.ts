import {
	ActionData,
	setAccountBalanaceAction,
	setAccountOrderAction,
	setAccountPositionAction,
	setAccountSummaryAction
} from "./Actions";
import {
	State,
	Account,
	Summary,
	Balance,
	Position,
	Order
} from './Reducers';

const serverIP = "192.168.123.136";
const port = "99";
const wsPort = "12000";
const wsAddress = `ws://${serverIP}:${wsPort}/websocketTraderAdmin/accountUpdate?session_token=`;

enum OPConsts {
	SUMMARY = 1,
	BALANCE = 2,
	POSITION = 4,
	ORDER = 8,
	ALL = SUMMARY | BALANCE | POSITION | ORDER
};

// TODO: replace any with push message json format
interface Response {
	data: any
	result_code: string,
	result_msg: string
}
interface Result {
	data?: any,
	action: ActionCallback,
	closeSocket: boolean
}
interface StoreCallbacks {
	id: string,
	select: () => void;
	action: (d: any) => void;
}

type SortOrder = 'ASC' | 'DSC';
type StringOrNumberTuple = [string, string] | [number, number];
type ComparatorIndicator = -1 | 0 | 1;
type Comparator = (tuple: StringOrNumberTuple) => ComparatorIndicator;
type WebSocketCallback = (normal: boolean) => void;
type ActionCallback = (action: ActionData) => void;

const postRequest = async (relativePath: string, payload: any): Promise<any> => {
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

const getDispatchSelectCB = (opConst: OPConsts): StoreCallbacks => {
	let op = '';
	let actionCallback, selectCallback;

	switch (opConst) {
		case 1:
			op = 'Summary';        		
			actionCallback = (d: any) => setAccountSummaryAction(d);
			selectCallback = () => (state: State<Account<Summary>>) => state.summary;
			break;
		case 2:
			op = 'Balance';
			actionCallback = (d: any) => setAccountBalanaceAction(d);
			selectCallback = () => (state: State<Account<Balance>>) => state.balance;
			break;
		case 4:
			op = 'Position';
			actionCallback = (d: any) => setAccountPositionAction(d);
			selectCallback = () => (state: State<Account<Position>>) => state.positions;
			break;
		case 8:
			op = 'Order';
			actionCallback = (d: any) => setAccountOrderAction(d);
			selectCallback = () => (state: State<Account<Order>>) => state.orders;
			break;
		default:
			throw `unknown operation const ${opConst}`;
	};
	return { id: op, action: actionCallback, select: selectCallback };
};

const AccOperations = async (
		op?: string,
		payload?: any,
		closeWSCallback?: WebSocketCallback,
		actionCallback?: (d: any) => void
	): Promise<Result | undefined> => {
	
	let result;
	await postRequest(`/account/account${op}`, payload)
		.then((data?: Response) => {
			if (data?.result_code === "40011") {
				if (closeWSCallback) {
					closeWSCallback(false);
				} else {
					result = { close: true };				
				}
				return;
			}
			if (actionCallback) {
				result = {
					data: data?.data,
					action: () => actionCallback(data?.data),
					close: false
				};
			} else {
				result = {
					data: data?.data,
					close: false
				};
			}
		});
	return result;
};

const descComparator = ([a, b]: StringOrNumberTuple) => b < a ? -1 : (b > a ? 1 : 0);

const getComparator = (order: SortOrder) => 
	order === 'DSC'
    ? ([a, b]: StringOrNumberTuple) => descComparator([a, b] as StringOrNumberTuple)
    : ([a, b]: StringOrNumberTuple) => -descComparator([a, b] as StringOrNumberTuple);

const stableSort = (array: string[] | number[], comparator: Comparator) => {
	const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator([a[0], b[0]] as StringOrNumberTuple);
    if (order !== 0) return order;
    return ((a[1]) as number) - ((b[1]) as number);
  });
  return stabilizedThis.map((el) => el[0]);
};

export {
	wsAddress,
	OPConsts, 
	postRequest,
	getDispatchSelectCB,
	AccOperations,
	descComparator,
	getComparator,
	stableSort
};
export type {
	SortOrder,
	Response,
	Result
};

