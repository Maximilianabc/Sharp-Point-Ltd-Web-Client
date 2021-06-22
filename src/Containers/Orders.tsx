import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch,useSelector } from 'react-redux';
import {
  ClientWS,
  DefaultAppbar,
  DefaultDrawer,
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  AccOrderRecord,
  UserState
} from '../Util';

interface OrdersProps {

}

const headCells = [
  { id: 'id', align: 'left', label: 'ID' },
  { id: 'name', align: 'right', label: 'Name' },
  { id: 'prev', align: 'right', label: 'Prev.' },
  { id: 'day-long', align: 'right', label: 'Day Long' },
  { id: 'day-short', align: 'right', label: 'Day Short' },
  { id: 'net', align: 'right', label: 'Net' },
  { id: 'market-price', align: 'right', label: 'Mkt.Prc' },
  { id: 'profit-loss', align: 'right', label: 'P/L' },
  { id: 'prev-close', align: 'right', label: 'Prv Close' },
  { id: 'avg-net-opt-val', align: 'right', label: 'Av.Net Opt.Val' },
  { id: 'ref-exchange-rate', align: 'right', label: 'Ref. Fx Rate' },
  { id: 'contract', align: 'right', label: 'Contract' }
];

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const createData = () => {
  return { }
};

const Orders = (props: OrdersProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [orders, setOrders] = useState<AccOrderRecord[]>([]);
  const [sidemenuopened, setSideMenuOpened] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const hooks = getDispatchSelectCB(OPConsts.ORDER);
  const title = "Orders";
  const wsRef = useRef(null);

  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    let mounted = true;
    let work: NodeJS.Timeout;
    if (mounted) {
      work = setInterval(() => {
        AccOperations(hooks.id, payload, undefined, hooks.action).then(data => {
          if (data !== undefined) {
            dispatch(data.actionData);
            onReceivePush(data.data);
          }
        });
      }, 1000); 
    }
    return () => {
      mounted = false;
      clearInterval(work);
    }
  }, []);

  const handleDrawerOpen = () => {
    setSideMenuOpened(true);
  };
  const handleDrawerClose = () => {
    setSideMenuOpened(false);
  };

  const ordersToRows = (orders: any) => {
    let o: AccOrderRecord[] = [];
    if (orders) {
      Array.prototype.forEach.call(orders, order => {
        o.push(createData(
          
        ));
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
      <ClientWS
        onReceivePush={onReceivePush}
        operation={OPConsts.ORDER}
        ref={wsRef}
      />
      <DefaultAppbar
        title={title}
        sidemenuopened={sidemenuopened}
        handleDrawerOpen={handleDrawerOpen}
      />
      <DefaultDrawer
        sidemenuopened={sidemenuopened}
        handleDrawerClose={handleDrawerClose}
      />
      <StyledTable
        data={orders}
        title={title}
        headerCells={headCells}
      />     
    </div>
  );
};

export {
  Orders
}
