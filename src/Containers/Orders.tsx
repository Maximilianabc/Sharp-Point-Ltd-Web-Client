import React, {
  useState,
  useEffect,
  useRef
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
  setLabelBasePropsValue
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  OrderRecord,
  UserState,
  getOrderStatusString,
  getValidTypeString,
  CARD_CLASSES,
  CARD_BUTTON_CLASSES,
  CARD_BUTTON_HEADER_LABEL_CLASSES,
  TOOLTIP_CLASSES
} from '../Util';
import { useHistory } from 'react-router';
import { Button, Card, CardContent, Tooltip } from '@material-ui/core';
import { History } from '@material-ui/icons';

interface OrdersProps {

}

interface OrdersMinifiedProps {

}

const headCells: { [name: string]: LabelBaseProps } = {
  stockID: { id: 'id', align: 'left', label: 'ID', colorMode: 'ignored' },
  stockName: { id: 'name', align: 'right', label: 'Name', colorMode: 'ignored' },
  buyQty: { id: 'os-bqty', align: 'right', label: 'OS BQty', colorMode: 'normal' },
  sellQty: { id: 'os-sqty', align: 'right', label: 'OS SQty', colorMode: 'normal' },
  price: { id: 'price', align: 'right', label: 'Price', colorMode: 'normal' },
  valid: { id: 'valid', align: 'right', label: 'Valid', colorMode: 'ignored' },
  condition: { id: 'condition', align: 'right', label: 'Cond.', colorMode: 'ignored' },
  status: { id: 'status', align: 'right', label: 'Status', colorMode: 'ignored' },
  traded: { id: 'traded', align: 'right', label: 'Traded', colorMode: 'ignored' },
  init: { id: 'initiator', align: 'right', label: 'Initiator', colorMode: 'ignored' },
  ref: { id: 'ref', align: 'right', label: 'Ref', colorMode: 'ignored' },
  time: { id: 'time', align: 'right', label: 'Time', colorMode: 'ignored' },
  ext: { id: 'external-order', align: 'right', label: 'Ext. Order', colorMode: 'ignored' },
};

const headCellsMinified : { [name: string]: LabelBaseProps } = {
  first: {
    otherLabels: [ { id: 'buy-sell', label: 'Buy/Sell', align: 'left', colorMode: 'ignored' }, headCells.status ]
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
  const [orders, setOrders] = useState<OrderRecord[]>([]);
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
      AccOperations(hooks.id, payload, undefined, hooks.action).then(data => {
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
    let o: OrderRecord[] = [];
    if (orders) {
      Array.prototype.forEach.call(orders, order => {
        o.push({
          id: order.prodCode,
          name: '?',
          osBQty: order.buySell === 'B' ? order.qty : '',
          osSQty: order.buySell === 'S' ? order.qty : '',
          price: order.price,
          valid: getValidTypeString(order.validType),
          condition: order.condTypeStr,
          status: getOrderStatusString(order.status),
          traded: '?',
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
  card : {
    ...CARD_CLASSES,
    minWidth: '40vw',
    maxHeight: '60vh',
    right: '1%',
    top: '38%'
  },
  detailsButton: CARD_BUTTON_CLASSES,
  detailsButtonLabel: CARD_BUTTON_HEADER_LABEL_CLASSES,
  toolTip: TOOLTIP_CLASSES
}));

const OrdersMinified = (props: OrdersMinifiedProps) => {
  const classes = useStyleOrdersMinified();
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const hooks = getDispatchSelectCB(OPConsts.ORDER);

  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    const workFunction = () => {
      AccOperations(hooks.id, payload, undefined, hooks.action).then(data => {
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
    let o: OrderRecord[] = [];
    if (orders) {
      Array.prototype.forEach.call(orders, order => {
        o.push({
          id: order.prodCode,
          name: '?',
          osBQty: order.buySell === 'B' ? order.qty : '',
          osSQty: order.buySell === 'S' ? order.qty : '',
          price: order.price,
          valid: getValidTypeString(order.validType),
          condition: order.condTypeStr,
          status: getOrderStatusString(order.status),
          traded: '?',
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

  const RowsToLabels = (rows: OrderRecord[]): LabelBaseProps[][] => {
    let lbls: LabelBaseProps[][] = [];
    if (rows)
    {
      Array.prototype.forEach.call(rows, r => {
        let labelRow: LabelBaseProps[] = [];
        labelRow.push(setStackedLabelValues(headCellsMinified.first, [ r.osBQty === '' ? 'Sell' : 'Buy', r.prevClose ]));
        labelRow.push(setStackedLabelValues(headCellsMinified.stock, [ r.name, r.id ]));
        labelRow.push(setLabelBasePropsValue(headCellsMinified.price, r.price));
        lbls.push(labelRow);
      });
    }
    return lbls;
  }

  return (
    <Card elevation={0} className={classes.card}>
      <CardContent>
        <StyledTableToolbar
            title="Orders"
          >
            <Tooltip
              title="Details"
              className={classes.toolTip}
            >
              <Button
                className={classes.detailsButton}
                variant="contained"
                startIcon={<History/>}
                classes={{ label: classes.detailsButtonLabel }}
                style={{ 
                  backgroundColor: 'transparent',
                  padding: 0
                }}
                disableElevation
              >
                History
              </Button>
            </Tooltip>
          </StyledTableToolbar>
        <DataTable
          headLabels={Object.values(headCellsMinified)}
          data={RowsToLabels(orders)}
          addPageControl={false}
          icons={[
            { name: 'DETAILS', size: 30 },
            { name: 'MORE_HORIZ', size: 30 },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export {
  Orders,
  OrdersMinified
}
