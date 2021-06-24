import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyledVerticalTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  UserState,
  SummaryRecord,
  getControlLevelString,
  getCurrencyString
} from '../Util';
import { useHistory } from 'react-router';

interface ProfileProps {

}

const headCells = [
  { id: 'buying-power', align: 'left', label: 'Buying Power' },
  { id: 'nav', align: 'right', label: 'NAV' },
  { id: 'commodity-pl', align: 'right', label: 'Commodity P/L' },
  { id: 'current-i-margin', align: 'right', label: 'Current I. Margin' },
  { id: 'current-m-margin', align: 'right', label: 'Current M. Margin' },
  { id: 'm-level', align: 'right', label: 'M. Level' },
  { id: 'prj-ovn-margin', align: 'right', label: 'Prj. Ovn. Margin' },
  { id: 'max-margin', align: 'right', label: 'Max Margin' },
  { id: 'margin-call', align: 'right', label: 'Margin Call' },
  { id: 'cash-bal', align: 'right', label: 'Cash Balance' },
  { id: 'transact-amt', align: 'right', label: 'Transaction Amt.' },
  { id: 'lockup-amt', align: 'right', label: 'Lockup Amt.' },
  { id: 'period', align: 'right', label: 'Period' },
  { id: 'credit-limit', align: 'right', label: 'Credit Limit' },
  { id: 'av-net-opt-val', align: 'right', label: 'Av. Net Opt. Value' },
  { id: 'ctrl-lvl', align: 'right', label: 'Ctrl Level'},
  { id: 'margin-class', align: 'right', label: 'Mgn Class'},
];

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const Profile = (props: ProfileProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [summary, setSummary] = useState<SummaryRecord>({});
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.SUMMARY);
  const title = 'Summary';

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

  const summaryToTable = (sum: any): SummaryRecord => {
    let s: SummaryRecord = {};
    if (sum) {
      s = {
        buyingPower: '?',
        nav: getCurrencyString(sum.nav),
        commodityPL:getCurrencyString(sum.totalPl),
        currentIMargin: getCurrencyString(sum.iMargin),
        currentMMargin: getCurrencyString(sum.mMargin),
        mLevel: getCurrencyString(sum.mLevel),
        prjOvnMargin: '?',
        maxMargin: '?',
        marginCall: getCurrencyString(sum.marginCall),
        cashBalance: getCurrencyString(sum.cashBal),
        transactionAmt: '?',
        lockupAmt: '?',
        period: sum.marginPeriod,
        creditLimit: getCurrencyString(sum.creditLimit),
        avgNetOptValue: '?',
        ctrlLevel: getControlLevelString(sum.ctrlLevel),
        marginClass: '?'
      };
    }
    return s;
  };

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      setSummary(summaryToTable(data));
    }
  };
  return (
    <div id={title.toLowerCase()}>
      <StyledVerticalTable
          data={summary}
          title={title}
          headerCells={headCells}
      />  
    </div>
  );
};

export {
  Profile
};