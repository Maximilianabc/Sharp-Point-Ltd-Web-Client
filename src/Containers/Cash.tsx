import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClientWS,
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  UserState,
  BalanceRecord,
  getCurrencyString
} from '../Util';
import { useHistory } from 'react-router';

interface CashProps {

}

const headCells = [
  { id: 'ccy', align: 'left', label: 'Ccy', colorMode: 'ignore' },
  { id: 'cash-bf', align: 'right', label: 'Cash Bf.', colorMode: 'normal' },
  { id: 'unsettled', align: 'right', label: 'Unsettle', colorMode: 'revert' },
  { id: 'today-in-out', align: 'right', label: 'Today In/Out', colorMode: 'normal' },
  { id: 'withdrawl-req', align: 'right', label: 'Withdrawal Req.', colorMode: 'normal' },
  { id: 'cash', align: 'right', label: 'Cash', colorMode: 'normal' },
  { id: 'unpresented', align: 'right', label: 'Unpresented', colorMode: 'normal' },
  { id: 'ref-exchange-rate', align: 'right', label: 'Ref. Fx Rate', colorMode: 'ignore' },
  { id: 'case-base-ccy', align: 'right', label: 'Cash (Base ccy)', colorMode: 'ignore' }
];

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const Cash = (props: CashProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [balance, setBalance] = useState<BalanceRecord[]>([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.BALANCE);
  const title = 'Cash';
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
  const balanceToRows = (balance: any): BalanceRecord[] => {
    let b: BalanceRecord[] = [];
    if (balance) {
      Array.prototype.forEach.call(balance, bal => {
        b.push({
          ccy: bal.ccy,
          cashBf: getCurrencyString(bal.cashBf, false),
          unsettle: getCurrencyString(bal.notYetValue, false), // ?
          todayIO: getCurrencyString(bal.todayOut, false), //?
          withdrawReq: getCurrencyString(zero, false), //?
          cash: getCurrencyString(bal.cash, false),
          unpresented: getCurrencyString(bal.unpresented, false),
          fx: getCurrencyString(zero, false), // ?
          cashBaseCcy: `HKD`
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
      <ClientWS
        onReceivePush={onReceivePush}
        operation={OPConsts.BALANCE}
        ref={wsRef}
      />
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
