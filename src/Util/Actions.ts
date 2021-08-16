interface ActionData {
  type: string,
  payload?: any
}

const actionConsts: Record<string, string> = {
  LOGIN2FA: 'LOGIN2FA',
  LOGOUT: 'LOGOUT',
  SET_AE: 'SET_AE',
  SET_TOKEN: 'SET_TOKEN',
  SET_SERVER_KEY: 'SET_SERVER_KEY',
  SET_ACC_NUM: 'SET_ACC_NUM',
  SET_ACC_BAL: 'SET_ACC_BAL',
  SET_ACC_INFO: 'SET_ACC_INFO',
  SET_ACC_ORDER: 'SET_ACC_ORDER',
  SET_ACC_POS: 'SET_ACC_POS',
  SET_ACC_SUM: 'SET_ACC_SUM',
  SET_DONE_TRADE: 'SET_DONE_TRADE',
  SET_ACC_BAL_PUSH: 'SET_ACC_BAL_PUSH',
  SET_ACC_INFO_PUSH: 'SET_ACC_INFO_PUSH',
  SET_ACC_ORDER_PUSH: 'SET_ACC_ORDER_PUSH',
  SET_ACC_POS_PUSH: 'SET_ACC_POS_PUSH',
  SET_ACC_SUM_PUSH: 'SET_ACC_SUM_PUSH',
  SET_DONE_TRADE_PUSH: 'SET_DONE_TRADE_PUSH',
  UPDATE_MARKET_PRICE_SHORT: 'UPDATE_MARKET_PRICE_SHORT',
  UPDATE_MARKET_PRICE_LONG: 'UPDATE_MARKET_PRICE_LONG',
};

const loginAction = (data: any): ActionData => {
  return {
    type: actionConsts.LOGIN2FA,
    payload: data
  }
};

const logoutAction = (): ActionData => {
  return {
    type: actionConsts.LOGOUT
  }
};

const setAEAction = (ae: boolean): ActionData => {
  return {
    type: actionConsts.SET_AE,
    payload: ae
  };
};

const setTokenAction = (token: string): ActionData => {
  return {
    type: actionConsts.SET_TOKEN,
    payload: token
  };
};

const setServerKeyAction = (key: string): ActionData => {
  return {
    type: actionConsts.SET_SERVER_KEY,
    payload: key
  };
};

const setAccountNumAction = (accNo: string): ActionData => {
  return {
    type: actionConsts.SET_ACC_NUM,
    payload: accNo
  };
}

const setAccountBalanaceAction = (balance: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_BAL,
    payload: balance
  }
};

const setAccountBalanceByPushAction = (balance: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_BAL_PUSH,
    payload: balance
  }
};

const setAccountInfoAction = (info: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_INFO,
    payload: info
  };
};

const setAccountOrderAction = (order: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_ORDER,
    payload: order
  };
};

const setAccountOrderByPushAction = (order: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_ORDER_PUSH,
    payload: order
  }
};

const setAccountPositionAction = (position: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_POS,
    payload: position
  };
};

const setAccountPositionByPushAction = (position: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_POS_PUSH,
    payload: position
  }
};

const setAccountSummaryAction = (summary: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_SUM,
    payload: summary
  };
};

const setAccountSummaryByPushAction = (summary: any): ActionData => {
  return {
    type: actionConsts.SET_ACC_SUM_PUSH,
    payload: summary
  }
};

const setDoneTradeReportAction = (doneTrade: any): ActionData => {
  return {
    type: actionConsts.SET_DONE_TRADE,
    payload: doneTrade
  }
};

const setDoneTradeReportByPushAction = (doneTrade: any): ActionData => {
  return {
    type: actionConsts.SET_DONE_TRADE_PUSH,
    payload: doneTrade
  }
};

const updateMarketDataShortAction = (mktDataShort: any): ActionData => {
  return {
    type: actionConsts.UPDATE_MARKET_PRICE_SHORT,
    payload: mktDataShort
  }
};

const updateMarketDataLongAction = (mktDataLong: any): ActionData => {
  return {
    type: actionConsts.UPDATE_MARKET_PRICE_LONG,
    payload: mktDataLong
  }
};

export {
  actionConsts,
  loginAction,
  logoutAction,
  setAEAction,
  setTokenAction,
  setServerKeyAction,
  setAccountNumAction,
  setAccountInfoAction,
  setAccountOrderAction,
  setAccountPositionAction,
  setAccountSummaryAction,
  setAccountBalanaceAction,
  setDoneTradeReportAction,
  setAccountOrderByPushAction,
  setAccountPositionByPushAction,
  setAccountSummaryByPushAction,
  setAccountBalanceByPushAction,
  setDoneTradeReportByPushAction,
  updateMarketDataShortAction,
  updateMarketDataLongAction,
};
export type {
  ActionData
};

