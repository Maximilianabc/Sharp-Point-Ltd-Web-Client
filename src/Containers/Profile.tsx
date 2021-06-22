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
  AccSummaryRecord,
  AccInfoRecord
} from '../Util';
import { useHistory } from 'react-router';

interface ProfileProps {

}

const headCells = [
  { id: 'items', align: 'left', label: 'Items' },
  { id: 'values', align: 'right', label: 'Values' },
];

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const Profile = (props: ProfileProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [summary, setSummary] = useState<AccInfoRecord[]>([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.BALANCE);
  const title = 'Summary';

  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    let work = setInterval(() => {
      AccOperations(hooks.id, payload, undefined, hooks.action).then(data => {
        try {
          console.log(data);
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
    }, 30000); 
    return () => {
      clearInterval(work);
    };
  }, []);

  const summaryToRows = (summary: any): AccInfoRecord[] => {
    let s: AccInfoRecord[] = [];
    if (summary) {
      Array.prototype.forEach.call(summary, sum => {
        s.push({
          buyingPower: '?',
          nav: sum.nav,
          commodityPL: sum.totalPL,
          currentIMargin: sum.iMargin,
          currentMMargin: sum.mMargin,
          mLevel: sum.mLevel,
          prjOvnMargin: '?',
          maxMargin: '?',
          marginCall: sum.marginCall,
          cashBalance: sum.cashBalance,
          transactionAmt: '?',
          lockupAmt: '?',
          period: sum.marginPeriod,
          creditLimit: sum.creditLimit,
          avgNetOptValue: '?'
        });
      });
    }
    return s;
  };

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      let summary = data.summary ? data.summary : (data.recordData ? data.recordData : undefined);
      if (summary) {
        setSummary(summaryToRows(summary));
      }
    }
  };
  return (
    <div id={title.toLowerCase()}>
      <StyledTable
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