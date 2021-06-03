import { actionConsts } from './Actions';

const currentUser = (state = {}, action) => {
  switch (action.type) {
    case actionConsts.LOGIN2FA:
      return {
        ...state,
        userId: action.payload.userId,
        password: action.payload.password
      }
    case actionConsts.LOGOUT:
      return {
        ...state,
        userId: '',
        password: ''
      }
    case actionConsts.SET_TOKEN:
      return {
        ...state,
        sessionToken: action.payload
      }
    default:
      return state;
  }
};

export { currentUser };
