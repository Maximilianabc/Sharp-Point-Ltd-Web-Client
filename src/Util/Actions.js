const actionConsts = {
  LOGIN2FA: 'LOGIN2FA',
  LOGOUT: 'LOGOUT',
  SET_TOKEN: 'SET_TOKEN',
  SET_ACC_NUM: 'SET_ACC_NUM',
  SET_ACC_BAL: 'SET_ACC_BAL',
  SET_ACC_INFO: 'SET_ACC_INFO',
  SET_ACC_ORDER: 'SET_ACC_ORDER',
  SET_ACC_POS: 'SET_ACC_POS',
  SET_ACC_SUM: 'SET_ACC_SUM',
  SET_DONE_TRADE: 'SET_DONE_TRADE'
};

const loginAction = (data) => {
  return {
    type: actionConsts.LOGIN2FA,
    payload: data
  }
};

const logoutAction = () => {
  return {
    type: actionConsts.LOGOUT
  }
};

const setTokenAction = (token) => {
  return {
    type: actionConsts.SET_TOKEN,
    payload: token
  };
};

const setAccountNumAction = (accNo) => {
  return {
    type: actionConsts.SET_ACC_NUM,
    payload: accNo
  };
}

const setAccountBalanaceAction = (balance) => {
  return {
    type: actionConsts.SET_ACC_BAL,
    payload: balance
  }
};

const setAccountInfoAction = (info) => {
  return {
    type: actionConsts.SET_ACC_INFO,
    payload: info
  };
};

const setAccountOrderAction = (order) => {
  return {
    type: actionConsts.SET_ACC_ORDER,
    payload: order
  };
};

const setAccountPositionAction = (position) => {
  return {
    type: actionConsts.SET_ACC_POS,
    payload: position
  };
};

const setAccountSummaryAction = (summary) => {
  return {
    type: actionConsts.SET_ACC_SUM,
    payload: summary
  };
};

const setDoneTradeReportAction = (doneTrade) => {
  return {
    type: actionConsts.SET_DONE_TRADE,
    payload: doneTrade
  }
};

export {
  actionConsts,
  loginAction,
  logoutAction,
  setTokenAction,
  setAccountNumAction,
  setAccountInfoAction,
  setAccountOrderAction,
  setAccountPositionAction,
  setAccountSummaryAction,
  setAccountBalanaceAction,
  setDoneTradeReportAction
}
