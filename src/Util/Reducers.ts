import { actionConsts, ActionData } from './Actions';
import { SortOrder } from './Util';

interface UserState {
  authed?: boolean,
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

interface AccSummaryRecord {
  accNo?: string
  accmktName?: string
  accmktType?: string
  acmastNo?: string
  active?: number
  aeCode?: string
  avFund?: number
  baseCcy?: string
  cashBal?: number
  cashBf?: number
  cliId?: string
  creditLimit?: number
  ctrlLevel?: number
  imargin?: number
  imarginLevel?: number
  loanLimit?: number
  loanMkt?: number
  loanToMa?: number
  loanToMv?: number
  marginCall?: number
  marginClass?: string
  marginPeriod?: number
  marketValue?: number
  maxLoanLimit?: number
  mlevel?: number
  mmargin?: number
  nav?: number
  netEquity?: number
  notYetValue?: number
  posLoanLimit?: number
  posTodayTrans?: number
  rawMargin?: number
  rawMarginLevel?: number
  todayCash?: number
  todayTrans?: number
  totalCash?: number
  totalEquity?: number
  totalFee?: number
  totalPl?: number
  tradeLimit?: number
  tradingLimit?: number
  unpresented?: number
}
interface Info {
  data: AccSummaryRecord[]
}
interface AccInfoRecord {
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
  data: AccInfoRecord[]
}
interface AccBalanceRecord {
  accNo?: string
  cash?: number
  cashBf?: number
  ccy?: string
  notYetValue?: number
  sesSeqNo?: number
  todayCash?: number
  todayOut?: number
  unpresented?: number
  unpresentedBf?: number
}
interface Balance {
  data: AccBalanceRecord[]
}
interface AccPositionRecord {
  accNo?: string
  aeCode?: string
  closeQty?: number
  decInPrc?: number
  instCode?: string
  longAvg?: number
  longQty?: number
  longShort?: string
  longTotalAmt?: number
  netAvg?: number
  netLongQty?: number
  netQty?: number
  netShortQty?: number
  netTotalAmt?: number
  previousAvg?: number
  prodCode?: string
  profitLoss?: number
  psQty?: number
  psTotalAmt?: number
  qty?: number
  shortAvg?: number
  shortQty?: number
  shortTotalAmt?: number
  totalAmt?: number
  updateTime?: number
}
interface Position {
  data: AccPositionRecord[]
}
interface AccClearTradeRecord {
  accNo?: string
  accOrderNo?: number
  aeCode?: string
  avgPrice?: number
  buySell?: string
  counterParty?: string
  decInPrc?: number
  doneTradeDate?: number
  doneTradeTime?: number
  extOrderNo?: string
  initiator?: string
  instCode?: string
  orderNo?: number
  prodCode?: string
  recNo?: number
  status?: number
  systemId?: string
  totalTrdPrc?: number
  tradeDateStr?: string
  tradeNo?: number
  tradePrice?: number
  tradeQty?: number
  tradeTime?: number
  tradeTimeStr?: string
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
  id: string,
  name: string,
  bQty: number,
  sQty: number,
  tradePrc: number,
  tradeNum: number,
  status: string,
  initiator: string,
  ref: string,
  time: string,
  orderPrc: number,
  orderNo: number,
  extOrder: string,
  logNum: string
}
interface DoneTrade {
  data: AccDoneTradeRecord[]
}
interface FxRate {
  ccy: string,
  rate: string
}

const currentUser = (state: UserState = {}, action: ActionData): UserState => {
  switch (action?.type) {
    case actionConsts.LOGIN2FA:
      return {
        ...state,
        userId: action.payload?.userId,
        authed: action.payload?.authed
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
          limit: action.payload?.limit,
          page: action.payload?.page,
          data: action.payload?.recordData,
          sort: action.payload?.sort,
          sortBy: action.payload?.sortBy,
          total: action.payload?.total,
          totalPage: action.payload?.totalPage
        } as Account<Balance>
      };
    case actionConsts.SET_ACC_INFO:
      return {
        ...state,
        info: {
          limit: action.payload?.limit,
          page: action.payload?.page,
          data: action.payload?.recordData,
          sort: action.payload?.sort,
          sortBy: action.payload?.sortBy,
          total: action.payload?.total,
          totalPage: action.payload?.totalPage
        } as Account<Info>
      };
    case actionConsts.SET_ACC_ORDER:
      return {
        ...state,
        order: {
          limit: action.payload?.limit,
          page: action.payload?.page,
          data: action.payload?.recordData,
          sort: action.payload?.sort,
          sortBy: action.payload?.sortBy,
          total: action.payload?.total,
          totalPage: action.payload?.totalPage
        } as Account<Order>
      };
    case actionConsts.SET_ACC_POS:
      return {
        ...state,
        position: {
          limit: action.payload?.limit,
          page: action.payload?.page,
          data: action.payload?.recordData,
          sort: action.payload?.sort,
          sortBy: action.payload?.sortBy,
          total: action.payload?.total,
          totalPage: action.payload?.totalPage
        } as Account<Position>
        };
    case actionConsts.SET_ACC_SUM:
      return {
        ...state,
        summary: {
          limit: action.payload?.limit,
          page: action.payload?.page,
          data: action.payload?.recordData,
          sort: action.payload?.sort,
          sortBy: action.payload?.sortBy,
          total: action.payload?.total,
          totalPage: action.payload?.totalPage
        } as Account<Summary>
      };
    case actionConsts.SET_DONE_TRADE:
      return {
        ...state,
        doneTrade: {
          limit: action.payload?.limit,
          page: action.payload?.page,
          data: action.payload?.recordData,
          sort: action.payload?.sort,
          sortBy: action.payload?.sortBy,
          total: action.payload?.total,
          totalPage: action.payload?.totalPage
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
  FxRate,
  AccInfoRecord,
  AccSummaryRecord,
  AccBalanceRecord,
  AccPositionRecord,
  AccClearTradeRecord,
  AccCashRecord,
  AccOrderRecord,
  AccDoneTradeRecord
};

