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
  getCurrencyString,
  getPercentageString,
  getPeriodString
} from '../Util';
import { useHistory } from 'react-router';

interface ProfileProps {

}

const headCells = [
  { id: 'buying-power', align: 'left', label: 'Buying Power', colorMode: 'normal' },
  { id: 'nav', align: 'right', label: 'NAV', colorMode: 'normal' },
  { id: 'commodity-pl', align: 'right', label: 'Commodity P/L', colorMode: 'normal' },
  { id: 'current-i-margin', align: 'right', label: 'Current I. Margin', colorMode: 'normal' },
  { id: 'current-m-margin', align: 'right', label: 'Current M. Margin', colorMode: 'normal' },
  { id: 'm-level', align: 'right', label: 'M. Level', colorMode: 'normal' },
  { id: 'prj-ovn-margin', align: 'right', label: 'Prj. Ovn. Margin', colorMode: 'normal' },
  { id: 'max-margin', align: 'right', label: 'Max Margin', colorMode: 'normal' },
  { id: 'margin-call', align: 'right', label: 'Margin Call', colorMode: 'revert' },
  { id: 'cash-bal', align: 'right', label: 'Cash Balance', colorMode: 'normal' },
  { id: 'transact-amt', align: 'right', label: 'Transaction Amt.', colorMode: 'normal' },
  { id: 'lockup-amt', align: 'right', label: 'Lockup Amt.', colorMode: 'normal' },
  { id: 'period', align: 'right', label: 'Period', colorMode: 'ignore' },
  { id: 'credit-limit', align: 'right', label: 'Credit Limit', colorMode: 'normal' },
  { id: 'av-net-opt-val', align: 'right', label: 'Av. Net Opt. Value', colorMode: 'normal' },
  { id: 'ctrl-lvl', align: 'right', label: 'Ctrl Level', colorMode: 'ignore' },
  { id: 'margin-class', align: 'right', label: 'Mgn Class', colorMode: 'ignore' },
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
    let work = setInterval(workFunction, 1000); 
    return () => {
      clearInterval(work);
    };
  }, []);

  const summaryToTable = (sum: any): SummaryRecord => {
    let s: SummaryRecord = {};
    if (sum) {
      s = {
        buyingPower: getCurrencyString(sum.avFund), // ?
        nav: getCurrencyString(sum.nav),
        commodityPL:getCurrencyString(sum.totalPl),
        currentIMargin: getCurrencyString(sum.imargin), // !! api: iMargin, actual response: imargin
        currentMMargin: getCurrencyString(sum.mmargin), // !! api: mMargin, actual response: mmargin
        mLevel: getPercentageString(sum.mlevel), // !! api: mLevel, actual response: mlevel
        prjOvnMargin: '?',
        maxMargin: '?',
        marginCall: getCurrencyString(sum.marginCall),
        cashBalance: getCurrencyString(sum.cashBal),
        transactionAmt: '?',
        lockupAmt: '?',
        period: getPeriodString(sum.marginPeriod),
        creditLimit: getCurrencyString(sum.creditLimit),
        avgNetOptValue: '?',
        ctrlLevel: getControlLevelString(sum.ctrlLevel),
        marginClass: sum.marginClass //!! not present in api but in response
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