import {
	ActionData,
	setAccountBalanaceAction,
	setAccountOrderAction,
	setAccountPositionAction,
	setAccountSummaryAction,
	setDoneTradeReportAction
} from "./Actions";
import {
	UserState
} from './Reducers';

// NOTE: Change this to false when deploying to server for external use
const internal = true;
const host = internal ? "192.168.123.136" : "futures.spsystem.info";
const port = internal ? "99" : "9026";
const wsPort = "12000";
const wsAddress = `ws://${host}:${wsPort}/websocketTraderAdmin/accountUpdate?session_token=`;
const path = `http${internal ? '' : 's'}://${host}:${port}/apiCustomer`;

enum OPConsts {
	SUMMARY = 1,
	BALANCE = 2,
	POSITION = 4,
	ORDER = 8,
	DONE_TRADE = 16,
	SINGLE = SUMMARY | BALANCE | POSITION | ORDER,
	REPORT = DONE_TRADE
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

interface SummaryRecord {
  buyingPower?: string,
  nav?: string,
  commodityPL?: string,
  currentIMargin?: string,
  currentMMargin?: string,
  mLevel?: string,
  prjOvnMargin?: string,
  maxMargin?: string,
  marginCall?: string,
  cashBalance?: string,
  transactionAmt?: string,
  lockupAmt?: string,
  period?: string,
  creditLimit?: string,
  avgNetOptValue?: string,
  ctrlLevel?: string,
  marginClass?: string
}

interface BalanceRecord {
  ccy: string,
  cashBf: string,
  unsettle: string,
  todayIO: string,
  withdrawReq: string,
  cash: string,
  unpresented: string,
  fx: string,
  cashBaseCcy: string
}

interface PositionRecord {
  id: string,
  name: string,
  prev: string,
  dayLong: string,
  dayShort: string,
  net: string,
  mkt: string,
  pl: string,
  prevClose: string,
  optVal: string,
  fx: number,
  contract: string
}

interface ClearTradeRecord {
  id: string,
  name: string,
  bQty: number,
  sQty: number,
  tradePrice: number,
  tradeNumber: number,
  status: string,
  initiator: string,
  ref: string,
  time: string,
  orderPrice: number,
  orderNumber: number,
  extOrder: string,
  logNumber: number | string
}

interface OrderRecord {
	id: string,
  name: string,
  osBQty: number,
  osSQty: number,
  price: number,
  valid: string,
  condition: string,
  status: string,
	traded: string,
  initiator: string,
  ref: string,
  time: string,
  extOrder: string
}

type SortOrder = 'asc' | 'desc';
type ComparatorIndicator = -1 | 0 | 1;
type Comparator = (tuple: any) => ComparatorIndicator;
type WebSocketCallback = (normal: boolean) => void;

const postRequest = async (relativePath: string, payload: any): Promise<any> => {
	const reqOpt = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	};
	let data;
	await fetch(`${path}${relativePath}`, reqOpt)
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
		case 16:
			op = 'doneTrade';
			actionCallback = (d: any) => setDoneTradeReportAction(d);
			selectCallback = () => (state: UserState) => state.doneTrade;
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

// TODO merge it with AccOperations later
const reportOperations = async (
	op?: string,
	payload?: any,
	closeWSCallback?: WebSocketCallback,
	actionCallback?: (d: any) => ActionData
): Promise<Result | undefined> => {
	let result;
	await postRequest(`/reporting/${op}`, payload)
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

const orderOperations = async (
	op?: string,
	payload?: any
): Promise<Result | undefined> => {
	let result: any;
	await postRequest(`/order/${op}`, payload).then(data => {
		console.log(data);
	});
	return undefined;
};

const stayAlive = async (payload: any) => {
	await postRequest(`/accessRight/sessionTokenHeartbeat`, payload)
		.then(data => {
		})
};

const genRandomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

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

const getCurrencyString = (val: number | undefined, includeCurrency: boolean = true): string => {
	return val !== undefined
		? `${val.toLocaleString(undefined, { 
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}${includeCurrency ? ' HKD' : ''}`
		: '';
};

const getPercentageString = (val: number | undefined, fixed: number = 2): string => {
	return val !== undefined
		? `${(val * 100).toFixed(fixed)}%`
		: '';
}

const getPeriodString = (period: number): string => {
	switch (period) {
		case 1:
			return 'Overnight';
		case -1:
			return 'Mixed';
		default:
			return '?';
	}
};

const getControlLevelString = (lvl: 0 | 1 | 2 | 3 | 4): string => {
	switch (lvl)
	{
		case 0:
			return 'Normal';
		case 1:
			return 'Trade Disable';
		case 2:
			return 'Client Suspend';
		case 3:
			return 'Frozen Account';
		case 4:
			return 'Client Only';
		default:
			throw new Error(`unknown control level: ${lvl}`);
	}
};

const getDoneTradeStatusString = (status: number): string => {
	switch (status) {
		case 0:
			return 'TRADED';
		default:
			return '?';		
	}
};

const getOrderStatusString = (status: number): string => {
	switch (status) {
		case 0:
			return "Sending";
		case 1:
			return "Working";
		case 2:
			return "Inactive";
		case 3:
			return "Pending";
		case 4:
			return "Adding";
		case 5:
			return "CHANGING";
		case 6:
			return "DELETING";
		case 7:
			return "INACTIVE";
		case 8:
			return "PARTIAL TRADE";
		case 9:
			return "TRADED";
		case 10:
			return "DELETED";
		case 14:
			return "NON OPEN HOLD";
		case 18:
			return "WAIT APPROVE";
		case 20:
			return "TRADED AND REPORTED";
		case 21:
			return "DELETED AND REPORTED";
		case 28:
			return "PARTIAL TRADED AND DELETED";
		case 29:
			return "PARTIAL TRADED AND REPORTED";
		case 30:
			return "INACTIVE IN EXCHANGE";
		case 31:
			return "FAILED TO ADDED";
		default:
			return '?';
	}
};

const getValidTypeString = (valid: number): string => {
	switch (valid)
	{
		case 0:
			return 'Today';
		case 1:
			return 'FaK';
		case 2:
			return 'FoK';
		case 3:
			return 'GTC';
		case 4:
			return 'Data';
		default:
			return '?';
	}
};

export {
	wsAddress,
	OPConsts, 
	postRequest,
	getDispatchSelectCB,
	AccOperations,
	reportOperations,
	orderOperations,
	descComparator,
	getComparator,
	stableSort,
	stayAlive,
	genRandomHex,
	getCurrencyString,
	getPercentageString,
	getPeriodString,
	getControlLevelString,
	getDoneTradeStatusString,
	getOrderStatusString,
	getValidTypeString
};
export type {
	SortOrder,
	Response,
	Result,
	SummaryRecord,
	BalanceRecord,
	PositionRecord,
	ClearTradeRecord,
	OrderRecord
};

