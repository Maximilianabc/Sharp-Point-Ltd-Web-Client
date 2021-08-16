import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  OrderFormWithButton,
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
  FilterDropDownMenu,
  OrderForm,
  IconProps
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
  store
} from '../Util';
import { useHistory } from 'react-router';
import { Box, Card, CardContent } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { useIntl } from 'react-intl';

interface OrdersProps {

}

interface OrdersMinifiedProps {
  setMessage?: (message: string) => void
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

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    width: 'calc(100% - 2px)',
  }
}));

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
    maxHeight: '50vh',
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
  const { setMessage } = props;
  type OrderType = "working"|"todays"|"history";
  const classes = useStyleOrdersMinified();
  const collapsibleContentClasses = useStyleCollapsibleContent();
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);

  const [orders, setOrders] = useState<OrderRecordRow[]>([]);
  const [workingOrders, setWorkingOrders] = useState<WorkingOrderRecordRow[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryRecordRow[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>("todays");
  const [currentOpen, setCurrentOpen] = useState<boolean[]>(new Array<boolean>(1024).fill(false));
  const [currentEdit, setCurrentEdit] = useState(-1);

  const [longMode, setLongMode] = useState(true);
  const [reset, setReset] = useState(false);
  const [refresh, setRefresh] = useState(false);

  let prods: string[] = [];
  let mktDataShort: { [id: string]: MarketDataShort } | undefined;
  let mktDataLong: { [id: string]: MarketDataLong } | undefined;

  const history = useHistory();
  const intl = useIntl();
  const dispatch = useDispatch();

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
    if (orders) {
      Array.prototype.forEach.call(orders, (order: AccOrderRecord) => {
        o.push({
          accOrderNo: order.accOrderNo ?? '?',
          id: order.prodCode ?? '?',
          name: longMode ? (mktDataLong?.[order?.prodCode ?? ''].productName ?? '?') : '?',
          buySell: order.buySell ?? '',
          qty: order.qty ?? '?',
          tradedQty: order.tradedQty ?? '?',
          price: order.orderPrice ?? '?',
          valid: getValidTypeString(order.validType ?? -1),
          condition: order.condTypeStr ?? '?',
          status: getOrderStatusString(order.status ?? -1),
          initiator: order.sender ?? '?', // !! not present in API
          ref: order.ref ?? '?',
          time: order.timeStampStr ?? '?',
          orderNo: order.orderNoStr ?? '?',
          extOrder: order.extOrderNo ?? '?'
        });
        if (order.prodCode && prods.findIndex(s => s === order.prodCode) === -1) {
          prods.push(order.prodCode);
        }
      });
    }
    return o;
  };

  // TODO modify
  const workingOrdersToRows = (working: any) => {
    let w: WorkingOrderRecordRow[] = [];
    if (working) {
      Array.prototype.forEach.call(working, (work: WorkingOrderRecord)=> {
        w.push({
          accOrderNo: work.accOrderNo ?? '?',
          id: work.prodCode ?? '?',
          name: longMode ? (mktDataLong?.[working?.prodCode ?? '']?.productName ?? '?') : '?',
          buySell: work.buySell ?? '',
          qty: work.qty ?? '?',
          tradedQty: work.tradedQty ?? '?',
          price: work.orderPrice ?? '?',
          valid: getValidTypeString(work.validType ?? -1),
          condition: work.condTypeStr ?? '?',
          status: getOrderStatusString(work.status ?? -1),
          traded: '?',
          initiator: work.sender ?? '?', // !! not present in API
          ref: work.ref ?? '?',
          time: work.timeStampStr ?? '?',
          orderNo: work.orderNoStr ?? '?',
          extOrder: work.extOrderNo ?? '?'
        } as WorkingOrderRecordRow);
      });
    }
    return w;
  };

  // TODO modify
  const orderHistoryToRow = (history: any) => {
    let h: OrderHistoryRecordRow[] = [];
    if (history) {
      Array.prototype.forEach.call(history, (hist: OrderHistoryRecord) => {
        h.push({
          accOrderNo: hist.accOrderNo ?? '?',
          id: hist.prodCode ?? '?',
          name: longMode ? (mktDataLong?.[hist?.prodCode ?? '']?.productName ?? '?') : '?',
          buySell: hist.buySell ?? '',
          qty: hist.qty ?? '?',
          tradedQty: hist.tradedQty ?? '?',
          price: hist.orderPrice ?? '?',
          valid: getValidTypeString(hist.validType ?? -1),
          condition: hist.condTypeStr ?? '?',
          status: getOrderStatusString(hist.status ?? -1),
          traded: '?',
          initiator: hist.sender ?? '?', // !! not present in API
          ref: hist.ref ?? '?',
          time: hist.timeStampStr ?? '?',
          orderNo: hist.orderNoStr ?? '?',
          extOrder: hist.extOrderNo ?? '?'
        } as OrderHistoryRecordRow);
      });
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
          [ r.buySell === 'S' ? messages[locale].sell : messages[locale].buy, messages[locale][r.status.toLocaleLowerCase()].toProperCase() ], 
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
          [ r.buySell === 'S' ? messages[locale].sell : messages[locale].buy, messages[locale][r.status.toLocaleLowerCase()].toProperCase() ], 
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
          [ r.buySell === 'S' ? messages[locale].sell : messages[locale].buy, messages[locale][r.status.toLocaleLowerCase()].toProperCase() ], 
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
              : orderHistoryRowsToLabels(orderHistory, locale as localeTypes);
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

  const filterOrders = (rows: OrderRecordRow[] | WorkingOrderRecordRow[] | OrderHistoryRecordRow[], predicate: (property: string) => boolean) => {

  };

  useEffect(() => {
    setRefresh(true);
    /*const work = setInterval(() => workFunction(getOperationType(selectedOrderType), selectedOrderType), 60000);*/
    return () => {
      //clearInterval(work);
    }
  }, []);

  useEffect(() => {
    Array.prototype.forEach.call(prods, (prod: string) => {
      if (setMessage) {
        setMessage(`4107,3,0,${prod},1,0`);
      };
    });
  }, [prods]);

  useEffect(() => {
    if (refresh) {
      workFunction(getOperationType(selectedOrderType), selectedOrderType);
      const userState = store.getState();
      const getStoreData = () => {
        if (longMode) {
          mktDataLong = userState.marketDataLong;
        } else {
          mktDataShort = userState.marketDataShort;
        }
      };
      getStoreData();
      setRefresh(false);
      return () => {};
    }
  }, [refresh]);

  useEffect(() => {
    if (reset) {
      setCurrentEdit(-1);
      setReset(false);
    }
  }, [reset])

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
            <OrderFormWithButton refresh={() => setRefresh(true)}/>
            {currentEdit !== -1 
              ? 
                <OrderForm 
                  refresh={() => setRefresh(true)}
                  reset={() => setReset(true)}
                  open={currentEdit !== -1}
                  editContent={orders[currentEdit]}
                /> 
              : <></>
            }
            <FilterDropDownMenu
              controlButton=
                {{
                  title: messages[intl.locale].filter_list,
                  name: "FILTER",
                  buttonStyle: { padding: '0 0.5rem 0 0' }
                } as TooltipIconProps}
              filterLabels={['name', 'price', 'time']}
              filterTypes={['string', 'number', 'date']}
            />
            {selectedOrderType !== 'working'
              ?
                <TooltipIconButton
                  title={messages[intl.locale].working_orders}
                  name="WORKING"
                  buttonStyle={{ padding: '0 0.5rem 0 0' }}
                  onClick={(event: React.MouseEvent<EventTarget>) => {
                  workFunction('reporting', 'working');
                  setSelectedOrderType('working');
                  }}
                />
              : <></>
            }
            {selectedOrderType !== 'todays'
              ?
                <TooltipIconButton
                  title={messages[intl.locale].todays_orders}
                  name="DONE_ALL"
                  buttonStyle={{ padding: '0 0.5rem 0 0' }}
                  onClick={(event: React.MouseEvent<EventTarget>) => {
                    workFunction('account', 'todays');
                    setSelectedOrderType("todays");
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
                    workFunction('reporting', 'history');
                    setSelectedOrderType('history');
                  }}
                />
              : <></>
            }
          </StyledTableToolbar>
        <DataTable
          headLabels={Object.values(headCellsMinified)}
          data={getLabels(intl.locale)}
          removeToolBar
          rowCollapsible
          openArray={currentOpen}
          icons={getIconProps(selectedOrderType === 'todays' ? orders : selectedOrderType === 'working' ? workingOrders : orderHistory)}
          containerClasses={classes.container}
          collapsibleContents={
            selectedOrderType === 'history'
              ? orderHistory.map(h => getCollapsibleContent(h, collapsibleContentClasses))
              : selectedOrderType == 'todays'
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
