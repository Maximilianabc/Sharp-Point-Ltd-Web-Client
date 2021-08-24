import { useState, useEffect, useRef, useLayoutEffect, DependencyList, MutableRefObject } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch,useSelector } from 'react-redux';
import {
  DataTable,
  IconProps,
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
  setMessages?: (message: string[]) => void
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
    maxHeight: '48vh',
    overflow: 'auto',
    '&::-webkit-scrollbar': SCROLL_BAR_CLASSES
  }
}));

const PositionsMinified = (props : PositionMinifiedProps) => {
  const { setMessages } = props;
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
          }
        } catch (error) {
          console.error(error);
        }
      });
    };
    workFunction();
    return () => {
      
    };
  }, []);

  useEffect(() => {
    const getStoreData = () => {
      if (longMode) {
        mktDataLong = store.getState().marketDataLong;
      } else {
        mktDataShort = store.getState().marketDataShort;
      }
      setPositions(positionsToRows(Object.values(store.getState().position?.data ?? {})));
    };
    const get = setInterval(getStoreData, 100000);
    return () => clearInterval(get);
  }, []);

  const positionsToRows = (positions: any): PositionRecordRow[] => {
    let p: PositionRecordRow[] = [];
    let products: string[] = prods;
    let messages: string[] = [];

    if (positions) {
      Array.prototype.forEach.call(positions, (pos: AccPositionRecord) => {
        const prod = mktDataLong?.[pos?.prodCode ?? ''] 
        const prodShort = mktDataShort?.[pos?.prodCode ?? ''];
        const price = longMode ? (prod?.bidPrice1?.toString() ?? '?') : (prodShort?.mktPrice?.toString() ?? '?');
        const size = longMode ? prod?.contractSize : undefined;
        const pl = isNaN(+price) || pos.netAvg === undefined || pos.netQty === undefined || size === undefined ? '?' : ((+price - pos.netAvg) * pos.netQty * size).toString();

        // const netAvg = pos.netTotalAmount && pos.netQty ? pos.netTotalAmount / pos.netQty : undefined;
        p.push({
          id: pos.prodCode ?? '?',
          name: longMode ? (prod?.productName ?? '?') : '?',
          prev: pos.qty === 0 || pos.previousAvg === 0 ? '' : `${pos.qty}@${pos.previousAvg}`,
          dayLong: pos.longQty === 0 || pos.longAvg === 0 ? '' :  `${pos.longQty}@${pos.longAvg}`,
          dayShort: pos.shortQty === 0 || pos.shortAvg === 0 ? '' :`${pos.shortQty}@${pos.shortAvg}`,
          net: `${pos.netQty}@${pos.netAvg}`,
          mkt: price,
          pl:  pl,
          prevClose: longMode 
            ? (prod?.previousClose?.toString() ?? '?') 
            : (prodShort?.previousClose?.toString() ?? '?'),
          optVal: '?',
          fx: 0,
          contract: ''}
        );
        if (pos.prodCode && products.findIndex(s => s === pos.prodCode) === -1) {
          if (setMessages) {
            products.push(pos.prodCode);
            messages.push(`4107,0,${pos.prodCode},${longMode ? '0' : '1'},0\r\n`);
          };
        }
      });
    }
    setProds(products);
    if (setMessages && messages.length !== 0) {
      setMessages(messages);
    }
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

  const getIconProps = (rows: PositionRecordRow[]): IconProps[][] => {
    let ips: IconProps[][] = [];
    Array.prototype.forEach.call(rows, (r: PositionRecordRow) => {
      ips.push([{ name: "DETAILS", size: 30, onClick: workingInProgess }]);
    })
    return ips;
  };

  return (
    <Card elevation={0} className={classes.card}>
      <CardContent>
        <DataTable
          addPageControl
          headLabels={Object.values(headCellsMinified)}
          data={RowsToLabels(positions)}
          title={messages[intl.locale].positions}
          icons={getIconProps(positions)}
          containerClasses={classes.container}
        />
      </CardContent>
    </Card>
  );
};

export {
  PositionsMinified
}
