import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch,useSelector } from 'react-redux';
import {
  DataTable,
  NamedIconButton
} from '../Components';
import { 
  getDispatchSelectCB,
  operations,
  OPConsts,
  UserState,
  PositionRecordRow,
  ROW_CONTAINER_CLASSES,
  CARD_CLASSES,
  workingInProgess,
  SCROLL_BAR_CLASSES,
  messages,
  AccPositionRecord,
  MarketDataShort,
  store,
  MarketDataLong
} from '../Util';
import { useHistory } from 'react-router';
import { Card, CardContent } from '@material-ui/core';
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
import { useIntl } from 'react-intl';

interface PositionProps {

}

interface PositionMinifiedProps {
  setMessage?: (message: string) => void
}

const headCells: { [name: string]: LabelBaseProps } = {
  stockID: { id: 'id', align: 'left', label: 'stock_id', colorMode: 'ignored' },
  stockName: { id: 'name', align: 'right', label: 'stock_name', colorMode: 'ignored' },
  prev: { id: 'prev', align: 'right', label: 'prev', colorMode: 'ignored' },
  long: { id: 'day-long', align: 'right', label: 'long', colorMode: 'ignored' },
  short: { id: 'day-short', align: 'right', label: 'short', colorMode: 'ignored' },
  net: { id: 'net', align: 'right', label: 'net', colorMode: 'ignored' },
  price: { id: 'market-price', align: 'right', label: 'price', colorMode: 'normal' },
  pl: { id: 'profit-loss', align: 'left', label: 'pl', colorMode: 'normal' },
  close: { id: 'prev-close', align: 'right', label: 'prev', colorMode: 'normal' },
  opt: { id: 'avg-net-opt-val', align: 'right', label: 'average_net_option_value', colorMode: 'normal' },
  fx: { id: 'ref-exchange-rate', align: 'right', label: 'fx', colorMode: 'ignored' },
  contract: { id: 'contract', align: 'right', label: 'contract', colorMode: 'ignored' }
};

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

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
  container: {
    ...ROW_CONTAINER_CLASSES,
    maxWidth: '55vw',
    maxHeight: '50vh',
    overflow: 'auto',
    '&::-webkit-scrollbar': SCROLL_BAR_CLASSES
  }
}));

const PositionsMinified = (props : PositionMinifiedProps) => {
  const { setMessage } = props;
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);

  const [positions, setPositions] = useState<PositionRecordRow[]>([]);
  const [prods, setProds] = useState<string[]>([]);
  const [longMode, setLongMode] = useState(true);

  const classes = useStyleMinified();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.POSITION);
  const intl = useIntl();

  let mktDataShort: { [id: string]: MarketDataShort } | undefined;
  let mktDataLong: { [id: string]: MarketDataLong } | undefined;

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
    let work = setInterval(workFunction, 1000); 
    return () => {
      clearInterval(work);
    };
  }, []);

  useEffect(() => {
    const getStoreData = () => {
      if (longMode) {
        mktDataLong = store.getState().marketDataLong;
      } else {
        mktDataShort = store.getState().marketDataShort;
      }
    };
    const get = setInterval(getStoreData, 1000);
    return () => clearInterval(get);
  }, []);

  const positionsToRows = (positions: any): PositionRecordRow[] => {
    let p: PositionRecordRow[] = [];
    let products: string[] = prods;
    if (positions) {
      Array.prototype.forEach.call(positions, (pos: AccPositionRecord) => {
        p.push({
          id: pos.prodCode ?? '?',
          name: longMode ? (mktDataLong?.[pos?.prodCode ?? '']?.productName ?? '?') : '?',
          prev: `${pos.psQty}@${pos.previousAvg}`,
          dayLong: pos.longQty === 0 || pos.longAvg === 0 ? '' : `${pos.longQty}@${pos.longAvg}`,
          dayShort: pos.shortQty === 0 || pos.shortAvg === 0 ? '' :`${pos.shortQty}@${pos.shortAvg}`,
          net: `${pos.netQty}@${pos.netAvg}`,
          mkt: longMode 
            ? (mktDataLong?.[pos?.prodCode ?? '']?.bidPrice1?.toString() ?? '?') 
            : (mktDataShort?.[pos?.prodCode ?? '']?.mktPrice?.toString() ?? '?'),
          pl: pos.profitLoss?.toString() ?? '?',
          prevClose: longMode 
            ? (mktDataLong?.[pos?.prodCode ?? '']?.previousClose?.toString() ?? '?') 
            : (mktDataShort?.[pos?.prodCode ?? '']?.previousClose?.toString() ?? '?'),
          optVal: '?',
          fx: 0,
          contract: ''}
        );
        if (pos.prodCode && products.findIndex(s => s === pos.prodCode) === -1) {
          if (setMessage) {
            products.push(pos.prodCode);
            setMessage(`4107,0,${pos.prodCode},${longMode ? '0' : '1'},0\r\n`);
          };
        }
      });
    }
    setProds(products);
    return p;
  };
  
  const RowsToLabels = (rows: PositionRecordRow[]): LabelBaseProps[][] => {
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
          title={messages[intl.locale].positions}
          icons={[{ name: "DETAILS", size: 30, onClick: workingInProgess }]}
          containerClasses={classes.container}
        />
      </CardContent>
    </Card>
  );
};

export {
  PositionsMinified
}
