const locales = {
  ENGLISH: "en-US",
  CHINESE_TRADITIONAL: "zh-HK",
  CHINESE_SIMPLIFIED: "zh-CN"
};

const messages: { [key: string]: { [key: string]: string } }= {
  [locales.ENGLISH]: {
    login: 'login',
    logout: 'logout',
    session_expired: 'Session expired. Please login again',
    user_name: 'User Name',
    password: 'Password',
    twofa: '2FA Code',
    submit: 'Submit',
    account_name: 'Account Name',
    invalid_twofa: 'Invalid code',
    invalid_username: 'Invalid user name',
    welcome: 'Welcome to Sharp Point Trading Platform.',
    greeting_morning: 'Good morning, {user}',
    greeting_afternoon: 'Good afternoon, {user}',
    greeting_evening: 'Good evening, {user}',

    dashboard: 'Dashboard',
    filter_list: 'Filter List',

    summary: 'Summary',
    details: 'Details',
    nav: 'NAV',
    buying_power: 'Buying Power',
    cash_balance: 'Cash Balance',
    margin: 'Margin',
    margin_current_i: 'Current I.',
    margin_current_m: 'Current M.',
    margin_project_overnight: 'Projected Overnight',
    margin_level: 'Level',
    margin_maximum: 'Maximum',
    margin_class: 'Class',
    margin_call: 'Call',
    period: 'Period',
    pl: 'P/L',
    todays_pl: 'Today\'s P/L',
    commodity_pl: 'Commodity p/L',
    transaction_amount: 'Transcation Amount',
    lockup_amount: 'Lockup Amount',
    credit_limit: 'Credit Limit',
    average_net_option_value: 'Avg. Net Optional Value',
    ctrl_level: 'Control Level',

    positions: 'Positions',
    stock_name: 'Name',
    stock_id: 'ID',
    prev: 'Prev',
    average: 'Avg',
    quantity: 'Qty',
    long: 'Long',
    short: 'Short',
    net: 'Net',
    price: 'Price',
    fx: 'FX',
    contract: 'Contract',

    todays_orders: 'Today\'s Orders',
    working_orders: 'Working Orders',
    order_history: 'Order History',
    buy_sell: 'Buy/Sell',
    buy: 'Buy',
    sell: 'Sell',
    status: 'Status',
    working: 'Working',
    deleted: 'Deleted',
    traded: 'Traded'
  },
  [locales.CHINESE_TRADITIONAL]: {
    login: '登入',
    logout: '登出',
    session_expired: 'Session已過期，請重新登入。',
    user_name: '用戶名稱',
    password: '密碼',
    twofa: '2FA 驗證碼',
    submit: '提交',
    account_name: '帳戶名稱',
    invalid_twofa: '無效的驗證碼',
    invalid_username: '無效的用戶名稱',
    welcome: '歡迎來到 Sharp Point 交易平台',
    greeting_morning: '早安，{user}',
    greeting_afternoon: '午安，{user}',
    greeting_evening: '晚安，{user}',

    dashboard: '',
    filter_list: '篩選',

    summary: '帳戶資料',
    details: '詳細',
    nav: '資產淨值',
    buying_power: '購買力',
    cash_balance: '現金結餘',
    margin: '保證金',
    margin_current_i: '現時基本',
    margin_current_m: '現時維持',
    margin_project_overnight: '預計隔夜',
    margin_level: '水平',
    margin_maximum: '最高',
    margin_class: '類別',
    margin_call: '追收金額',
    period: '時段',
    pl: '盈虧',
    todays_pl: '今日盈虧',
    commodity_pl: '商品盈虧',
    transaction_amount: '交易金額',
    lockup_amount: '凍結金額',
    credit_limit: '信貸限額',
    average_net_option_value: '可用期權淨值',
    ctrl_level: '控制級數',

    positions: '持倉',
    stock_name: '名稱',
    stock_id: '代號',
    prev: '上日',
    average: '平均',
    quantity: '數量',
    long: '長倉',
    short: '短倉',
    net: '淨倉',
    price: '市價',
    fx: '參考兌換率',
    contract: '合約值',

    todays_orders: '今日訂單',
    working_orders: '工作中的訂單',
    order_history: '訂單記錄',
    buy_sell: '買/賣',
    buy: '買',
    sell: '賣',
    status: '狀態',
    working: '工作中',
    deleted: '已刪除',
    traded: '已成交'
  },
  [locales.CHINESE_SIMPLIFIED]: {
    login: '登录',
    logout: '登出',
    session_expired: 'Session已过期，请重新登录。',
    user_name: '用户名称',
    password: '密码',
    twofa: '2FA 认证码',
    submit: '提交',
    account_name: '账号名称',
    invalid_username: '无效的用户名称',
    invalid_twofa: '无效的认证码',
    welcome: '欢迎来到 Sharp Point 交易平台',
    greeting_morning: '早上好，{user}',
    greeting_afternoon: '下午好，{user}',
    greeting_evening: '晚上好，{user}',

    dashboard: '',
    filter_list: '',

    summary: '',
    details: '',
    nav: '',
    buying_power: '',
    cash_balance: '',
    margin: '',
    margin_current_i: '',
    margin_current_m: '',
    margin_project_overnight: '',
    margin_level: '',
    margin_maximum: '',
    margin_class: '',
    margin_call: '',
    period: '',
    pl: '',
    todays_pl: '',
    commodity_pl: '',
    transaction_amount: '',
    lockup_amount: '',
    credit_limit: '',
    average_net_option_value: '',
    ctrl_level: '',

    positions: '',
    stock_name: '',
    stock_id: '',
    prev: '',
    average: '',
    quantity: '',
    long: '',
    short: '',
    net: '',
    price: '',
    fx: '',
    contract: '',

    todays_orders: '',
    working_orders: '',
    order_history: '',
    buy_sell: '',
    buy: '',
    sell: '',
    status: '',
    working: '',
    deleted: '',
    traded: ''
  }
};

const getTimePhrase = (): string => {
  const hour = new Date(Date.now()).getHours();
  switch (true) {
    case (hour >= 0 && hour < 12):
      return 'morning';
    case (hour >= 12 && hour < 18):
      return 'afternoon';
    case (hour >= 18 && hour <= 23):
      return 'evening';
    default:
      throw new Error('unknown time.');
  }
};

export {
  locales,
  messages,
  getTimePhrase
}
