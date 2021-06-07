import { actionConsts } from './Actions';

const currentUser = (state = {}, action) => {
  switch (action.type) {
    case actionConsts.LOGIN2FA:
      return {
        ...state,
        userId: action.payload.userId,
        password: action.payload.password
      };
    case actionConsts.LOGOUT:
      return {
        ...state,
        userId: '',
        password: ''
      };
    case actionConsts.SET_TOKEN:
      return {
        ...state,
        sessionToken: action.payload
      };
    case actionConsts.SET_ACC_NUM:
      return {
        ...state,
        accNo: action.payload
      };
    case actionConsts.SET_ACC_BAL:
      return {
        ...state,
        limit: action.payload.limit,
        page: action.payload.page,
        balance: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      };
    case actionConsts.SET_ACC_INFO:
      return {
        ...state,
        accInfo: action.payload.recordData
      }
    case actionConsts.SET_ACC_ORDER:
      return {
        ...state,
        limit: action.payload.limit,
        page: action.payload.page,
        order: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      };
    case actionConsts.SET_ACC_POS:
      return {
        ...state,
        limit: action.payload.limit,
        page: action.payload.page,
        position: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      };
    case actionConsts.SET_ACC_SUM:
      return {
        ...state,
        summary: action.payload.recordData
      };
    case actionConsts.SET_DONE_TRADE:
      return {
        ...state,
        limit: action.payload.limit,
        page: action.payload.page,
        doneTrade: action.payload.recordData,
        sort: action.payload.sort,
        sortBy: action.payload.sortBy,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      };
    default:
      return state;
  }
};

export { currentUser };
