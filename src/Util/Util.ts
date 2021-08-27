import {
	ActionData,
	setAccountBalanaceAction,
	setAccountOrderAction,
	setAccountPositionAction,
	setAccountSummaryAction,
	setDoneTradeReportAction
} from "./Actions";
import {
	OrderHistoryRecord,
	UserState
} from './Reducers';

// NOTE: Change this to false when deploying to server for external use
const internal = false;
const host = internal ? "192.168.123.136" : "futures.spsystem.info";
const port = internal ? "99" : "9026";
const priceHost = "localhost";
const pricePort = "8094";
const wsPort = "12000";
const wsAddress = `ws://192.168.123.136:${wsPort}/websocketTraderAdmin/accountUpdate?session_token=`;
const wsPriceAddress = /*`ws://${host}:${pricePort}`*/ `ws://192.168.123.136:${pricePort}`;
const testProxyAddress = 'ws://localhost:8094';
const path = `http${internal ? '' : 's'}://${host}:${port}/apiCustomer`;

enum OPConsts {
	SUMMARY = 1,
	BALANCE = 2,
	POSITION = 4,
	ORDER = 8,
	DONE_TRADE = 16,
	WORKING = 32,
	HISTORY = 64,
	SINGLE = SUMMARY | BALANCE | POSITION | ORDER,
	REPORT = DONE_TRADE | WORKING | HISTORY
};
type OrderStatus = 'Adding' | 'Sending' | 'Inactive' | 'Pending' | 'Working' | 'Traded' | 'Deleted';

