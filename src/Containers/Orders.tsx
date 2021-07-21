import React, {
  useState,
  useEffect,
  useRef,
  MouseEventHandler
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyledPopoverForm,
  StyledTable,
  LabelBaseProps,
  DataTable,
  StackedLabelProps,
  StyledTableToolbar,
  setStackedLabelValues,
  setLabelBasePropsValue,
  NamedIconButton,
  IconTypes,
  setStackedLabelIcons,
  getIconTypeByStatus,
  LabelRow
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
  FLEX_ROW_CLASSES,
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
  OrderHistoryRecord
} from '../Util';
import { useHistory } from 'react-router';
import { Button, Card, CardContent, Fade, Tooltip, Typography } from '@material-ui/core';
import { History } from '@material-ui/icons';

interface OrdersProps {

}

interface OrdersMinifiedProps {

}

const headCells: { [name: string]: LabelBaseProps } = {
  stockID: { id: 'id', align: 'left', label: 'ID', colorMode: 'ignored' },
  stockName: { id: 'name', align: 'left', label: 'Name', colorMode: 'ignored' },
  buyQty: { id: 'os-bqty', align: 'right', label: 'OS BQty', colorMode: 'normal' },
  sellQty: { id: 'os-sqty', align: 'right', label: 'OS SQty', colorMode: 'normal' },
  price: { id: 'price', align: 'left', label: 'Price', colorMode: 'normal' },
  valid: { id: 'valid', align: 'right', label: 'Valid', colorMode: 'ignored' },
  condition: { id: 'condition', align: 'right', label: 'Cond.', colorMode: 'ignored' },
  status: { id: 'status', align: 'right', label: 'Status', colorMode: 'ignored'},
  traded: { id: 'traded', align: 'right', label: 'Traded', colorMode: 'ignored' },
  init: { id: 'initiator', align: 'right', label: 'Initiator', colorMode: 'ignored' },
  ref: { id: 'ref', align: 'right', label: 'Ref', colorMode: 'ignored' },
  time: { id: 'time', align: 'right', label: 'Time', colorMode: 'ignored' },
  ext: { id: 'external-order', align: 'right', label: 'Ext. Order', colorMode: 'ignored' },
};

const headCellsMinified : { [name: string]: LabelBaseProps } = {
  first: {
    otherLabels: [ 
      { id: 'buy-sell', label: 'Buy/Sell', align: 'left', colorMode: 'ignored' }, 
      headCells.status ]
  } as StackedLabelProps,
  stock: {
    classes: { root: { minWidth: '10rem' }},
    otherLabels: [headCells.stockName, headCells.stockID]
  } as StackedLabelProps,
  price: headCells.price,
  qty: {
    otherLabels: [ { id: 'qty', label: 'Qty', align: 'left', colorMode: 'ignored' }, headCells.traded ]
  } as StackedLabelProps
};

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    width: 'calc(100% - 2px)',
  }
}));

const Orders = (props: OrdersProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [orders, setOrders] = useState<OrderRecordRow[]>([]);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const hooks = getDispatchSelectCB(OPConsts.ORDER);
  const title = "Orders";
  const wsRef = useRef(null);

  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    const workFunction = () => {
      operations('reporting', hooks.id, payload, undefined, hooks.action).then(data => {
        try {
          if (data && !data.closeSocket) {
            dispatch(data.actionData);
            onReceivePush(data.data);
          } else {
            history.push({
              pathname: '/logout',
              state: 'Session expired. Please login again.'
            });
            clearInterval(work);
          }
        } catch (error) {
          console.error(error);
          clearInterval(work);
        }
      });
    }
    workFunction();
    let work = setInterval(workFunction, 1000); 
    return () => {
      clearInterval(work);
    }
  }, []);

  const ordersToRows = (orders: any) => {
    let o: OrderRecordRow[] = [];
    if (orders) {
      Array.prototype.forEach.call(orders, order => {
        o.push({
          id: order.prodCode,
          name: '?',
          buySell: order.buySell,
          qty: order.qty,
          tradedQty: order.tradedQty,
          price: order.price,
          valid: getValidTypeString(order.validType),
          condition: order.condTypeStr,
          status: getOrderStatusString(order.status),
          initiator: order.sender, // !! not present in API
          ref: order.ref,
          time: order.timeStampStr,
          extOrder: order.extOrderNo
        });
      });
    }
    return o;
  };

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      let orders = data.orders ? data.orders : (data.recordData ? data.recordData : undefined);
      if (orders) {
        setOrders(ordersToRows(orders));
      }
    }
  };

  return (
    <div className={classes.root}>
      <StyledTable
        data={orders}
        title={title}
        headerCells={Object.values(headCells)}
      />
      <StyledPopoverForm id='add-order-form'/> 
    </div>
  );
};

