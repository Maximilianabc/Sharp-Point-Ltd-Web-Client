import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  UserState,
  AccDoneTradeRecord,
  reportOperations
} from '../Util';
import { useHistory } from 'react-router';

interface ClearTradeProps {

}

const headCells = [
  { id: 'id', align: 'left', label: 'ID' },
  { id: 'name', align: 'right', label: 'Name' },
  { id: 'bqty', align: 'right', label: 'BQty' },
  { id: 'sqty', align: 'right', label: 'SQty' },
  { id: 'trade-price', align: 'right', label: 'Trade Prc' },
  { id: 'trade-number', align: 'right', label: 'Trade No.' },
  { id: 'status', align: 'right', label: 'Status' },
  { id: 'initiator', align: 'right', label: 'Initiator' },
  { id: 'ref', align: 'right', label: 'Ref' },
  { id: 'time', align: 'right', label: 'Time' },
  { id: 'order-price', align: 'right', label: 'Order Prc' },
  { id: 'order-number', align: 'right', label: 'Order No.' },
  { id: 'external-order', align: 'right', label: 'Ext. Order' },
  { id: 'log-number', align: 'right', label: 'Log No.' }
];

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const ClearTrade = (props: ClearTradeProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [doneTrade, setDoneTrade] = useState<AccDoneTradeRecord[]>([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.DONE_TRADE);
  const title = 'ClearTrade';
  
  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    const workFunction = () => {
      reportOperations(hooks.id, payload, undefined, hooks.action).then(data => {
        try {
          console.log(data);
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
    let work = setInterval(workFunction, 30000); 
    return () => {
      clearInterval(work);
    };
  }, []);

  const doneTradeToRows = (doneTrade: any): AccDoneTradeRecord[] => {
    let b: AccDoneTradeRecord[] = [];
    if (doneTrade) {
      Array.prototype.forEach.call(doneTrade, done => {
        b.push({
          id: done.prodCode,
          name: '?',
          bQty: done.buySell === 'B' ? done.tradeQty : 0,
          sQty: done.buySell === 'S' ? done.tradeQty : 0,
          tradePrc: done.tradePrc,
          tradeNum: done.tradeNo,
          status: done.status,
          initiator: done.initiator,
          ref: '?',
          time: done.tradeTimeStr,
          orderPrc: 0,
          orderNo: done.orderNo,
          extOrder: done.extOrderNo,
          logNum: '?'
        });
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