// TODO: replace any with push message json format
interface Response {
	data: any,
	log_message: string,
	result_code: string | number,
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

interface SummaryRecordRow {
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

interface BalanceRecordRow {
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

interface PositionRecordRow {
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
  fx: string | number,
  contract: string
}

interface ClearTradeRecordRow {
  id: string,
  name: string,
  bQty: string | number,
  sQty: string | number,
  tradePrice: string | number,
  tradeNumber: string | number,
  status: string,
  initiator: string,
  ref: string,
  time: string,
  orderPrice: string | number,
  orderNumber: string | number,
  extOrder: string,
  logNumber: string | number
}

interface OrderRecordRow {
	accOrderNo: string | number,
	id: string,
  name: string,
	buySell: string,
  qty: string | number,
	tradedQty: string | number,
  price: string | number,
  valid: string,
  condition: string,
  status: string,
  initiator: string,
  ref: string,
  time: string,
	orderNo: string,
  extOrder: string
}

interface DoneTradeRecordRow {
	accOrderNo: string | number,
	id: string,
  name: string,
  bQty: string | number,
  sQty: string | number,
  tradePrc: string | number,
  tradeNum: string | number,
  status: string,
  initiator: string,
  ref: string,
  time: string,
  orderPrc: string | number,
  orderNo: string | number,
  extOrder: string,
  logNum: string
}

interface WorkingOrderRecordRow {
	accOrderNo: string | number,
	id: string,
  name: string,
	buySell: string,
  qty: string | number,
	tradedQty: string | number,
  price: string | number,
  valid: string,
  condition: string,
  status: string,
	traded: string,
  initiator: string,
  ref: string,
  time: string,
  extOrder: string
}

interface OrderHistoryRecordRow {
	accOrderNo: string | number,
	id: string,
  name: string,
	buySell: string,
  qty: string | number,
	tradedQty: string | number,
  price: string | number,
  valid: string,
  condition: string,
  status: string,
	traded: string,
  initiator: string,
  ref: string,
  time: string,
  extOrder: string
}

interface CashMovementRecordRow {
	ccy: string,
  cashBF: string | number,
  unsettled: string | number,
  todayIO: string | number,
  withdrawalReq: string,
  cash: string | number,
  unpresented: string | number,
  fx: string | number,
  cashBaseCcy: string
}

interface DataMask1 {
	accNo: string,
	action: number,
	aeCode: string,
	creditLimit: number,
	ctrlLevel: number,
	dataMask: number,
	event: string,
	maxLoanLimit: number,
	tradeLimit: number,
	tradingLimit: number
}

interface DataMask2 {
	accNo: string,
	action: number,
	aeCode: string,
	cashBf: number,
	ccyCode: string,
	dataMask: number,
	event: string,
	notYetValue: number,
	todayCash: number,
	todayOut: number,
	unpresented: number,
}

interface DataMask4 {
	accNo: string,
	action: number,
	aeCode: string,
	covered: number,
	dataMask: number,
	decInPrc: number,
	depositQty: number,
	depositTotalAmount: number,
	event: string,
	longQty: number,
	longShort: string,
	longTotalAmount: number,
	prodCode: string,
	psQty: number,
	psTotalAmount: number,
	qty: number,
	recNo: number,
	shortQty: number,
	shortTotalAmount: number,
	totalAmount: number
}

interface DataMask8 {
	accNo: string,
	accOrderNo: number,
	action: number,
	active: number,
	aeCode: string,
	buySell: string,
	clOrderId: string,
	condType: number,
	dataMask: number,
	decInPrc: number,
	downLevel: number,
	downPrice: number,
	event: string,
	gatewayCode: string,
	lastAction: number,
	openClose: string,
	options: number,
	orderNo: BigInt,
	orderType: number,
	price: number,
	qty: number,
	recNo: number,
	ref2: string,
	ref: string,
	schedTime: number,
	sender: string,
	status: number,
	stopPrice: number,
	stopType: string,
	timeStamp: number,
	totalQty: number,
	tradedQty: number,
	upLevel: number,
	upPrice: number,
	validDate: number,
	validType: number,
}

interface DataMask32 {
	accNo: string,
	accOrderNo: number,
	aeCode: string,
	buySell: string,
	counterBroker: string,
	dataMask: number,
	event: string,
	orderId: string,
	orderNo: BigInt,
	prodCode: string,
	recNo: number,
	tradeDateInYMD: number,
	tradeId: string,
	tradeNo: number,
	tradePriceInDec: number,
	tradeQty: number,
	tradeTime: number,
}

type SortOrder = 'asc' | 'desc';
type ComparatorIndicator = -1 | 0 | 1;
type Comparator = (tuple: any) => ComparatorIndicator;
type WebSocketCallback = (normal: boolean) => void;
type OPType = 'account' | 'reporting' | 'order' | '';
type FilterType = 'string' | 'number' | 'date';

const numFilters = ['lt', 'leq', 'neq', 'eq', 'gt', 'geq', 'between'] as const;
const stringFilters = ['neq', 'eq', 'contains', 'not contain', 'starts with', 'ends with'] as const;
const dateFilters = ['before', 'on or before', 'on', 'not on', 'on or after', 'after', 'between'] as const;
type NumberFilterOperator = typeof numFilters[number];
type StringFilterOperator = typeof stringFilters[number];
type DateFilterOperator = typeof dateFilters[number];

interface Filter {
  property: keyof OrderHistoryRecordRow | '',
  operator: NumberFilterOperator | StringFilterOperator | DateFilterOperator | '',
  value: { lower: string | number, upper: string | number }
}

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
		case 32:
			op = 'workingOrder';
			actionCallback = (d: any) => setDoneTradeReportAction(d); // TODO change later
			selectCallback = () => (state: UserState) => state.doneTrade;
			break;
		case 64:
			op = 'orderHist';
			actionCallback = (d: any) => setDoneTradeReportAction(d); // TODO change later
			selectCallback = () => (state: UserState) => state.doneTrade;
			break;
		default:
			throw new Error(`unknown operation const ${opConst}`);
	};
	return { id: op, action: actionCallback, select: selectCallback };
};

const operations = async (
		type?: OPType,
		op?: string,
		payload?: any,
		closeWSCallback?: WebSocketCallback,
		actionCallback?: (d: any) => ActionData
	): Promise<Result | undefined> => {
	let result;
	let url: string = '';

	switch (type) {
		case "account":
			url = `/account/account${op}`;
			break;
		case "reporting":
			url = `/reporting/${op}`;
			break;
		case "order":
			url = `/order/${op}`;
			break;
	}

	await postRequest(url, payload).then((data?: Response) => {
			if (data?.result_code === "40011" || data?.result_code === 40011) {
				if (closeWSCallback) {
					closeWSCallback(false);
				} else {
					result = { closeSocket: true } as Result;				
				}
				return;
			} else if (data?.result_code !== 0 && data?.result_code !== '0') {
				result = {
					data: {
						errorMsg: data?.result_msg
					}
				} as Result;
			} else {
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
			}
		});
	return result;
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

const getPredicate = (row: OrderHistoryRecordRow, filter: Filter): () => boolean => {
	if (filter.property === '' || filter.operator === '') {
		return () => false;
	}
	switch (filter.operator) {
		case 'after':
		case 'before':
		case 'on':
		case 'not on':
		case 'on or before':
		case 'on or after':
			if (!isValidDateFilter(filter)) {
				throw new Error(`not date filter but used ${filter.operator}`);
			} else {
				return getDatePredicate(new Date(row[filter.property]), filter.value, filter.operator);
			}
		case 'leq':
		case 'lt':
		case 'geq':
		case 'gt':
			if (!isValidNumberFilter(row, filter)) {
				throw new Error(`not number filter but used ${filter.operator}`);
			} else {
				if (!isNaN(+row[filter.property]) && !isNaN(+filter.value.lower) && isFinite(+filter.value.lower)) {
					return getNumPredicate(+row[filter.property], { lower: +filter.value.lower, upper: 0 }, filter.operator);
				} else {
					throw new Error('value or item is not a number');
				}
			}
		case 'between':
			if (Object.values(filter.value).length !== 2) {
				throw new Error('must provide exactly 2 values for between operator');
			} else {
				if (isValidDateFilter(filter)) {
					return getDatePredicate(new Date(row[filter.property]), filter.value, filter.operator);
				} else if (isValidNumberFilter(row, filter) && !isNaN(+filter.value.upper)) {
					return getNumPredicate(+row[filter.property], { lower: +filter.value.lower, upper: +filter.value.upper }, filter.operator);
				} else {
					throw new Error('not date or number filter but used between operator');
				}
			}
		case 'contains':
		case 'not contain':
		case 'starts with':
		case 'ends with':
				return getStringPredicate(row[filter.property].toString(), filter.value.lower.toString(), filter.operator);
		case 'eq':
		case 'neq':
			if (typeof row[filter.property] === 'number') {
				return getNumPredicate(+row[filter.property], { lower: +filter.value.lower, upper: 0 }, filter.operator);
			} else if (typeof row[filter.property] === 'string') {
				return getStringPredicate(row[filter.property].toString(), filter.value.lower.toString(), filter.operator);
			} else {
				throw new Error('eq and neq operator cannot be used with non number or string filter');
			}
	}
}

const getNumPredicate = (value: number, compares: { lower: number, upper: number }, operator: NumberFilterOperator): () => boolean => {
	switch (operator) {
		case 'eq':
			return () => value === compares.lower;
		case 'geq':
			return () => value >= compares.lower;
		case 'gt':
			return () => value > compares.lower;
		case 'leq':
			return () => value <= compares.lower;
		case 'lt':
			return () => value < compares.lower;
		case 'neq':
			return () => value !== compares.lower;
		case 'between':
			return () => compares.lower <= value && value <= compares.upper;
	}
};

const getStringPredicate = (value: string, compare: string, operator: StringFilterOperator): () => boolean => {
	switch (operator) {
		case 'eq':
			return () => value === compare;
		case 'neq':
			return () => value !== compare;
		case 'contains':
			return () => value.includes(compare);
		case 'not contain':
			return () => !value.includes(compare);
		case 'starts with':
			return () => value.startsWith(compare);
		case 'ends with':
			return () => value.endsWith(compare);
	}
};

const getDatePredicate = (value: Date, compare: { lower: string | number, upper: string | number }, operator: DateFilterOperator): () => boolean => {
	const low = new Date(compare.lower);
	const up = new Date(compare.upper);

	switch (operator) {
		case 'on':
			return () => value.getDate() === low.getDate();
		case 'not on':
			return () => value.getDate() !== low.getDate();
		case 'before':
			return () => value < low && value.getDate() !== low.getDate();
		case 'after':
			return () => value > low && value.getDate() !== low.getDate();
		case 'on or before':
			return () => value < low || value.getDate() === low.getDate();
		case 'on or after':
			return () => value > low || value.getDate() === low.getDate();
		case 'between':
			return () => (low <= value || value.getDate() === low.getDate()) && (value <= up || value.getDate() === up.getDate());
	}
};

const combineFilters = (row: OrderHistoryRecordRow, filters: Filter[]): () => boolean => {
	if (filters.length === 0) {
		 return () => false;
	}
	let result: () => boolean = () => true;
	Array.prototype.forEach.call(filters, (f: Filter) => {
		if (!getPredicate(row, f)()) {
			result = () => false;
			return;
		}
	});
	return result;
};

const isValidDateFilter = (filter: Filter): boolean => filter.property === 'time' && !isNaN(new Date(filter.value.lower).getDate());

const isValidNumberFilter = (row: OrderHistoryRecordRow, filter: Filter): boolean => filter.property !== '' && typeof row[filter.property] === 'number' && !isNaN(+filter.value.lower);

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
			return status.toString();		
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

const getOperatorDisplayText = (op: NumberFilterOperator | StringFilterOperator | DateFilterOperator): string => {
	switch (op) {
		case 'eq':
			return '=';
		case 'geq':
			return '≥';
		case 'gt':
			return '>';
		case 'leq':
			return '≤';
		case 'lt':
			return '<';
		case 'neq':
			return '≠';
		default:
			return op;
	}
};

const getValidTypeNumber = (type: string): number => {
	switch (type) {
		case 'Today':
			return 0;
		case 'FaK':
			return 1;
		case 'FoK':
			return 2;
		case 'GTC':
			return 3;
		case 'Date':
			return 4;
		default:
			throw new Error(`Unknown valid type ${type}`);
	}
};

const getConditionTypeNumber = (type: string): number => {
	switch (type) {
		case 'Normal':
			return 0;
		case 'Enchanced Stop':
			return 1;
		case 'OCO':
			return 4;
		case 'Time To Send':
			return 3;
		case 'Bull & Bear':
		case 'Trade Booking':
			alert('Unmatched condType in api with options available');
			return 0;
		default:
			throw new Error(`Unknwown condition type ${type}`);
	}
};

const workingInProgess = () => {
	alert('Working in Progress...');
};

export {
	wsAddress,
	wsPriceAddress,
	testProxyAddress,
	OPConsts,
	postRequest,
	getDispatchSelectCB,
	operations,
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
	getValidTypeString,
	getOperatorDisplayText,
	getConditionTypeNumber,
	getValidTypeNumber,
	workingInProgess,
	getPredicate,
	combineFilters,
	numFilters,
	stringFilters,
	dateFilters
};
export type {
	OPType,
	FilterType,
	NumberFilterOperator,
	StringFilterOperator,
	SortOrder,
	Response,
	Result,
	Filter,
	StoreCallbacks,
	SummaryRecordRow,
	BalanceRecordRow,
	PositionRecordRow,
	ClearTradeRecordRow,
	OrderRecordRow,
	DoneTradeRecordRow,
	WorkingOrderRecordRow,
	OrderHistoryRecordRow,
	CashMovementRecordRow,
	OrderStatus,
	DataMask1,
	DataMask2,
	DataMask4,
	DataMask8,
	DataMask32
};