const useStyleOrdersMinified = makeStyles((theme) => ({
  card: {
    ...CARD_CLASSES,
    minWidth: '40vw',
    maxHeight: '60vh',
    right: '1%',
    top: '38%'
  },
  buy: {
    color: ''
  },
  sell: {

  },
  detailsButton: CARD_BUTTON_CLASSES,
  detailsButtonLabel: CARD_BUTTON_HEADER_LABEL_CLASSES,
  toolTip: TOOLTIP_CLASSES,
  toolTipText: TOOLTIP_TEXT_CLASSES
}));

const OrdersMinified = (props: OrdersMinifiedProps) => {
  type OrderType = "working"|"todays"|"history";
  const classes = useStyleOrdersMinified();
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [orders, setOrders] = useState<OrderRecordRow[]>([]);
  const [workingOrders, setWorkingOrders] = useState<WorkingOrderRecordRow[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryRecordRow[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>("todays");
  const history = useHistory();
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

  const workFunction = (opType: OPType, orderType: OrderType) => {
    let hooks = getStoreCallback(orderType);
    operations(opType, hooks.id, payload, undefined, hooks.action).then(data => {
      try {
        if (data && !data.closeSocket) {
          dispatch(data.actionData);
          onReceivePush(data.data);
        } else {
          history.push({
            pathname: '/logout',
            state: 'Session expired. Please login again.'
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    workFunction(getOperationType(selectedOrderType), selectedOrderType);
    const work = setInterval(() => workFunction(getOperationType(selectedOrderType), selectedOrderType), 60000);
    return () => {
      clearInterval(work);
    }
  }, []);
  
  const ordersToRows = (orders: any) => {
    let o: OrderRecordRow[] = [];
    if (orders) {
      Array.prototype.forEach.call(orders, (order: AccOrderRecord)=> {
        o.push({
          id: order.prodCode ?? '?',
          name: '?',
          buySell: order.buySell ?? '',
          qty: order.totalQty ?? '?',
          tradedQty: order.tradedQty ?? '?',
          price: order.orderPrice ?? '?',
          valid: getValidTypeString(order.validType ?? -1),
          condition: order.condTypeStr ?? '?',
          status: getOrderStatusString(order.status ?? -1),
          initiator: order.sender ?? '?', // !! not present in API
          ref: order.ref ?? '?',
          time: order.timeStampStr ?? '?',
          extOrder: order.extOrderNo ?? '?'
        });
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
          id: work.prodCode ?? '?',
          name: '?',
          buySell: work.buySell ?? '',
          qty: work.totalQty ?? '?',
          tradedQty: work.tradedQty ?? '?',
          price: work.orderPrice ?? '?',
          valid: getValidTypeString(work.validType ?? -1),
          condition: work.condTypeStr ?? '?',
          status: getOrderStatusString(work.status ?? -1),
          traded: '?',
          initiator: work.sender ?? '?', // !! not present in API
          ref: work.ref ?? '?',
          time: work.timeStampStr ?? '?',
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
          id: hist.prodCode ?? '?',
          name: '?',
          buySell: hist.buySell ?? '',
          qty: hist.totalQty ?? '?',
          tradedQty: hist.tradedQty ?? '?',
          price: hist.orderPrice ?? '?',
          valid: getValidTypeString(hist.validType ?? -1),
          condition: hist.condTypeStr ?? '?',
          status: getOrderStatusString(hist.status ?? -1),
          traded: '?',
          initiator: hist.sender ?? '?', // !! not present in API
          ref: hist.ref ?? '?',
          time: hist.timeStampStr ?? '?',
          extOrder: hist.extOrderNo ?? '?'
        } as OrderHistoryRecordRow);
      });
    }
    return h;
  };

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      let orders = data.orders ? data.orders : (data.recordData ? data.recordData : undefined);
      if (orders) {
        switch (selectedOrderType)
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

  const RowsToLabels = (rows: OrderRecordRow[]): LabelBaseProps[][] => {
    let lbls: LabelBaseProps[][] = [];
    if (rows)
    {
      Array.prototype.forEach.call(rows, (r: OrderRecordRow) => {
        let labelRow: LabelBaseProps[] = [];
        labelRow.push(setStackedLabelIcons(
          setStackedLabelValues(headCellsMinified.first, [ r.buySell === 'S' ? 'Sell' : 'Buy', r.status.toProperCase() ]), 
          [ undefined, { name: getIconTypeByStatus(r.status.toProperCase() as OrderStatus), size: 20, buttonStyle: { padding: 0 }} ]));
        labelRow.push(setStackedLabelValues(headCellsMinified.stock, [ r.name, r.id ]));
        labelRow.push(setLabelBasePropsValue(headCellsMinified.price, r.price?.toString()));
        labelRow.push(setStackedLabelValues(headCellsMinified.qty, [ r.qty?.toString(), r.tradedQty.toString() ]))
        lbls.push(labelRow);
      });
    }
    return lbls;
  }

  return (
    <Card elevation={0} className={classes.card}>
      <CardContent>
        <StyledTableToolbar
            title={selectedOrderType === "working" ? "Working Orders" : selectedOrderType === "todays" ? "Today's Orders" : "Order History"}
          >
            <Tooltip
              className={classes.toolTip}
              title={
                <React.Fragment>
                  <Typography className={classes.toolTipText}>Filter</Typography>
                </React.Fragment>
              }
              TransitionComponent={Fade}
            >
              <div>
                <NamedIconButton name="FILTER" buttonStyle={{ padding: '0 0.5rem 0 0' }} onClick={workingInProgess}/>
              </div>
            </Tooltip>
            {selectedOrderType !== 'working'
              ?
                <Tooltip
                  className={classes.toolTip}
                  title={
                    <React.Fragment>
                      <Typography className={classes.toolTipText}>Working Orders</Typography>
                    </React.Fragment>
                  }
                  TransitionComponent={Fade}
                >
                  <div>
                    <NamedIconButton
                      name="WORKING"
                      buttonStyle={{ padding: '0 0.5rem 0 0' }}
                      onClick={(event: React.MouseEvent<EventTarget>) => {
                        workFunction('reporting', 'working');
                        setSelectedOrderType('working');
                      }}
                    />
                  </div>
                </Tooltip>
              : <div />
            }
            {selectedOrderType !== 'todays'
              ?
                <Tooltip
                  className={classes.toolTip}
                  title={
                    <React.Fragment>
                      <Typography className={classes.toolTipText}>Today's Orders</Typography>
                    </React.Fragment>
                  }
                  TransitionComponent={Fade}
                >
                  <div>
                    <NamedIconButton
                      name="DONE_ALL"
                      buttonStyle={{ padding: '0 0.5rem 0 0' }}
                      onClick={(event: React.MouseEvent<EventTarget>) => {
                        workFunction('account', 'todays');
                        setSelectedOrderType("todays");
                      }}
                    />
                  </div>
                </Tooltip>
              : <div />
            }
            {selectedOrderType !== 'history' 
              ?
                <Tooltip
                  className={classes.toolTip}
                  title={
                    <React.Fragment>
                      <Typography className={classes.toolTipText}>Order History</Typography>
                    </React.Fragment>
                  }
                  TransitionComponent={Fade}
                >
                  <div>
                    <NamedIconButton
                      name="HISTORY"
                      buttonStyle={{ padding: '0 0.5rem 0 0' }} 
                      onClick={(event: React.MouseEvent<EventTarget>) => {
                        workFunction('reporting', 'history');
                        setSelectedOrderType('history');
                      }}
                    />
                  </div>
                </Tooltip>
              : <div />
            }
          </StyledTableToolbar>
        <DataTable
          headLabels={Object.values(headCellsMinified)}
          data={RowsToLabels(orders)}
          addPageControl={false}
          removeToolBar={true}
        >
          <NamedIconButton name="MORE_HORIZ" buttonStyle={{ padding: 0 }}/>
          {selectedOrderType === 'working' ? <NamedIconButton name="EDIT" buttonStyle={{ padding: 0 }}/> : <></>}
          {selectedOrderType === 'working' ? <NamedIconButton name="DEACTIVATE" buttonStyle={{ padding: 0 }}/> : <></>}
          {selectedOrderType === 'working' ? <NamedIconButton name="DELETE" buttonStyle={{ padding: 0 }}/> : <></>}
          <NamedIconButton name="DETAILS" buttonStyle={{ padding: 0 }}/>
        </DataTable>
      </CardContent>
    </Card>
  );
};

export {
  Orders,
  OrdersMinified
}
