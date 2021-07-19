import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch,useSelector } from 'react-redux';
import {
  ClientWS,
  DataTable,
  IconProps,
  IconTypes,
  NamedIconButton,
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
  ROBOTO_SEMIBOLD,
  ROW_CONTAINER_CLASSES,
  CARD_CLASSES
} from '../Util';
import { useHistory } from 'react-router';
import { Card, CardContent, Typography } from '@material-ui/core';
import {
  CompositeLabelProps,
  LabelBaseProps,
  LableBasesToStackedLabel,
  QtyAvgLabelProps,
  setLabelBasePropsValue,
  setLabelBasePropsValues,
  setStackedLabelValues,
  StackedLabelProps
} from '../Components/Label';

interface PositionProps {

}

interface PositionMinifiedProps {

}

const headCells: { [name: string]: LabelBaseProps } = {
  stockID: { id: 'id', align: 'left', label: 'ID', colorMode: 'ignored' },
  stockName: { id: 'name', align: 'right', label: 'Name', colorMode: 'ignored' },
  prev: { id: 'prev', align: 'right', label: 'Prev', colorMode: 'ignored' },
  long: { id: 'day-long', align: 'right', label: 'Long', colorMode: 'ignored' },
  short: { id: 'day-short', align: 'right', label: 'Short', colorMode: 'ignored' },
  net: { id: 'net', align: 'right', label: 'Net', colorMode: 'ignored' },
  price: { id: 'market-price', align: 'right', label: 'Price', colorMode: 'normal' },
  pl: { id: 'profit-loss', align: 'left', label: 'P/L', colorMode: 'normal' },
  close: { id: 'prev-close', align: 'right', label: '(Prev)', colorMode: 'normal' },
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

const headCellsMinified: { [name: string]: LabelBaseProps } = {
  stock: {
    classes: { root: { minWidth: '10rem' }},
    otherLabels: [headCells.stockName, headCells.stockID]
  } as StackedLabelProps,
  prev: QtyAvgLabelProps(headCells.prev),
  long: QtyAvgLabelProps(headCells.long),
  short: QtyAvgLabelProps(headCells.short),
  net: QtyAvgLabelProps(headCells.net),
  price: { otherLabels: [headCells.price, headCells.close] } as StackedLabelProps,
  pl: headCells.pl
}

const useStyleMinified = makeStyles((theme) => ({
  card: {
    ...CARD_CLASSES,
    minWidth: '55vw',
    maxHeight: '60vh',
    left: '1%',
    top: '38%'
  },
  container: ROW_CONTAINER_CLASSES
}));

const PositionsMinified = (props : PositionMinifiedProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [positions, setPositions] = useState<PositionRecord[]>([]);
  const classes = useStyleMinified();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.POSITION);
  
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
    let work = setInterval(workFunction, 60000); 
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
          name: '?',
          prev: `${pos.psQty}@${pos.previousAvg}`,
          dayLong: pos.longQty === 0 || pos.longAvg === 0 ? '' : `${pos.longQty}@${pos.longAvg}`,
          dayShort: pos.shortQty === 0 || pos.shortAvg === 0 ? '' :`${pos.shortQty}@${pos.shortAvg}`,
          net: `${pos.netQty}@${pos.netAvg}`,
          mkt: pos.mktPrice,
          pl: pos.profitLoss,
          prevClose: '?',
          optVal: pos.totalAmt, //?
          fx: 0,
          contract: ''}
        );
      });
    }
    return p;
  };
  
  const RowsToLabels = (rows: PositionRecord[]): LabelBaseProps[][] => {
    let l: LabelBaseProps[][] = [];
    if (rows)
    {
      Array.prototype.forEach.call(rows, r => {
        let labelRow: LabelBaseProps[] = [];
        labelRow.push(setStackedLabelValues(headCellsMinified.stock, [ r.name, r.id ]));

        const prevLblStack = (headCellsMinified.prev as CompositeLabelProps).subLabels;
        if (prevLblStack === undefined) {
          labelRow.push(setLabelBasePropsValue(headCellsMinified.prev, '?'));
        } else {
          labelRow.push(LableBasesToStackedLabel(setLabelBasePropsValues(prevLblStack, [ r.prev.split('@')[1] ?? '', r.prev.split('@')[0] ?? '' ])));
        }
        const dayLongLblStack = (headCellsMinified.long as CompositeLabelProps).subLabels;
        if (dayLongLblStack === undefined) {
          labelRow.push(setLabelBasePropsValue(headCellsMinified.long, '?'));
        } else {
          labelRow.push(LableBasesToStackedLabel(setLabelBasePropsValues(dayLongLblStack, [ r.dayLong.split('@')[1] ?? '', r.dayLong.split('@')[0] ?? '' ])));
        }
        const dayShortLblStack = (headCellsMinified.short as CompositeLabelProps).subLabels;
        if (dayShortLblStack === undefined) {
          labelRow.push(setLabelBasePropsValue(headCellsMinified.short, '?'));
        } else {
          labelRow.push(LableBasesToStackedLabel(setLabelBasePropsValues(dayShortLblStack, [ r.dayShort.split('@')[1] ?? '', r.dayShort.split('@')[0] ?? '' ])));
        }
        const netLblStack = (headCellsMinified.net as CompositeLabelProps).subLabels;
        if (netLblStack === undefined) {
          labelRow.push(setLabelBasePropsValue(headCellsMinified.net, '?'));
        } else {
          labelRow.push(LableBasesToStackedLabel(setLabelBasePropsValues(netLblStack, [ r.net.split('@')[1] ?? '', r.net.split('@')[0] ?? '' ])));
        }
        labelRow.push(setStackedLabelValues(headCellsMinified.price, [ r.mkt, r.prevClose ]));
        labelRow.push(setLabelBasePropsValue(headCellsMinified.pl, r.pl));
        l.push(labelRow);
      });
    }
    return l;
  }

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
          headLabels={Object.values(headCellsMinified)}
          data={RowsToLabels(positions)}
          title="Positions"
          addPageControl={false}
        >
          <NamedIconButton name="DETAILS" size={30}/>
        </DataTable>
      </CardContent>
    </Card>
  );
};

export {
  Positions,
  PositionsMinified
}
