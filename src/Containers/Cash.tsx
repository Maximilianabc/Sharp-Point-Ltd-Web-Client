import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getDispatchSelectCB,
  operations,
  OPConsts,
  UserState,
  BalanceRecordRow,
  getCurrencyString,
  messages
} from '../Util';
import { useHistory } from 'react-router';
import { useIntl } from 'react-intl';

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
  const [balance, setBalance] = useState<BalanceRecordRow[]>([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.BALANCE);
  const title = 'Cash';
  const wsRef = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    const workFunction = () => {
      operations('account', hooks.id, payload, undefined, hooks.action).then(data => {
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
              state: messages[intl.locale].session_expired
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
    let work = setInterval(workFunction, 5000); 
    return () => {
      clearInterval(work);
    };
  }, []);

  const zero = 0;
  const balanceToRows = (balance: any): BalanceRecordRow[] => {
    let b: BalanceRecordRow[] = [];
    if (balance) {
      Array.prototype.forEach.call(balance, bal => {
        b.push({
          ccy: bal.ccy,
          cashBf: getCurrencyString(bal.cashBf),
          unsettle: getCurrencyString(bal.notYetValue), // ?
          todayIO: getCurrencyString(bal.todayOut), //?
          withdrawReq: getCurrencyString(zero), //?
          cash: getCurrencyString(bal.cash),
          unpresented: getCurrencyString(bal.unpresented),
          fx: getCurrencyString(zero), // ?
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
    <div></div>
  );
};

export {
  Cash
}
