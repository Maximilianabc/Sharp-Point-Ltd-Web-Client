import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClientWS,
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  OPConsts,
  UserState,
  ClearTradeRecord,
  reportOperations,
  store,
  getDoneTradeStatusString
} from '../Util';
import { useHistory } from 'react-router';

interface ClearTradeProps {

}

const headCells = [
  { id: 'id', align: 'left', label: 'ID', colorMode: 'ignore' },
  { id: 'name', align: 'right', label: 'Name', colorMode: 'ignore' },
  { id: 'bqty', align: 'right', label: 'BQty', colorMode: 'normal' },
  { id: 'sqty', align: 'right', label: 'SQty', colorMode: 'normal' },
  { id: 'trade-price', align: 'right', label: 'Trade Prc', colorMode: 'normal' },
  { id: 'trade-number', align: 'right', label: 'Trade No.', colorMode: 'ignore' },
  { id: 'status', align: 'right', label: 'Status', colorMode: 'ignore' },
  { id: 'initiator', align: 'right', label: 'Initiator', colorMode: 'ignore' },
  { id: 'ref', align: 'right', label: 'Ref', colorMode: 'ignore' },
  { id: 'time', align: 'right', label: 'Time', colorMode: 'ignore' },
  { id: 'order-price', align: 'right', label: 'Order Prc', colorMode: 'normal' },
  { id: 'order-number', align: 'right', label: 'Order No.', colorMode: 'ignore' },
  { id: 'external-order', align: 'right', label: 'Ext. Order', colorMode: 'ignore' },
  { id: 'log-number', align: 'right', label: 'Log No.', colorMode: 'ignore' }
];

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const ClearTrade = (props: ClearTradeProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [doneTrade, setDoneTrade] = useState<ClearTradeRecord[]>([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.DONE_TRADE);
  const title = 'ClearTrade';
  const wsRef = useRef(null);
  
  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    const workFunction = () => {
      reportOperations(hooks.id, payload, undefined, hooks.action).then(data => {
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
    let work = setInterval(workFunction, 5000); 
    return () => {
      clearInterval(work);
    };
  }, []);

  const doneTradeToRows = (doneTrade: any): ClearTradeRecord[] => {
    let b: ClearTradeRecord[] = [];
    if (doneTrade) {
      Array.prototype.forEach.call(doneTrade, done => {
        // get today's clear trade only
        if (new Date(done.tradeTimeStr).getUTCDate() === new Date().getDate())
        {
          b.push({
            id: done.prodCode,
            name: '?',
            bQty: done.buySell === 'B' ? done.tradeQty : 0,
            sQty: done.buySell === 'S' ? done.tradeQty : 0,
            tradePrice: done.tradePrice,
            tradeNumber: done.tradeNo,
            status: getDoneTradeStatusString(done.status),
            initiator: done.initiator,
            ref: '?',
            time: done.tradeTimeStr,
            orderPrice: 0,
            orderNumber: done.accOrderNo,
            extOrder: done.extOrderNo,
            logNumber: done.recNo
          });
        }       
      });
    }
    return b;
  };

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      let doneTrade = data.doneTrade ? data.doneTrade : (data.recordData ? data.recordData : undefined);
      if (doneTrade) {
        setDoneTrade(doneTradeToRows(doneTrade));
      }
    }
  };

  return (
    <div id={title.toLowerCase()}>
      <StyledTable
          data={doneTrade}
          title={title}
          headerCells={headCells}
      />  
    </div>   
  );
};

export {
  ClearTrade
}