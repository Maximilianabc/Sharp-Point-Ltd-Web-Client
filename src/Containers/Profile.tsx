import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  CardActionButton,
  LabelColumn,
  LabelRow,
  LabelTable,
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
  getPeriodString,
  ROBOTO_REGULAR,
  ROBOTO_SEMILIGHT,
  ROBOTO_LIGHT,
  WHITE40,
  WHITE60,
  WHITE80,
  WHITE90,
  ROBOTO_SEMIBOLD
} from '../Util';
import { useHistory } from 'react-router';
import { Button, ButtonBase, Card, CardActionArea, CardContent, FormControlLabel, FormLabel, IconButton, Typography } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { LabelBase } from '../Components/Label';

interface ProfileProps {

}

interface ProfileMinifiedProps {

}

const headCells: { [name: string]: LabelBase } = {
  buyPower: { id: 'buying-power', align: 'left', label: 'Buying Power', colorMode: 'normal' },
  nav: { id: 'nav', align: 'right', label: 'NAV', colorMode: 'normal' },
  commodityPL: { id: 'commodity-pl', align: 'right', label: 'Commodity P/L', colorMode: 'normal' },
  currentI: { id: 'current-i-margin', align: 'right', label: 'Current I.', colorMode: 'normal' },
  currentM: { id: 'current-m-margin', align: 'right', label: 'Current M.', colorMode: 'normal' },
  mLevel: { id: 'm-level', align: 'right', label: 'Level', colorMode: 'normal' },
  projOvn: { id: 'prj-ovn-margin', align: 'right', label: 'Projected Overnight.', colorMode: 'normal' },
  maxMargin: { id: 'max-margin', align: 'right', label: 'Maximum', colorMode: 'normal' },
  mCall: { id: 'margin-call', align: 'right', label: 'Call', colorMode: 'reverse' },
  cashBal: { id: 'cash-bal', align: 'right', label: 'Cash Balance', colorMode: 'normal' },
  tranAmt: { id: 'transact-amt', align: 'right', label: 'Transaction Amt.', colorMode: 'normal' },
  lockAmt: { id: 'lockup-amt', align: 'right', label: 'Lockup Amt.', colorMode: 'normal' },
  period: { id: 'period', align: 'right', label: 'Period', colorMode: 'ignored' },
  credit: { id: 'credit-limit', align: 'right', label: 'Credit Limit', colorMode: 'normal' },
  optVal: { id: 'av-net-opt-val', align: 'right', label: 'Av. Net Opt. Value', colorMode: 'normal' },
  ctrl: { id: 'ctrl-lvl', align: 'right', label: 'Ctrl Level', colorMode: 'ignored' },
  class: { id: 'margin-class', align: 'right', label: 'Class', colorMode: 'ignored' },
};

const plHeadCells = {
  total: { id: 'total-pl', align: 'right', label: 'P/L', colorMode: 'normal' },
  today: { id: 'today-pl', align: 'right', label: 'Today\'s P/L', colorMode: 'normal' }
}

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
        headerCells={[headCells]}
      />  
    </div>
  );
};

const useStyleMinified = makeStyles((theme) => ({
  card: {
    backgroundColor: '#282c34',
    border: `1px solid ${WHITE40}`,
    borderRadius: 0,
    minWidth: '55vw',
    minHeight: '25vh',
    position: 'absolute',
    right: '3%',
    top: '10%'
  },
  title: {
    textAlign: 'left',
    fontSize: '1.75rem',
    fontWeight: ROBOTO_SEMIBOLD,
    color: WHITE80,
    marginLeft: '1rem',
    marginBottom: '1.75rem'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative'
  },
  plContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '20%',
    right: '3%',
    textAlign: 'right'
  },
  detailsButton: {
    backgroundColor: 'transparent',
    color: WHITE90,
    position: 'absolute',
    top: '3%',
    right: '3%'
  },
  detailsButtonLabel: {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: ROBOTO_SEMILIGHT,
    textTransform: 'none'
  }
}));

