import React, {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  ReactElement,
  useCallback
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  LabelBaseProps,
  DataTable,
  StackedLabelProps,
  StyledTableToolbar,
  setStackedLabelValues,
  setLabelBasePropsValue,
  getIconTypeByStatus,
  TooltipIconButton,
  TooltipIconProps,
  LabelTable,
  LabelColumn,
  OrderForm,
  IconProps,
  FilterForm
} from '../Components';
import { 
  getDispatchSelectCB,
  operations,
  OPConsts,
  OrderRecordRow,
  UserState,
  getOrderStatusString,
  getValidTypeString,
  CARD_CLASSES,
  CARD_BUTTON_CLASSES,
  CARD_BUTTON_HEADER_LABEL_CLASSES,
  TOOLTIP_CLASSES,
  ROW_CONTAINER_CLASSES,
  WorkingOrderRecordRow,
  TOOLTIP_TEXT_CLASSES,
  workingInProgess,
  OPType,
  StoreCallbacks,
  OrderStatus,
  OrderHistoryRecordRow,
  AccOrderRecord,
  WorkingOrderRecord,
  OrderHistoryRecord,
  SCROLL_BAR_CLASSES,
  BUY_COLOR,
  SELL_COLOR,
  HEADER_LABEL_CLASSES,
  LABEL_CLASSES,
  WHITE40,
  WHITE60,
  WHITE80,
  messages,
  localeTypes,
  MarketDataShort,
  MarketDataLong,
  store,
  Filter,
  combineFilters,
  getConditionTypeString
} from '../Util';
import { useHistory } from 'react-router';
import { Box, Card, CardContent } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { useIntl } from 'react-intl';

interface OrdersMinifiedProps {
  setMessages?: (message: string[]) => void,
  posRefreshRef: any,
  refreshRef: any
}

const headCells: { [name: string]: LabelBaseProps } = {
  stockID: { id: 'id', align: 'left', label: 'stock_id', colorMode: 'ignored' },
  stockName: { id: 'name', align: 'left', label: 'stock_name', colorMode: 'ignored' },
  buyQty: { id: 'os-bqty', align: 'right', label: 'quantity', colorMode: 'normal' },
  sellQty: { id: 'os-sqty', align: 'right', label: 'quantity', colorMode: 'normal' },
  price: { id: 'price', align: 'left', label: 'price', colorMode: 'normal' },
  valid: { id: 'valid', align: 'right', label: 'valid', colorMode: 'ignored' },
  condition: { id: 'condition', align: 'right', label: 'condition', colorMode: 'ignored' },
  status: { id: 'status', align: 'right', label: 'status', colorMode: 'ignored'},
  traded: { id: 'traded', align: 'right', label: 'traded', colorMode: 'ignored' },
  init: { id: 'initiator', align: 'right', label: 'initiator', colorMode: 'ignored' },
  ref: { id: 'ref', align: 'right', label: 'reference', colorMode: 'ignored' },
  time: { id: 'time', align: 'right', label: 'time', colorMode: 'ignored' },
  ext: { id: 'external-order', align: 'right', label: 'external_order', colorMode: 'ignored' },
};

const headCellsMinified : { [name: string]: LabelBaseProps } = {
  first: {
    otherLabels: [ 
      { id: 'buy-sell', label: 'buy_sell', align: 'left', colorMode: 'ignored' }, 
      headCells.status ]
  } as StackedLabelProps,
  stock: {
    classes: { root: { minWidth: '10rem' }},
    otherLabels: [headCells.stockName, headCells.stockID]
  } as StackedLabelProps,
  price: headCells.price,
  qty: {
    otherLabels: [ { id: 'qty', label: 'quantity', align: 'left', colorMode: 'ignored' }, headCells.traded ]
  } as StackedLabelProps
};

