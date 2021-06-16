import persistCombineReducers from 'redux-persist/lib/persistCombineReducers';
import { actionConsts, ActionData } from './Actions';
import { SortOrder } from './Util';

type State<T extends StateTypes> = T & { prev: State<T> | unknown };
type StateTypes = Empty | UserTypes | Account<Details> | unknown

interface Empty { }

type UserTypes = UserInfo | SessionToken | Name;
interface UserInfo {
  userId: string,
  password: string
}
interface SessionToken {
  token: string
}
interface Name {
  accName: string
}

type Details = Info | Summary | Balance | Position | ClearTrade | Cash | Order | DoneTrade;
type Account<U extends Details> = U & {
  limit: number,
  page: number,
  sort: SortOrder,
  sortBy: string,
  total: number,
  totalPage: number
};

interface AccInfoRecord {
  buyingPower: string,
  nav: string,
  commodityPL: string,
  currentIMargin: string,
  currentMMargin: string,
  mLevel: string,
  prjOvnMargin: string,
  maxMargin: string,
  marginCall: string,
  cashBalance: string,
  transactionAmt: string,
  lockupAmt: string,
  period: string,
  creditLimit: string,
  avgNetOptValue: string
}
interface Info {
  info: AccInfoRecord[]
}
interface AccSummaryRecord {
  accClass: string,
  accName: string,
  accNameUtf: string,
  accType: string,
  acmastNo: string,
  active: number,
  aeId: string,
  baseCcy: string,
  clientId: string,
  contact: string,
  country: number,
  creditLimit: number,
  email: string,
  fax: number,
  homePhone: number
  idno: string,
  maddress1: string,
  maddress2: string,
  maddress3: string,
  mobilePhone: number,
  officePhone: number,
  openAccountDate: string,
  remarks: string,
  reportDate: number,
  sex: string,
  sms: string,
  tradeLimit: number
}
interface Summary {
  summary: AccSummaryRecord[]
}
interface AccBalanceRecord {

}
interface Balance {
  balance: AccBalanceRecord[]
}
interface AccPositionRecord {
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
interface Position {
  positions: AccPositionRecord[]
}
interface AccClearTradeRecord {
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
  logNumber: number
}
interface ClearTrade {
  trades: AccClearTradeRecord[]
}
interface AccCashRecord {
  ccy: string,
  cashBF: number,
  unsettled: number,
  todayIO: number,
  withdrawalReq: string,
  cash: number,
  unpresented: number,
  fx: number,
  cashBaseCcy: string
}
interface Cash {
  cash: AccCashRecord[]
}
interface AccOrderRecord {

}
interface Order {
  orders: AccOrderRecord[]
}
interface AccDoneTradeRecord {
  accNo: string,
  accOrderNo: number,
  aeCode: string,
  avgPrice: number,
  buySell: string,
  counterParty: number,
  decInPrc: number,
  doneTradeDate: number,
  doneTradeTime: number,
  extOrderNo: string,
  initiator: string,
  instCode: string,
  orderNo: number,
  prodCode: string,
  recNo: number,
  status: number,
  systemId: string,
  totalTrdPrc: number,
  tradeDateStr: string,
  tradeNo: number,
  tradePrice: number,
  tradeQty: number,
  tradeTime: number,
  tradeTimeStr: string
}
interface DoneTrade {
  doneTradeReports: AccDoneTradeRecord[]
}

const currentUser = (state: State<Empty> = { prev: undefined }, action: ActionData): State<StateTypes> => {
  switch (action.type) {
    case actionConsts.LOGIN2FA:
      return {
        prev: state,
        userId: action.payload.userId,
        password: action.payload.password
      } as State<UserInfo>;
    case actionConsts.LOGOUT:
      return {} as State<Empty>;
    case actionConsts.SET_TOKEN:
      return {
        prev: state,
        token: action.payload
      } as State<SessionToken>;
    case actionConsts.SET_ACC_NUM:
      return {
        ...state,
        accName: action.payload
      } as State<Name>;
    case actionConsts.SET_ACC_BAL:
      return {
        prev: state,
        limit: action.payload.limit,
        page: action.payload.page,
        balance: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      } as State<Account<Balance>>;
    case actionConsts.SET_ACC_INFO:
      return {
        prev: state,
        limit: action.payload.limit,
        page: action.payload.page,
        info: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      } as State<Account<Info>>;
    case actionConsts.SET_ACC_ORDER:
      return {
        prev: state,
        limit: action.payload.limit,
        page: action.payload.page,
        orders: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      } as State<Account<Order>>;
    case actionConsts.SET_ACC_POS:
      return {
        prev: state,
        limit: action.payload.limit,
        page: action.payload.page,
        positions: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      } as State<Account<Position>>;
    case actionConsts.SET_ACC_SUM:
      return {
        prev: state,
        limit: action.payload.limit,
        page: action.payload.page,
        summary: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      } as State<Account<Summary>>;
    case actionConsts.SET_DONE_TRADE:
      return {
        prev: state,
        limit: action.payload.limit,
        page: action.payload.page,
        doneTradeReports: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      } as State<Account<DoneTrade>>;
    default:
      return state;
  }
};

export {
  currentUser
};  
export type {
  State,
  StateTypes,
  UserTypes,
  UserInfo,
  SessionToken,
  Name,
  Account,
  Details,
  Info,
  Summary,
  Balance,
  Position,
  ClearTrade,
  Cash,
  Order,
  DoneTrade,
  AccInfoRecord,
  AccSummaryRecord,
  AccBalanceRecord,
  AccPositionRecord,
  AccClearTradeRecord,
  AccCashRecord,
  AccOrderRecord,
  AccDoneTradeRecord
};

