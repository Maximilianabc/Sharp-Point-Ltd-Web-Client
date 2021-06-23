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
  AccBalanceRecord
} from '../Util';
import { useHistory } from 'react-router';

interface CashProps {

}

const headCells = [
  { id: 'ccy', align: 'left', label: 'Ccy' },
  { id: 'cash-bf', align: 'right', label: 'Cash Bf.' },
  { id: 'unsettled', align: 'right', label: 'Unsettle' },
  { id: 'today-in-out', align: 'right', label: 'Today In/Out' },
  { id: 'withdrawl-req', align: 'right', label: 'Withdrawal Req.' },
  { id: 'cash', align: 'right', label: 'Cash' },
  { id: 'unpresented', align: 'right', label: 'Unpresented' },
  { id: 'ref-exchange-rate', align: 'right', label: 'Ref. Fx Rate' },
  { id: 'case-base-ccy', align: 'right', label: 'Cash (Base ccy)' }
];

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const Cash = (props: CashProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [balance, setBalance] = useState<AccBalanceRecord[]>([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.BALANCE);
  const title = 'Cash';

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
            //if (wsRef && wsRef.current) {
              //wsRef!.current!.closeExplicit(false);
            //}
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
    };
    workFunction();
    let work = setInterval(workFunction, 30000); 
    return () => {
      clearInterval(work);
    };
  }, []);

  const zero = 0;
  const balanceToRows = (balance: any): AccBalanceRecord[] => {
    let b: AccBalanceRecord[] = [];
    if (balance) {
      Array.prototype.forEach.call(balance, bal => {
        b.push({
          ccy: bal.ccy,
          cashBf: bal.cashBf.toFixed(2), // TODO name?
          unsettle: bal.notYetValue.toFixed(2), // ?
          todayIO: bal.todayOut.toFixed(2), //?
          withdrawReq: zero.toFixed(2), //?
          cash: bal.cash.toFixed(2),
          unpresented: bal.unpresented.toFixed(2),
          fx: zero.toFixed(2), // ?
          cashBaseCcy: `${bal.ccy}`
        });
      });
    }
    return b;
  };

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      let balance = data.balance ? data.balance : (data.recordData ? data.recordData : undefined);
      if (balance) {
        setBalance(balanceToRows(balance));
      }
    }
  };

  return (
    <div id={title.toLowerCase()}>
      <StyledTable
          data={balance}
          title={title}
          headerCells={headCells}
      />  
    </div>   
  );
};

export {
  Cash
}