const useStyleFirstColumn = makeStyles((theme) => ({
  column: {
    borderRight: `1px solid ${WHITE40}`,
    minWidth: '25%',
    maxHeight: '80%',
    fontSize: '1.25rem',
    marginLeft: '1rem'
  },
  label: {
    fontSize: 'inherit',
    fontWeight: ROBOTO_SEMILIGHT,
    color: WHITE60,
    margin: '0.375rem 0 0.375rem 0'
  },  
  content: {
    fontSize: 'inherit',
    fontWeight: ROBOTO_REGULAR,
    color: WHITE80,
    margin: '0.375rem 0 0.375rem 0'
  },
  positive: {
    color: 'rgba(0, 255, 0, 1)'
  },
  negative: {
    color: 'rgba(255, 40, 0, 1)',
    fontWeight: ROBOTO_SEMIBOLD
  }
}));

const useStyleMarginTable = makeStyles((theme) => ({
  title: {
    color: WHITE80,
    fontSize: '1.25rem',
    fontWeight: ROBOTO_SEMILIGHT,
    marginLeft: '1rem'
  },
  container: {
    position: 'absolute',
    top: '10%',
    left: '33%',
    minWidth: '75%',
    textAlign: 'left'
  }
}));

const useStyleMarginContent = makeStyles((theme) => ({
  column: {
    marginLeft: '1rem'
  },
  label: {
    fontSize: '1rem',
    fontWeight: ROBOTO_SEMILIGHT,
    color: WHITE60,
    margin: '0.375rem 0 0.375rem 0'
  },  
  content: {
    fontSize: '1.125rem',
    fontWeight: ROBOTO_REGULAR,
    color: WHITE80,
    margin: '0.375rem 0 0.375rem 0'
  }
}));

const useStylePLContent = makeStyles((theme) => ({
  row: {
    marginBottom: '0.25rem'
  },
  label: {
    fontSize: '1.5rem',
    fontWeight: ROBOTO_SEMILIGHT,
    color: WHITE60,
    margin: '0 0.375rem 0 0.375rem'
  },
  content: {
    fontSize: '1.5rem',
    fontWeight: ROBOTO_REGULAR,
    color: WHITE80,
    margin: '0 0.375rem 0 0.375rem'
  },
  positive: {
    color: 'rgba(0, 255, 0, 1)'
  },
  negative: {
    color: 'rgba(255, 40, 0, 1)',
    fontWeight: ROBOTO_SEMIBOLD
  }
}));

const ProfileMinified = (props: ProfileMinifiedProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [summary, setSummary] = useState<SummaryRecord>({});
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.SUMMARY);

  const classes = useStyleMinified();
  const firstColumnClasses = useStyleFirstColumn();
  const marginTableClasses = useStyleMarginTable();
  const marginColumnClasses = useStyleMarginContent();
  const plTableContentClasses = useStylePLContent();
  /*
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
  */
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
    <Card elevation={0} className={classes.card}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          Summary
        </Typography>
        <div className={classes.container}>
          <LabelColumn
            labels={[headCells.nav, headCells.buyPower, headCells.cashBal]}
            content={[summary.nav, summary.buyingPower, summary.cashBalance]}
            classes={firstColumnClasses}
          />
          <LabelTable title="Margin" classes={marginTableClasses}>
            <LabelColumn 
              labels={[headCells.currentI, headCells.mLevel]}
              content={[summary.currentIMargin, summary.mLevel]}
              classes={marginColumnClasses}
            />
            <LabelColumn
              labels={[headCells.currentM, headCells.maxMargin]}
              content={[summary.currentMMargin, summary.maxMargin]}
              classes={marginColumnClasses}
            />
            <LabelColumn 
              labels={[headCells.projOvn, headCells.class]}
              content={[summary.prjOvnMargin, summary.marginClass]}
              classes={marginColumnClasses}
            />
          </LabelTable>
        </div>
        <div className={classes.plContainer}>
          <LabelRow
            labels={[plHeadCells.total]}
            content={[summary.commodityPL]}
            classes={plTableContentClasses}
          />
          <LabelRow
            labels={[plHeadCells.today]}
            content={['?']}
            classes={plTableContentClasses}
          />
        </div>
      </CardContent>
      <Button
        className={classes.detailsButton}
        variant="contained"
        endIcon={<MoreVert/>}
        classes={{ label: classes.detailsButtonLabel }}
        style={{ backgroundColor: 'transparent' }}
        disableElevation
      >
        Details
      </Button>
    </Card>
  );
};

export {
  Profile,
  ProfileMinified
};