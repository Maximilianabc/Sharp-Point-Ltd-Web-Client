import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch,useSelector } from 'react-redux';
import {
  ClientWS,
  DataTable,
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  UserState,
  PositionRecord,
  WHITE40,
  WHITE80,
  ROBOTO_SEMIBOLD
} from '../Util';
import { useHistory } from 'react-router';
import { Card, CardContent, Typography } from '@material-ui/core';
import { CompositeLabel, LabelBase, QtyAvgLabelProps, StackedLabel } from '../Components/Label';

interface PositionProps {

}

interface PositionMinifiedProps {

}

const headCells: { [name: string]: LabelBase } = {
  stockID: { id: 'id', align: 'left', label: 'ID', colorMode: 'ignored' },
  stockName: { id: 'name', align: 'right', label: 'Name', colorMode: 'ignored' },
  prev: { id: 'prev', align: 'right', label: 'Prev.', colorMode: 'ignored' },
  long: { id: 'day-long', align: 'right', label: 'Day Long', colorMode: 'ignored' },
  short: { id: 'day-short', align: 'right', label: 'Day Short', colorMode: 'ignored' },
  net: { id: 'net', align: 'right', label: 'Net', colorMode: 'ignored' },
  price: { id: 'market-price', align: 'right', label: 'Mkt.Prc', colorMode: 'normal' },
  pl: { id: 'profit-loss', align: 'right', label: 'P/L', colorMode: 'normal' },
  close: { id: 'prev-close', align: 'right', label: 'Prv Close', colorMode: 'normal' },
  opt: { id: 'avg-net-opt-val', align: 'right', label: 'Av.Net Opt.Val', colorMode: 'normal' },
  fx: { id: 'ref-exchange-rate', align: 'right', label: 'Ref. Fx Rate', colorMode: 'ignored' },
  contract: { id: 'contract', align: 'right', label: 'Contract', colorMode: 'ignored' }
};

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const Positions = (props: PositionProps): JSX.Element => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [positions, setPositions] = useState<PositionRecord[]>([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.POSITION);
  const title = "Positions";
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

  const positionsToRows = (positions: any): PositionRecord[] => {
    let p: PositionRecord[] = [];
    if (positions) {
      Array.prototype.forEach.call(positions, pos => {
        p.push({
          id: pos.prodCode,
          name: '', // TODO name?
          prev: `${pos.psQty}@${pos.previousAvg}`,
          dayLong: pos.longQty === 0 || pos.longAvg === 0 ? '' : `${pos.longQty}@${pos.longAvg}`,
          dayShort: pos.shortQty === 0 || pos.shortAvg === 0 ? '' :`${pos.shortQty}@${pos.shortAvg}`,
          net: `${pos.netQty}@${pos.netAvg}`,
          mkt: pos.mktPrice,
          pl: pos.profitLoss,
          prevClose: pos.closeQty, // ?
          optVal: pos.totalAmt, //?
          fx: 0,
          contract: ''}
        );
      });
    }
    return p;
  };

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      let positions = data.positions ? data.positions : (data.recordData ? data.recordData : undefined);
      if (positions) {
        setPositions(positionsToRows(positions));
      }
    }
  };

  return (
    <div id = {title.toLowerCase()} className={classes.root}>
      <StyledTable
        data={positions}
        title={title}
        headerCells={[headCells]}
      />     
    </div>
  );
};

const headCellsMinified: { [name: string]: any } = {
  stock: { labels: [headCells.stockName, headCells.stockID] },
  prev: QtyAvgLabelProps(headCells.prev),
  long: QtyAvgLabelProps(headCells.long),
  short: QtyAvgLabelProps(headCells.short),
  net: QtyAvgLabelProps(headCells.net),
  price: { labels: [headCells.price, headCells.close] },
  pl: headCells.pl
}

const useStyleMinified = makeStyles((theme) => ({
  card: {
    backgroundColor: '#282c34',
    border: `1px solid ${WHITE40}`,
    borderRadius: 0,
    maxWidth: '50vw',
    maxHeight: '50vh',
    position: 'absolute',
    left: '3%',
    top: '45%'
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
  }
}));

const PositionsMinified = (props : PositionMinifiedProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [positions, setPositions] = useState<PositionRecord[]>([]);
  const classes = useStyleMinified();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.POSITION);
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
  }, []);*/

  const positionsToRows = (positions: any): PositionRecord[] => {
    let p: PositionRecord[] = [];
    if (positions) {
      Array.prototype.forEach.call(positions, pos => {
        p.push({
          id: pos.prodCode,
          name: '', // TODO name?
          prev: `${pos.psQty}@${pos.previousAvg}`,
          dayLong: pos.longQty === 0 || pos.longAvg === 0 ? '' : `${pos.longQty}@${pos.longAvg}`,
          dayShort: pos.shortQty === 0 || pos.shortAvg === 0 ? '' :`${pos.shortQty}@${pos.shortAvg}`,
          net: `${pos.netQty}@${pos.netAvg}`,
          mkt: pos.mktPrice,
          pl: pos.profitLoss,
          prevClose: pos.closeQty, // ?
          optVal: pos.totalAmt, //?
          fx: 0,
          contract: ''}
        );
      });
    }
    return p;
  };

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      let positions = data.positions ? data.positions : (data.recordData ? data.recordData : undefined);
      if (positions) {
        setPositions(positionsToRows(positions));
      }
    }
  };

  return (
    <Card elevation={0} className={classes.card}>
      <CardContent>
        <DataTable
          headLabels={Object.values(headCells)}
          data={positions}
          title="Positions"
          addPageControl={false}
        />
      </CardContent>
    </Card>
  );
};

export {
  Positions,
  PositionsMinified
}
