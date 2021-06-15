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
  opConsts
} from '../Util';

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
    width: '100%',
  }
});

const createData = () => {
  return { }
};

const Orders = (props) => {
  const token = useSelector(state => state.sessionToken);
  const accNo = useSelector(state => state.accNo);
  const [wsClose, setWSClose] = useState(false);
  const [orders, setOrders] = useState([]);
  const [sidemenuopened, setSideMenuOpened] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const hooks = getDispatchSelectCB(opConsts.ORDER);
  const title = "Orders";
  const dispatchAction = useRef(null);

  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    let mounted = true;
    let work;
    if (mounted) {
      work = setInterval(() => {
        AccOperations(hooks.id, payload, undefined, hooks.dispatch).then(data => {
          if (data !== undefined) {
            dispatchAction.current = () => dispatch(data.action);
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

  const ordersToRows = (data) => {
    let orders = data.orders ? data.orders : (data.recordData ? data.recordData : undefined);
    let o = [];
    if (orders) {
      console.log(orders);
      Array.prototype.forEach.call(orders, order => {
        o.push(createData(
          
        ));
      });
    }
    return o;
  };

  const onReceivePush = (orders) => {
    if (orders !== undefined) {
      setOrders(ordersToRows(orders));
    } else {
      console.log('undefined orders');
    }
  };

  return (
    <div className={classes.root}>
      <ClientWS onReceivePush={onReceivePush} close={wsClose}/>
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
