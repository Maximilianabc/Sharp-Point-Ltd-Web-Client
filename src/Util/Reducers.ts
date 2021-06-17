import { actionConsts, ActionData } from './Actions';
import { SortOrder } from './Util';

interface UserState {
  userId?: string,
  token?: string,
  accName?: string,
  info?: Account<Info>,
  summary?: Account<Summary>,
  balance?: Account<Balance>,
  position?: Account<Position>,
  clearTrade?: Account<ClearTrade>,
  cash?: Account<Cash>,
  order?: Account<Order>,
  doneTrade?: Account<DoneTrade>
}

type StateContentTypes = Empty | UserTypes | Account<Details> | unknown;

interface Empty { }

type UserTypes = UserId | SessionToken | Name;
interface UserId {
  userId: string
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
  data: AccInfoRecord[]
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
  data: AccSummaryRecord[]
}
interface AccBalanceRecord {

}
interface Balance {
  data: AccBalanceRecord[]
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
  data: AccPositionRecord[]
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
  data: AccClearTradeRecord[]
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
  data: AccCashRecord[]
}
interface AccOrderRecord {

}
interface Order {
  data: AccOrderRecord[]
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
  data: AccDoneTradeRecord[]
}

const currentUser = (state: UserState = {}, action: ActionData): UserState => {
  switch (action.type) {
    case actionConsts.LOGIN2FA:
      return {
        ...state,
        userId: action.payload.userId,
      };
    case actionConsts.LOGOUT:
      return {};
    case actionConsts.SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case actionConsts.SET_ACC_NUM:
      return {
        ...state,
        accName: action.payload
      };
    case actionConsts.SET_ACC_BAL:
      return {
        ...state,
        balance: {
          limit: action.payload.limit,
          page: action.payload.page,
          data: action.payload.recordData,
          sort: action.payload.sort,
          sortBy: action.payload.sortBy,
          total: action.payload.total,
          totalPage: action.payload.totalPage
        } as Account<Balance>
      };
    case actionConsts.SET_ACC_INFO:
      return {
        ...state,
        info: {
          limit: action.payload.limit,
          page: action.payload.page,
          data: action.payload.recordData,
          sort: action.payload.sort,
          sortBy: action.payload.sortBy,
          total: action.payload.total,
          totalPage: action.payload.totalPage
        } as Account<Info>
      };
    case actionConsts.SET_ACC_ORDER:
      return {
        ...state,
        order: {
          limit: action.payload.limit,
          page: action.payload.page,
          data: action.payload.recordData,
          sort: action.payload.sort,
          sortBy: action.payload.sortBy,
          total: action.payload.total,
          totalPage: action.payload.totalPage
        } as Account<Order>
      };
    case actionConsts.SET_ACC_POS:
      return {
        ...state,
        position: {
          limit: action.payload.limit,
          page: action.payload.page,
          data: action.payload.recordData,
          sort: action.payload.sort,
          sortBy: action.payload.sortBy,
          total: action.payload.total,
          totalPage: action.payload.totalPage
        } as Account<Position>
        };
    case actionConsts.SET_ACC_SUM:
      return {
        ...state,
        summary: {
          limit: action.payload.limit,
          page: action.payload.page,
          data: action.payload.recordData,
          sort: action.payload.sort,
          sortBy: action.payload.sortBy,
          total: action.payload.total,
          totalPage: action.payload.totalPage
        } as Account<Summary>
      };
    case actionConsts.SET_DONE_TRADE:
      return {
        ...state,
        doneTrade: {
          limit: action.payload.limit,
          page: action.payload.page,
          data: action.payload.recordData,
          sort: action.payload.sort,
          sortBy: action.payload.sortBy,
          total: action.payload.total,
          totalPage: action.payload.totalPage
        } as Account<DoneTrade>
      };
    default:
      return state;
  }
};

export {
  currentUser
};  
export type {
  UserState,
  StateContentTypes as StateTypes,
  UserTypes,
  UserId as UserInfo,
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

