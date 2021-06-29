import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyledPopoverForm,
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  OrderRecord,
  UserState,
  getOrderStatusString,
  getValidTypeString
} from '../Util';
import { useHistory } from 'react-router';

interface OrdersProps {

}

const headCells = [
  { id: 'id', align: 'left', label: 'ID', colorMode: 'ignore' },
  { id: 'name', align: 'right', label: 'Name', colorMode: 'ignore' },
  { id: 'os-bqty', align: 'right', label: 'OS BQty', colorMode: 'normal' },
  { id: 'os-sqty', align: 'right', label: 'OS SQty', colorMode: 'normal' },
  { id: 'price', align: 'right', label: 'Price', colorMode: 'normal' },
  { id: 'valid', align: 'right', label: 'Valid', colorMode: 'ignore' },
  { id: 'condition', align: 'right', label: 'Cond.', colorMode: 'ignore' },
  { id: 'status', align: 'right', label: 'Status', colorMode: 'ignore' },
  { id: 'traded', align: 'right', label: 'Traded', colorMode: 'ignore' },
  { id: 'initiator', align: 'right', label: 'Initiator', colorMode: 'ignore' },
  { id: 'ref', align: 'right', label: 'Ref', colorMode: 'ignore' },
  { id: 'time', align: 'right', label: 'Time', colorMode: 'ignore' },
  { id: 'external-order', align: 'right', label: 'Ext. Order', colorMode: 'ignore' },
];

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    width: 'calc(100% - 2px)',
  },
  backdrop: {
    position: "absolute",
    zIndex: theme.zIndex.drawer + 1,
    opacity: 0.8,
    color: '#fff',
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
        headerCells={headCells}
      />
      <StyledPopoverForm id='add-order-form'/> 
    </div>
  );
};

export {
  Orders
}
