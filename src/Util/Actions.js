const actionConsts = {
  LOGIN2FA: 'LOGIN2FA',
  LOGOUT: 'LOGOUT',
  SET_TOKEN: 'SET_TOKEN'
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

export {
  actionConsts,
  loginAction,
  logoutAction,
  setTokenAction
}
