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
  AccSummaryRecord
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
  const [summary, setSummary] = useState<AccSummaryRecord>({});
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

  const summaryToTable = (sum: any): AccSummaryRecord => {
    let s: AccSummaryRecord = {};
    if (sum) {
      s = {
        buyingPower: '?',
        nav: `${sum.nav?.toFixed(2)} HKD`,
        commodityPL: `${sum.totalPl?.toFixed(2)} HKD`,
        currentIMargin: `${sum.iMargin?.toFixed(2)} HKD`,
        currentMMargin: `${sum.mMargin?.toFixed(2)} HKD`,
        mLevel: `${sum.mLevel?.toFixed(2)} HKD`,
        prjOvnMargin: '?',
        maxMargin: '?',
        marginCall: `${sum.marginCall?.toFixed(2)} HKD`,
        cashBalance: `${sum.cashBal?.toFixed(2)} HKD`,
        transactionAmt: '?',
        lockupAmt: '?',
        period: sum.marginPeriod,
        creditLimit: `${sum.creditLimit?.toFixed(2)} HKD`,
        avgNetOptValue: '?',
        ctrlLevel: '?',
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