import { actionConsts, ActionData } from './Actions';
import { SortOrder } from './Util';

interface UserState {
  authed?: boolean,
  userId?: string,
  token?: string,
  serverKey?: string,
  accName?: string,
  info?: Account<Info>,
  summary?: Account<Summary>,
  balance?: Account<Balance>,
  position?: Account<Position>,
  clearTrade?: Account<ClearTrade>,
  cash?: Account<CashMovement>,
  order?: Account<Order>,
  doneTrade?: Account<DoneTrade>,
  working?: Account<WorkingOrder>,
}

type StateContentTypes = Empty | UserTypes | Account<Details> | unknown;

interface Empty { }

type UserTypes = UserId | SessionToken | ServerKey | Name;
interface UserId {
  userId: string
  password: string
}
interface SessionToken {
  token: string
}
interface ServerKey {
  key: string
}
interface Name {
  accName: string
}

type Details = Info | Summary | Balance | Position | ClearTrade | CashMovement | Order | DoneTrade;
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
interface Summary {
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
interface Info {
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
interface ClearTradeRecord {
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
  data: ClearTradeRecord[]
}
interface CashMovementRecord {
  accName?: string,
  accNo?: string,
  accOrderNo?: number,
  aeCode?: string,
  aeId?: string,
  amount?: number,
  applyFundDate?: number,
  applyFundDateStr?: string,
  apprMsg?: string,
  apprSender?: string,
  apprTime?: number,
  apprTimeStr?: string,
  bankAccNo?: string,
  bankCode?: string,
  clOrderId?: string,
  code?: string,
  dAmount?: number,
  dCode?: string,
  remark?: string,
  reqAction?: number,
  reqMsg?: string,
  reqPrice?: number,
  reqQty?: number,
  reqSender?: string,
  reqStatus?: number,
  reqStatusStr?: string,
  reqTime?: number,
  reqTimeStr?: string,
  reqType?: string,
  reqTypeStr?: string,
  systemId?: string,
  wAmount?: number,
  wCode?: string  
}
interface CashMovement {
  data: CashMovementRecord[]
}
interface AccOrderRecord {
  accNo?: string,
  accOrderNo?: number,
  active?: number,
  aeCode?: string,
  buySell?: string,
  clOrderId?: string,
  condType?: number,
  condTypeStr?: string,
  condition?: string,
  decInPrc?: number,
  downLevel?: number,
  downPrice?: number,
  extOrderNo?: string,
  gatewayCode?: string,
  openClose?: string,
  orderId?: string,
  orderNo?: number,
  orderPrice?: number,
  orderType?: number,
  prodCode?: string,
  qty?: number,
  ref?: string,
  ref2?: string,
  remainQty?: number,
  schedTime?: number,
  sender?: string,
  specTime?: number,
  status?: number,
  statusStr?: string,
  stopPrice?: number,
  stopStatus?: number,
  stopType?: string,
  timeStamp?: number,
  timeStampStr?: string,
  totalQty?: number,
  totalTrdPrc?: number,
  tradeSession?: string,
  tradedQty?: number,
  type?: string,
  upLevel?: number,
  upPrice?: number,
  validType?: number
}
interface Order {
  data: AccOrderRecord[]
}
interface DoneTradeRecord {
  accNo?: string,
  accOrderNo?: number,
  aeCode?: string,
  avgPrice?: number,
  buySell?: string,
  counterParty?: string,
  decInPrc?: number,
  doneTradeDate?: number,
  doneTradeTime?: number,
  extOrderNo?: string,
  initiator?: string,
  instCode?: string,
  orderNo?: number,
  prodCode?: string,
  recNo?: number,
  status?: number,
  systemId?: string,
  totalTrdPrc?: number,
  tradeDateStr?: string,
  tradeNo?: number,
  tradePrice?: number,
  tradeQty?: number,
  tradeTime?: number,
  tradeTimeStr?: string  
}
interface DoneTrade {
  data: DoneTradeRecord[]
}
interface WorkingOrderRecord {
  accNo?: string,
  accOrderNo?: number,
  active?: number,
  aeCode?: string,
  buySell?: string,
  clOrderId?: string,
  condType?: number,
  condTypeStr?: string,
  condition?: string,
  decInPrc?: number,
  downLevel?: number,
  downPrice?: number,
  extOrderNo?: string,
  gatewayCode?: string,
  openClose?: string,
  orderId?: string,
  orderNo?: number,
  orderPrice?: number,
  orderType?: number,
  prodCode?: string,
  qty?: number,
  ref?: string,
  ref2?: string,
  remainQty?: number,
  schedTime?: number,
  sender?: string,
  specTime?: number,
  status?: number,
  statusStr?: string,
  stopPrice?: number,
  stopStatus?: number,
  stopType?: string,
  timeStamp?: number,
  timeStampStr?: string,
  totalQty?: number,
  totalTrdPrc?: number,
  tradeSession?: string,
  tradedQty?: number,
  type?: string,
  upLevel?: number,
  upPrice?: number,
  validType?: number
}
interface WorkingOrder {
  data: WorkingOrderRecord[]
}
interface OrderHistoryRecord {
  accNo?: string,
  accOrderNo?: number,
  active?: number,
  aeCode?: string,
  buySell?: string,
  clOrderId?: string,
  condType?: number,
  condTypeStr?: string,
  condition?: string,
  decInPrc?: number,
  downLevel?: number,
  downPrice?: number,
  extOrderNo?: string,
  gatewayCode?: string,
  openClose?: string,
  orderId?: string,
  orderNo?: number,
  orderNoStr?: string,
  orderPrice?: number,
  orderType?: number,
  prodCode?: string,
  qty?: number,
  ref?: string,
  ref2?: string,
  remainQty?: number,
  schedTime?: number,
  sender?: string,
  specTime?: number,
  status?: number,
  statusStr?: string,
  stopPrice?: number,
  stopStatus?: number,
  stopType?: string,
  timeStamp?: number,
  timeStampStr?: string,
  totalQty?: number,
  totalTrdPrc?: number,
  tradeSession?: string,
  tradedQty?: number,
  type?: string,
  upLevel?: number,
  upPrice?: number,
  validType?: number,  
}
interface OrderHistory {
  data: OrderHistoryRecord[]
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
    case actionConsts.SET_SERVER_KEY:
      return {
        ...state,
        serverKey: action.payload
      }
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
  ServerKey,
  Name,
  Account,
  Details,
  Info,
  Summary,
  Balance,
  Position,
  ClearTrade,
  CashMovement as Cash,
  Order,
  DoneTrade,
  WorkingOrder,
  OrderHistory,
  FxRate,
  AccInfoRecord,
  AccSummaryRecord,
  AccBalanceRecord,
  AccPositionRecord,
  ClearTradeRecord,
  CashMovementRecord,
  AccOrderRecord,
  DoneTradeRecord,
  WorkingOrderRecord,
  OrderHistoryRecord
};