const useStyleOrdersMinified = makeStyles((theme) => ({
  card: {
    ...CARD_CLASSES,
    minWidth: '40vw',
    maxHeight: '60vh',
    right: '1%',
    top: '38%'
  },
  container: {
    ...ROW_CONTAINER_CLASSES,
    maxWidth: '40vw',
    maxHeight: '48vh',
    '&::-webkit-scrollbar': SCROLL_BAR_CLASSES
  },
  detailsButton: CARD_BUTTON_CLASSES,
  detailsButtonLabel: CARD_BUTTON_HEADER_LABEL_CLASSES,
  toolTip: TOOLTIP_CLASSES,
  toolTipText: TOOLTIP_TEXT_CLASSES
}));

const useStyleCollapsibleContent = makeStyles((theme) => ({
  container: {
    borderBottom: `1px solid ${WHITE40}`
  },
  title: {

  },
  column: {
    marginRight: '1rem'
  },
  label: {
    ...HEADER_LABEL_CLASSES,
    fontSize: '0.875rem',
    color: WHITE60
  },
  content: {
    ...LABEL_CLASSES,
    fontSize: '1rem',
    color: WHITE80
  }
}));

const OrdersMinified = (props: OrdersMinifiedProps) => {
  const { setMessages, refreshRef, posRefreshRef } = props;
  type OrderType = "working"|"todays"|"history";
  const classes = useStyleOrdersMinified();
  const collapsibleContentClasses = useStyleCollapsibleContent();
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const tableRef = useRef<any>(null);

  const [orders, setOrders] = useState<OrderRecordRow[]>([]);
  const [workingOrders, setWorkingOrders] = useState<WorkingOrderRecordRow[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryRecordRow[]>([]);
  const displayedOrderHistory = useRef<OrderHistoryRecordRow[]>([]);

  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>("todays");
  const [currentOpen, setCurrentOpen] = useState<boolean[]>(new Array<boolean>(1024).fill(false));
  const [currentEdit, setCurrentEdit] = useState(-1);
  const [prods, setProds] = useState<string[]>([]);

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [filterBackdropOpen, setFilterBackdropOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const [longMode, setLongMode] = useState(true);
  const [reset, setReset] = useState(false);
  const [refresh, setRefresh] = useState(false);

  let mktDataShort: { [id: string]: MarketDataShort } | undefined;
  let mktDataLong: { [id: string]: MarketDataLong } | undefined;

  const history = useHistory();
  const intl = useIntl();
  const dispatch = useDispatch();
  const userState = store.getState();

  const getStoreData = () => {
    if (longMode) {
      mktDataLong = userState.marketDataLong;
    } else {
      mktDataShort = userState.marketDataShort;
    }
  };

  const getStoreCallback = (type: OrderType): StoreCallbacks => {
    return type === 'todays'
            ? getDispatchSelectCB(OPConsts.ORDER) 
            : type === 'working'
              ? getDispatchSelectCB(OPConsts.WORKING)
              : getDispatchSelectCB(OPConsts.HISTORY);
  };
  const getOperationType = (type: OrderType): OPType => {
    return type === 'todays' ? 'account' : 'reporting';
  };

  const payload = {
    sessionToken: token,
    targetAccNo: accNo
  };

  const deleteOrder = (row: number, op: 'delete' | 'active' | 'inactive') => {
    const payload = {
      accNo: accNo,
      accOrderNo: !isNaN(+(orders[row].accOrderNo)) ? +(orders[row].accOrderNo) : -1,
      prodCode: orders[row].id,
      qty: orders[row].qty,
      buySell: orders[row].buySell,
      extOrderNo: orders[row].orderNo,
      sessionToken: token
    };
    operations('order', op, payload, undefined, undefined).then(data => {
      if (data?.data.errorMsg !== "No Error") {
        alert(`Failed to ${op} order, error: ${data?.data.errorMsg}`);
      }
      setRefresh(true);
    });
  };

  const workFunction = (opType: OPType, orderType: OrderType) => {
    let hooks = getStoreCallback(orderType);
    operations(opType, hooks.id, payload, undefined, hooks.action).then(data => {
      try {
        if (data && !data.closeSocket) {
          dispatch(data.actionData);
          onReceivePush(data.data, orderType);
        } else {
          history.push({
            pathname: '/logout',
            state: messages[intl.locale].session_expired
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
  };
  
  const ordersToRows = (orders: any) => {
    let o: OrderRecordRow[] = [];
    let products: string[] = prods;
    let messages: string[] = [];
    
    if (orders) {
      Array.prototype.forEach.call(orders, (order: AccOrderRecord) => {
        let prodName = longMode ? (mktDataLong?.[order?.prodCode ?? '']?.productName ?? '?') : '?';
        if (prodName === '?') {
          getStoreData();
        }

        o.push({
          accOrderNo: order.accOrderNo ?? '?',
          id: order.prodCode ?? '?',
          name: longMode ? (mktDataLong?.[order?.prodCode ?? '']?.productName ?? '?') : '?',
          buySell: order.buySell ?? '',
          qty: order.qty ?? '?',
          tradedQty: order.tradedQty ?? '?',
          price: order.orderPrice ?? '?',
          valid: `${getValidTypeString(order.validType ?? -1)}${order.tradeSession !== "T" ? `, ${order.tradeSession}` : ''}`,
          condition: order.condType !== undefined ? getConditionTypeString(order.condType).toString() : order.condTypeStr ?? '?',
          status: getOrderStatusString(order.status ?? -1),
          initiator: order.sender ?? '?', // !! not present in API
          ref: order.ref ?? '?',
          time: order.timeStampStr ?? '?',
          orderNo: order.orderNoStr ?? '?',
          extOrder: order.extOrderNo ?? '?'
        });
        if (order.prodCode && prods.findIndex(s => s === order.prodCode) === -1) {
          products.push(order.prodCode);
          if (setMessages) {
            products.push(order.prodCode);
            messages.push(`4107,0,${order.prodCode},${longMode ? '0' : '1'},0\r\n`);
          };
        }
      });
      setProds(products);
      if (setMessages && messages.length !== 0) {
        setMessages(messages);
        setRefresh(true);
      }
    }
    return o;
  };

  const workingOrdersToRows = (working: any) => {
    let w: WorkingOrderRecordRow[] = [];
    let products: string[] = prods;
    let messages: string[] = [];

    if (working) {
      Array.prototype.forEach.call(working, (work: WorkingOrderRecord)=> {
        let prodName = longMode ? (mktDataLong?.[work?.prodCode ?? '']?.productName ?? '?') : '?';
        if (prodName === '?') {
          getStoreData();
        }

        w.push({
          accOrderNo: work.accOrderNo ?? '?',
          id: work.prodCode ?? '?',
          name: longMode ? (mktDataLong?.[work?.prodCode ?? '']?.productName ?? '?') : '?',
          buySell: work.buySell ?? '',
          qty: work.qty ?? '?',
          tradedQty: work.tradedQty ?? '?',
          price: work.orderPrice ?? '?',
          valid: `${getValidTypeString(work.validType ?? -1)}${work.tradeSession !== "T" ? `, ${work.tradeSession}` : ''}`,
          condition: work.condType !== undefined ? getConditionTypeString(work.condType).toString() : work.condTypeStr ?? '?',
          status: getOrderStatusString(work.status ?? -1),
          traded: '?',
          initiator: work.sender ?? '?', // !! not present in API
          ref: work.ref ?? '?',
          time: work.timeStampStr ?? '?',
          orderNo: work.orderNoStr ?? '?',
          extOrder: work.extOrderNo ?? '?'
        } as WorkingOrderRecordRow);
        if (work.prodCode && prods.findIndex(s => s === work.prodCode) === -1) {
          products.push(work.prodCode);
          if (setMessages) {
            products.push(work.prodCode);
            messages.push(`4107,0,${work.prodCode},${longMode ? '0' : '1'},0\r\n`);
          };
        }
      });
      setProds(products);
      if (setMessages && messages.length !== 0) {
        setMessages(messages);
        setRefresh(true);
      }
    }
    return w;
  };

  const orderHistoryToRow = (history: any) => {
    let h: OrderHistoryRecordRow[] = [];
    let products: string[] = prods;
    let messages: string[] = [];

    if (history) {
      Array.prototype.forEach.call(history, (hist: OrderHistoryRecord) => {
        //if (hist.timeStampStr && new Date(Date.parse(hist.timeStampStr)).getDate() === new Date(Date.now()).getDate()) {
          let prodName = longMode ? (mktDataLong?.[hist?.prodCode ?? '']?.productName ?? '?') : '?';
          if (prodName === '?') {
            getStoreData();
          }

          h.push({
            accOrderNo: hist.accOrderNo ?? '?',
            id: hist.prodCode ?? '?',
            name: longMode ? (mktDataLong?.[hist?.prodCode ?? '']?.productName ?? '?') : '?',
            buySell: hist.buySell ?? '',
            qty: hist.qty ?? '?',
            tradedQty: hist.tradedQty ?? '?',
            price: hist.orderPrice ?? '?',
            valid: `${getValidTypeString(hist.validType ?? -1)}${hist.tradeSession !== "T" ? `, ${hist.tradeSession}` : ''}`,
            condition: hist.condType !== undefined ? getConditionTypeString(hist.condType).toString() : hist.condTypeStr ?? '?',
            status: getOrderStatusString(hist.status ?? -1),
            traded: '?',
            initiator: hist.sender ?? '?', // !! not present in API
            ref: hist.ref ?? '?',
            time: hist.timeStampStr ?? '?',
            orderNo: hist.orderNoStr ?? '?',
            extOrder: hist.extOrderNo ?? '?'
          } as OrderHistoryRecordRow);
          if (hist.prodCode && prods.findIndex(s => s === hist.prodCode) === -1) {
            products.push(hist.prodCode);
            if (setMessages) {
              products.push(hist.prodCode);
              messages.push(`4107,0,${hist.prodCode},${longMode ? '0' : '1'},0\r\n`);
            };
          }
        //}
      });
      setProds(products);
      if (setMessages && messages.length !== 0) {
        setMessages(messages);
        setRefresh(true);
      }
    }
    return h;
  };

  const onReceivePush = (data: any, orderType: OrderType) => {
    if (data !== undefined) {
      let orders = data.orders ? data.orders : (data.recordData ? data.recordData : undefined);
      if (orders) {
        switch (orderType)
        {
          case 'todays':
            setOrders(ordersToRows(orders));
            break;
          case 'working':
            setWorkingOrders(workingOrdersToRows(orders));
            break;
          case 'history':
            setOrderHistory(orderHistoryToRow(orders));
            break;
        }
      }
    }
  };

  const RowsToLabels = (rows: OrderRecordRow[], locale: localeTypes): LabelBaseProps[][] => {
    let lbls: LabelBaseProps[][] = [];
    if (rows)
    {
      Array.prototype.forEach.call(rows, (r: OrderRecordRow) => {
        let labelRow: LabelBaseProps[] = [];
        labelRow.push(setStackedLabelValues(headCellsMinified.first,
          [ r.buySell === 'S' ? messages[locale].sell : messages[locale].buy, messages[locale][r.status.toLocaleLowerCase()]?.toProperCase() ?? '?' ], 
          [ undefined, { name: getIconTypeByStatus(r.status.toProperCase() as OrderStatus), size: 20, buttonStyle: { padding: 0 }} ],
          [ r.buySell === 'S' ? SELL_COLOR : BUY_COLOR, undefined ]));
        labelRow.push(setStackedLabelValues(headCellsMinified.stock, [ r.name, r.id ]));
        labelRow.push(setLabelBasePropsValue(headCellsMinified.price, r.price?.toString()));
        labelRow.push(setStackedLabelValues(headCellsMinified.qty, [ r.qty?.toString(), r.tradedQty.toString() ]))
        lbls.push(labelRow);
      });
    }
    return lbls;
  };

  const workingOrderRowsToLabels = (rows: WorkingOrderRecordRow[], locale: localeTypes): LabelBaseProps[][] => {
    let lbls: LabelBaseProps[][] = [];
    if (rows)
    {
      Array.prototype.forEach.call(rows, (r: WorkingOrderRecordRow) => {
        let labelRow: LabelBaseProps[] = [];
        labelRow.push(setStackedLabelValues(headCellsMinified.first,
          [ r.buySell === 'S' ? messages[locale].sell : messages[locale].buy, messages[locale][r.status.toLocaleLowerCase()]?.toProperCase() ?? '?' ], 
          [ undefined, { name: getIconTypeByStatus(r.status.toProperCase() as OrderStatus), size: 20, buttonStyle: { padding: 0 }} ],
          [ r.buySell === 'S' ? SELL_COLOR : BUY_COLOR, undefined ]));
        labelRow.push(setStackedLabelValues(headCellsMinified.stock, [ r.name, r.id ]));
        labelRow.push(setLabelBasePropsValue(headCellsMinified.price, r.price?.toString()));
        labelRow.push(setStackedLabelValues(headCellsMinified.qty, [ r.qty?.toString(), r.tradedQty.toString() ]))
        lbls.push(labelRow);
      });
    }
    return lbls;
  };

  const orderHistoryRowsToLabels = (rows: OrderHistoryRecordRow[], locale: localeTypes): LabelBaseProps[][] => {
    let lbls: LabelBaseProps[][] = [];
    if (rows)
    {
      Array.prototype.forEach.call(rows, (r: OrderHistoryRecordRow) => {
        let labelRow: LabelBaseProps[] = [];
        labelRow.push(setStackedLabelValues(headCellsMinified.first,
          [ r.buySell === 'S' ? messages[locale].sell : messages[locale].buy, messages[locale][r.status.toLocaleLowerCase()]?.toProperCase() ?? '?' ], 
          [ undefined, { name: getIconTypeByStatus(r.status.toProperCase() as OrderStatus), size: 20, buttonStyle: { padding: 0 }} ],
          [ r.buySell === 'S' ? SELL_COLOR : BUY_COLOR, undefined ]));
        labelRow.push(setStackedLabelValues(headCellsMinified.stock, [ r.name, r.id ]));
        labelRow.push(setLabelBasePropsValue(headCellsMinified.price, r.price?.toString()));
        labelRow.push(setStackedLabelValues(headCellsMinified.qty, [ r.qty?.toString(), r.tradedQty.toString() ]))
        lbls.push(labelRow);
      });
    }
    return lbls;
  }
 
  const getLabels = (locale: string) => {
    return selectedOrderType === 'todays' 
            ? RowsToLabels(orders, locale as localeTypes) 
            : selectedOrderType === 'working' 
              ? workingOrderRowsToLabels(workingOrders, locale as localeTypes) 
              : orderHistoryRowsToLabels(filterCount === 0 ? orderHistory : displayedOrderHistory.current, locale as localeTypes);
  }

  const getCollapsibleContent = (
      row: OrderRecordRow | WorkingOrderRecordRow | OrderHistoryRecordRow,
      classes: ClassNameMap<'container'|'title'|'column'|'label'|'content'>) => {
    return (
      <Box>
        <LabelTable classes={classes}>
          <LabelColumn
            labels={[headCells.valid]}
            content={[row.valid]} // TODO modify if 3 types of order records have different properties
            classes={classes}
          />
          <LabelColumn
            labels={[headCells.condition]}
            content={[row.condition]} // TODO modify if 3 types of order records have different properties
            classes={classes}
          />
          <LabelColumn 
            labels={[headCells.init]}
            content={[row.initiator]}
            classes={classes}
          />
          <LabelColumn 
            labels={[headCells.time]}
            content={[row.time]}
            classes={classes}
          />
          <LabelColumn 
            labels={[headCells.ref]}
            content={[row.ref]}
            classes={classes}
          />
          <LabelColumn 
            labels={[headCells.ext]}
            content={[row.extOrder]}
            classes={classes}
          />
        </LabelTable>
      </Box>
    );
  }

  const getIconProps = (rows: OrderRecordRow[] | WorkingOrderRecordRow[] | OrderHistoryRecordRow[]): IconProps[][] => {
    let ips: IconProps[][] = [];
    Array.prototype.forEach.call(rows, (r: OrderRecordRow | WorkingOrderRecordRow | OrderHistoryRecordRow) => {
      let ip: IconProps[] = [];
      ip.push({ 
        title: "More Details", 
        name: "MORE_HORIZ",
        buttonStyle: { padding: 0 },
        isRowBasedCallback: true,
        onClick: setCurrentOpen 
      } as TooltipIconProps);
      if (selectedOrderType !== 'history') {
        ip.push({
          title: "Edit",
          name: "EDIT",
          buttonStyle: { padding: 0 },
          isRowBasedCallback: true,
          onClick: setCurrentEdit
        } as TooltipIconProps);
        ip.push(r.status === 'Inactive' 
          ? { title: "Activate",
              name: "ACTIVATE",
              buttonStyle: { padding: 0 },
              isRowBasedCallback: true,
              onClick: deleteOrder
            } as TooltipIconProps
          : { title: "Deactivate",
              name: "DEACTIVATE",
              buttonStyle: { padding: 0 },
              isRowBasedCallback: true,
              onClick: deleteOrder
            } as TooltipIconProps
        );
        ip.push({
          title: "Delete",
          name: "DELETE",
          buttonStyle: { padding: 0 },
          isRowBasedCallback: true,
          onClick: deleteOrder
        } as TooltipIconProps);
      }
      ip.push({
        title: "Quote",
        name: "DETAILS",
        buttonStyle: { padding: 0 },
        onClick: workingInProgess
      } as TooltipIconProps);
      ips.push(ip);
    });
    return ips;
  };

  const applyFilters = (filters?: Filter[]) => {
    setFilterCount(0);
    if (filters === undefined) { 
      return;
    }
    let o: OrderHistoryRecordRow[] = [];
    Array.prototype.forEach.call(orderHistory, (r: OrderHistoryRecordRow) => {
      setFilterCount(filterCount + 1);
      if (combineFilters(r, filters)()) {
        o.push(r);
      }
    });
    displayedOrderHistory.current = o;
  };

  const handleToggle = (event: React.MouseEvent<EventTarget>) => {
    setBackdropOpen(!backdropOpen);
  };

  const handleFilterToggle = () => {
    setFilterBackdropOpen(!filterBackdropOpen);
  }

  const handleFilterClickAway = (event: React.MouseEvent<EventTarget>) => {
    setFilterBackdropOpen(false);
  };

  const refreshFunction = useCallback(() => {
    workFunction('account', 'todays');
    workFunction('reporting', 'working');
    workFunction('reporting', 'history');
  }, []);

  useEffect(() => {
    workFunction('account', 'todays');
    workFunction('reporting', 'working');
    workFunction('reporting', 'history');
    refreshRef.current = refreshFunction;
    setRefresh(true);
    /*const work = setInterval(() => workFunction(getOperationType(selectedOrderType), selectedOrderType), 60000);*/
    return () => {
      //clearInterval(work);
    }
  }, []);

  useEffect(() => {
    Array.prototype.forEach.call(prods, (prod: string) => {
      if (setMessages) {
        setMessages([`4107,3,0,${prod},1,0`]);
      };
    });
  }, [prods]);

  useEffect(() => {
    if (refresh) {
      workFunction(getOperationType(selectedOrderType), selectedOrderType);
      if (filterCount === 0) {
        displayedOrderHistory.current = orderHistory;
      }
      if (posRefreshRef.current) {
        posRefreshRef.current();
      }
      getStoreData();
      setCurrentOpen(new Array<boolean>(1024).fill(false));
      setRefresh(false);
      return () => {};
    }
  }, [refresh]);

  useEffect(() => {
    if (reset) {
      setCurrentEdit(-1);
      setReset(false);
    }
  }, [reset]);

  return (
    <Card elevation={0} className={classes.card}>
      <CardContent>
        <StyledTableToolbar
          title={selectedOrderType === "working" 
                  ? messages[intl.locale].working_orders 
                  : selectedOrderType === "todays" 
                    ? messages[intl.locale].todays_orders 
                    : messages[intl.locale].order_history}
          >
            <TooltipIconButton
              title="Add Order"
              name="ADD"
              onClick={handleToggle}
              buttonStyle={{ padding: '0 1.5rem 0 0' }}
            />
            {currentEdit !== -1 
              ? 
                <OrderForm 
                  refresh={() => setRefresh(true)}
                  reset={() => setReset(true)}
                  open={currentEdit !== -1}
                  editContent={currentEdit !== -1 && currentEdit < orders.length ? orders[currentEdit] : undefined}
                /> 
              : <OrderForm refresh={() => setRefresh(true)} open={backdropOpen} resetToggle={() => setBackdropOpen(false)}/>
            }
            {selectedOrderType === 'history'
              ? 
                <TooltipIconButton
                  title={messages[intl.locale].filter_list}
                  name={"FILTER"}
                  buttonStyle={{ padding: '0 1.5rem 0 0' }}
                  buttonColor={filterCount === 0 ? 'white' : 'cyan'}
                  onClick={() => setFilterBackdropOpen(true)}
                />
              : <></>
            }
            {selectedOrderType === 'history'
              ?
                <FilterForm
                  applyFilters={applyFilters}
                  handleClickAway={handleFilterClickAway}
                  handleToggle={handleFilterToggle}
                  backdropOpen={filterBackdropOpen}
                />
              : <></>
            }
            {selectedOrderType !== 'working'
              ?
                <TooltipIconButton
                  title={messages[intl.locale].working_orders}
                  name="WORKING"
                  buttonStyle={{ padding: '0 1.5rem 0 0' }}
                  onClick={(event: React.MouseEvent<EventTarget>) => {
                    setSelectedOrderType('working');
                    tableRef?.current?.resetScroll();
                    setRefresh(true);
                  }}
                />
              : <></>
            }
            {selectedOrderType !== 'todays'
              ?
                <TooltipIconButton
                  title={messages[intl.locale].todays_orders}
                  name="DONE_ALL"
                  buttonStyle={{ padding: '0 1.5rem 0 0' }}
                  onClick={(event: React.MouseEvent<EventTarget>) => {
                    setSelectedOrderType("todays");
                    tableRef?.current?.resetScroll();
                    setRefresh(true);
                  }}
                />
              : <></>
            }
            {selectedOrderType !== 'history' 
              ?
                <TooltipIconButton
                  title={messages[intl.locale].order_history}
                  name="HISTORY"
                  buttonStyle={{ padding: '0 0.5rem 0 0' }} 
                  onClick={(event: React.MouseEvent<EventTarget>) => {
                    setSelectedOrderType('history');
                    tableRef?.current?.resetScroll();
                    setRefresh(true);
                  }}
                />
              : <></>
            }
          </StyledTableToolbar>
        <DataTable
          ref={tableRef}
          headLabels={Object.values(headCellsMinified)}
          data={getLabels(intl.locale)}
          addPageControl
          removeToolBar
          rowCollapsible
          openArray={currentOpen}
          icons={getIconProps(
            selectedOrderType === 'todays' 
              ? orders 
              : selectedOrderType === 'working' 
                ? workingOrders
                : displayedOrderHistory.current)}
          containerClasses={classes.container}
          collapsibleContents={
            selectedOrderType === 'history'
              ? displayedOrderHistory.current.map(h => getCollapsibleContent(h, collapsibleContentClasses))
              : selectedOrderType === 'todays'
                ? orders.map(o => getCollapsibleContent(o, collapsibleContentClasses))
                : workingOrders.map(w => getCollapsibleContent(w, collapsibleContentClasses))
          }
        />
      </CardContent>
    </Card>
  );
};

export {
  OrdersMinified
}
