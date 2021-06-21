import {
	ActionData,
	setAccountBalanaceAction,
	setAccountOrderAction,
	setAccountPositionAction,
	setAccountSummaryAction
} from "./Actions";
import {
	UserState
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
	data: any,
	log_message: string,
	result_code: string,
	result_msg: string,
	timeStamp: number
}
interface Result {
	data?: any,
	actionData?: ActionData,
	closeSocket?: boolean
}
interface StoreCallbacks {
	id: string,
	select: any;
	action: (d: any) => ActionData;
}

type SortOrder = 'asc' | 'desc';
type ComparatorIndicator = -1 | 0 | 1;
type Comparator = (tuple: any) => ComparatorIndicator;
type WebSocketCallback = (normal: boolean) => void;

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
	let actionCallback: (d: any) => ActionData
	let selectCallback: any;

	switch (opConst) {
		case 1:
			op = 'Summary';        		
			actionCallback = (d: any) => setAccountSummaryAction(d);
			selectCallback = () => (state: UserState) => state.summary;
			break;
		case 2:
			op = 'Balance';
			actionCallback = (d: any) => setAccountBalanaceAction(d);
			selectCallback = () => (state: UserState) => state.balance;
			break;
		case 4:
			op = 'Position';
			actionCallback = (d: any) => setAccountPositionAction(d);
			selectCallback = () => (state: UserState) => state.position;
			break;
		case 8:
			op = 'Order';
			actionCallback = (d: any) => setAccountOrderAction(d);
			selectCallback = () => (state: UserState) => state.order;
			break;
		default:
			throw new Error(`unknown operation const ${opConst}`);
	};
	return { id: op, action: actionCallback, select: selectCallback };
};

const AccOperations = async (
		op?: string,
		payload?: any,
		closeWSCallback?: WebSocketCallback,
		actionCallback?: (d: any) => ActionData
	): Promise<Result | undefined> => {
	
	let result;
	await postRequest(`/account/account${op}`, payload)
		.then((data?: Response) => {
			if (data?.result_code === "40011") {
				if (closeWSCallback) {
					closeWSCallback(false);
				} else {
					result = { closeSocket: true } as Result;				
				}
				return;
			}
			if (actionCallback) {
				result = {
					data: data?.data,
					actionData: actionCallback(data?.data),
					closeSocket: false
				};
			} else {
				result = {
					data: data?.data,
					closeSocket: false
				};
			}
		});
	return result;
};

const descComparator = ([a, b]: any, orderBy: string): ComparatorIndicator => b[orderBy] < a[orderBy] ? -1 : (b[orderBy] > a[orderBy] ? 1 : 0);

const getComparator = (order: SortOrder, orderBy: string): Comparator => 
	order === 'desc'
    ? ([a, b]: any) => descComparator([a, b], orderBy) as ComparatorIndicator
    : ([a, b]: any) => -descComparator([a, b], orderBy) as ComparatorIndicator;

const stableSort = (array: any[], comparator: Comparator): any[] => {
	const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator([a[0], b[0]]);
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

