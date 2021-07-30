import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  LabelColumn,
  LabelRow,
  LabelTable,
  StyledTableToolbar
} from '../Components';
import { 
  getDispatchSelectCB,
  OPConsts,
  UserState,
  SummaryRecordRow,
  getControlLevelString,
  getCurrencyString,
  getPercentageString,
  getPeriodString,
  ROBOTO_REGULAR,
  ROBOTO_SEMILIGHT,
  WHITE40,
  WHITE60,
  WHITE80,
  CARD_CONTENT_CLASSES,
  TOOLTIP_CLASSES,
  CARD_BUTTON_HEADER_LABEL_CLASSES,
  CARD_BUTTON_CLASSES,
  ROW_CONTAINER_CLASSES,
  CARD_CLASSES,
  CARD_TITLE_CLASSES,
  LABEL_CLASSES,
  HEADER_LABEL_CLASSES,
  messages,
  operations
} from '../Util';
import { useHistory } from 'react-router';
import {
  Button,
  Card,
  CardContent,
  Table,
  Tooltip
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { LabelBaseProps } from '../Components/Label';
import { useIntl } from 'react-intl';

interface ProfileProps {

}

interface ProfileMinifiedProps {

}

const headCells: { [name: string]: LabelBaseProps } = {
  buyPower: { id: 'buying-power', align: 'left', label: 'buying_power', colorMode: 'normal' },
  nav: { id: 'nav', align: 'right', label: 'nav', colorMode: 'normal' },
  commodityPL: { id: 'commodity-pl', align: 'right', label: 'commodity_pl', colorMode: 'normal' },
  currentI: { id: 'current-i-margin', align: 'right', label: 'margin_current_i', colorMode: 'normal' },
  currentM: { id: 'current-m-margin', align: 'right', label: 'margin_current_m', colorMode: 'normal' },
  mLevel: { id: 'm-level', align: 'right', label: 'margin_level', colorMode: 'normal' },
  projOvn: { id: 'prj-ovn-margin', align: 'right', label: 'margin_project_overnight', colorMode: 'normal' },
  maxMargin: { id: 'max-margin', align: 'right', label: 'margin_maximum', colorMode: 'normal' },
  mCall: { id: 'margin-call', align: 'right', label: 'margin_call', colorMode: 'reverse' },
  cashBal: { id: 'cash-bal', align: 'right', label: 'cash_balance', colorMode: 'normal' },
  tranAmt: { id: 'transact-amt', align: 'right', label: 'transaction_amount', colorMode: 'normal' },
  lockAmt: { id: 'lockup-amt', align: 'right', label: 'lockup_amount', colorMode: 'normal' },
  period: { id: 'period', align: 'right', label: 'period', colorMode: 'ignored' },
  credit: { id: 'credit-limit', align: 'right', label: 'credit_limit', colorMode: 'normal' },
  optVal: { id: 'av-net-opt-val', align: 'right', label: 'average_net_option_value', colorMode: 'normal' },
  ctrl: { id: 'ctrl-lvl', align: 'right', label: 'ctrl_level', colorMode: 'ignored' },
  class: { id: 'margin-class', align: 'right', label: 'margin_class', colorMode: 'ignored' },
};

const plHeadCells: { [name: string]: LabelBaseProps } =  {
  total: { id: 'total-pl', align: 'right', label: 'pl', colorMode: 'normal' },
  today: { id: 'today-pl', align: 'right', label: 'todays_pl', colorMode: 'normal' }
}

const useStyleMinified = makeStyles((theme) => ({
  card: {
    ...CARD_CLASSES,
    minWidth: '55vw',
    minHeight: '25vh',
    right: '1%',
    top: '10%'
  },
  content: CARD_CONTENT_CLASSES,
  title: CARD_TITLE_CLASSES,
  container: ROW_CONTAINER_CLASSES,
  plContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '20%',
    right: 0,
    textAlign: 'right'
  },
  detailsButton: CARD_BUTTON_CLASSES,
  detailsButtonLabel: CARD_BUTTON_HEADER_LABEL_CLASSES,
  toolTip: TOOLTIP_CLASSES
}));

