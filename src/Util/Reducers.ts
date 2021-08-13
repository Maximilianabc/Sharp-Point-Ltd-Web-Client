import { actionConsts, ActionData } from './Actions';
import { SortOrder } from './Util';

interface UserState {
  authed?: boolean,
  isAE?: boolean,
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
  marketDataShort?: { [id: string]: MarketDataShort },
  marketDataLong?: { [id: string]: MarketDataLong }
}

type StateContentTypes = Empty | UserTypes | Account<Details> | unknown;

interface Empty { }

type UserTypes = UserId | SessionToken | ServerKey | Name | AE;
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
interface AE {
  isAE: boolean
}

type Details = Info | Summary | Balance | Position | ClearTrade | CashMovement | Order | DoneTrade;
type Account<U extends Details> = U & {
  limit?: number,
  page?: number,
  sort?: SortOrder,
  sortBy?: string,
  total?: number,
  totalPage?: number
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
  accNo?: string,
  closeQty?: number,
  covered?: number,
  decInPrc?: number,
  longAvg?: number,
  longQty?: number,
  longShort?: string,
  longTotalAmount?: number,
  longTotalAmt?: number,
  mktPrice?: number,
  netAvg?: number,
  netLongQty?: number,
  netQty?: number,
  netShortQty?: number,
  netTotalAmt?: number,
  previousAvg?: number,
  prodCode?: string,
  prodProfitLoss?: number,
  profitLoss?: number,
  psQty?: number,
  psTotalAmount?: number,
  psTotalAmt?: number,
  qty?: number,
  shortAvg?: number,
  shortQty?: number,
  shortTotalAmount?: number,
  shortTotalAmt?: number,
  totalAmount?: number,
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
  orderNo?: BigInt,
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
  validType?: number
}
interface Order {
  data: { [clOrderId: string]: AccOrderRecord }
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
interface MarketDataLong {
  prodCode: string,
  productName: string,
  productType: number,
  contractSize: number,
  expiryDate: number,
  instrumentCode: string,
  currency: string,
  strike: number,
  callPut: string,
  underlying: string,
  bidPrice1: number,
  bidPrice2: number,
  bidPrice3: number,
  bidPrice4: number,
  bidPrice5: number,
  bidQty1: number,
  bidQty2: number,
  bidQty3: number,
  bidQty4: number,
  bidQty5: number,
  askPrice1: number,
  askPrice2: number,
  askPrice3: number,
  askPrice4: number,
  askPrice5: number,
  askQty1: number,
  askQty2: number,
  askQty3: number,
  askQty4: number,
  askQty5: number,
  lastPrice1: number,
  lastPrice2: number,
  lastPrice3: number,
  lastPrice4: number,
  lastPrice5: number,
  lastQty1: number,
  lastQty2: number,
  lastQty3: number,
  lastQty4: number,
  lastQty5: number,
  openInterest: number,
  turnoverAmount: number,
  turnoverVolume: number,
  reserved1: number,
  reserved2: number,
  equilibriumPrice: number,
  open: number,
  high: number,
  low: number,
  previousClose: number,
  previousCloseDate: number,
  notUsed: number,
  tradeStateNo: number,
}
interface MarketDataShort {
  prodCode: string,
  mktPrice: number,
  previousClose: number,
  time: number
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
    case actionConsts.SET_AE:
      return {
        ...state,
        isAE: action.payload
      };
    case actionConsts.SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case actionConsts.SET_SERVER_KEY:
      return {
        ...state,
        serverKey: action.payload
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
    case actionConsts.SET_ACC_ORDER_PUSH:
      return {
        ...state,
        order: {
          ...state.order,
          data: {
            ...state.order?.data,
            [action.payload?.clOrderId]: {
              
            }
          }
        }
      };
    case actionConsts.UPDATE_MARKET_PRICE_SHORT:
      return {
        ...state,
        marketDataShort: {
          ...state.marketDataShort,
          [action.payload?.prodCode]: {
            prodCode: action.payload?.prodCode,
            mktPrice: action.payload?.mktPrice,
            previousClose: action.payload?.prevClose,
            time: action.payload?.time
          }
        }
      };
    case actionConsts.UPDATE_MARKET_PRICE_LONG:
      return {
        ...state,
        marketDataLong: {
          ...state.marketDataLong,
          [action.payload?.prodCode]: {
            prodCode: action.payload?.prodCode,
            productName: action.payload?.productName,
            productType: action.payload?.productType,
            contractSize: action.payload?.contractSize,
            expiryDate: action.payload?.expiryDate,
            instrumentCode: action.payload?.instrumentCode,
            currency: action.payload?.currency,
            strike: action.payload?.strike,
            callPut: action.payload?.callPut,
            underlying: action.payload?.underlying,
            bidPrice1: action.payload?.bidPrice1,
            bidPrice2: action.payload?.bidPrice2,
            bidPrice3: action.payload?.bidPrice3,
            bidPrice4: action.payload?.bidPrice4,
            bidPrice5: action.payload?.bidPrice5,
            bidQty1: action.payload?.bidQty1,
            bidQty2: action.payload?.bidQty2,
            bidQty3: action.payload?.bidQty3,
            bidQty4: action.payload?.bidQty4,
            bidQty5: action.payload?.bidQty5,
            askPrice1: action.payload?.askPrice1,
            askPrice2: action.payload?.askPrice2,
            askPrice3: action.payload?.askPrice3,
            askPrice4: action.payload?.askPrice4,
            askPrice5: action.payload?.askPrice5,
            askQty1: action.payload?.askQty1,
            askQty2: action.payload?.askQty2,
            askQty3: action.payload?.askQty3,
            askQty4: action.payload?.askQty4,
            askQty5: action.payload?.askQty5,
            lastPrice1: action.payload?.lastPrice1,
            lastPrice2: action.payload?.lastPrice2,
            lastPrice3: action.payload?.lastPrice3,
            lastPrice4: action.payload?.lastPrice4,
            lastPrice5: action.payload?.lastPrice5,
            lastQty1: action.payload?.lastQty1,
            lastQty2: action.payload?.lastQty2,
            lastQty3: action.payload?.lastQty3,
            lastQty4: action.payload?.lastQty4,
            lastQty5: action.payload?.lastQty5,
            openInterest: action.payload?.openInterest,
            turnoverAmount: action.payload?.turnoverAmount,
            turnoverVolume: action.payload?.turnoverVolume,
            reserved1: action.payload?.reserved1,
            reserved2: action.payload?.reserved2,
            equilibriumPrice: action.payload?.equilibriumPrice,
            open: action.payload?.open,
            high: action.payload?.high,
            low: action.payload?.low,
            previousClose: action.payload?.previousClose,
            previousCloseDate: action.payload?.previousCloseDate,
            notUsed: action.payload?.notUsed,
            tradeStateNo: action.payload?.tradeStateNo
          }
        }
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
  MarketDataLong,
  MarketDataShort,
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