const useStyleFirstColumn = makeStyles((theme) => ({
  column: {
    borderRight: `1px solid ${WHITE40}`,
    minWidth: '25%',
    maxHeight: '80%',
    fontSize: '1.25rem'
  },
  label: {
    fontSize: 'inherit',
    fontWeight: ROBOTO_SEMILIGHT,
    color: WHITE60,
    margin: '0.25rem 0 0.25rem 0'
  },  
  content: {
    fontSize: 'inherit',
    fontWeight: ROBOTO_REGULAR,
    color: WHITE80,
    margin: '0.25rem 0 0.25rem 0'
  }
}));

const useStyleMarginTable = makeStyles((theme) => ({
  title: {
    color: WHITE80,
    fontSize: '1.25rem',
    fontWeight: ROBOTO_SEMILIGHT
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

  },
  label: {
    ...HEADER_LABEL_CLASSES,
    color: WHITE60,
    fontSize: '1rem',
    margin: '0.25rem 0 0.25rem 0'
  },  
  content: {
    ...LABEL_CLASSES,
    color: WHITE80,
    fontSize: '1.125rem',
    margin: '0.25rem 0 0.25rem 0'
  }
}));

const useStylePLContent = makeStyles((theme) => ({
  row: {
    marginBottom: '0.25rem',
  },
  label: {
    ...HEADER_LABEL_CLASSES,
    color: WHITE60,
    fontSize: '1.25rem',
    margin: '0 0.375rem 0 0.375rem'
  },
  contentSpacing: {
    fontSize: '1.25rem',
    marginRight: '0.375rem',
    marginLeft: 'auto',
    right: 0
  }
}));

const ProfileMinified = (props: ProfileMinifiedProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [summary, setSummary] = useState<SummaryRecordRow>({});
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.SUMMARY);
  const intl = useIntl();

  const classes = useStyleMinified();
  const firstColumnClasses = useStyleFirstColumn();
  const marginTableClasses = useStyleMarginTable();
  const marginColumnClasses = useStyleMarginContent();
  const plTableContentClasses = useStylePLContent();
  
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
    let work = setInterval(workFunction, 120000); 
    return () => {
      clearInterval(work);
    };
  }, []);
  
  const summaryToTable = (sum: any): SummaryRecordRow => {
    let s: SummaryRecordRow = {};
    if (sum) {
      s = {
        buyingPower: getCurrencyString(sum.netEquity), // ?
        nav: getCurrencyString(sum.nav),
        commodityPL:getCurrencyString(sum.totalPl),
        currentIMargin: getCurrencyString(sum.imargin), // !! api: iMargin, actual response: imargin
        currentMMargin: getCurrencyString(sum.mmargin), // !! api: mMargin, actual response: mmargin
        mLevel: sum.mlevel === Number.MAX_VALUE ? 'Unlimited' : getPercentageString(sum.mlevel), // !! api: mLevel, actual response: mlevel
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
      <CardContent className={classes.content}>
        <StyledTableToolbar
          title={messages[intl.locale].summary}
        >
          <Tooltip
            title={messages[intl.locale].details}
            className={classes.toolTip}
          >
            <Button
              className={classes.detailsButton}
              variant="contained"
              endIcon={<MoreVert/>}
              classes={{ label: classes.detailsButtonLabel }}
              style={{ 
                backgroundColor: 'transparent',
                padding: 0
              }}
              disableElevation
            >
              {messages[intl.locale].details}
            </Button>
          </Tooltip>
        </StyledTableToolbar>
        <div className={classes.container}>
          <LabelColumn
            labels={[headCells.nav, headCells.buyPower, headCells.cashBal]}
            content={[summary.nav, summary.buyingPower, summary.cashBalance]}
            classes={firstColumnClasses}
          />
          <LabelTable title={messages[intl.locale].margin} classes={marginTableClasses}>
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
    </Card>
  );
};

export {
  ProfileMinified
};