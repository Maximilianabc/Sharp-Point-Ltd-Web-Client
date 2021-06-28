import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch,useSelector } from 'react-redux';
import {
  ClientWS,
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  UserState,
  PositionRecord
} from '../Util';
import { useHistory } from 'react-router';

interface PositionProps {

}

const headCells = [
  { id: 'id', align: 'left', label: 'ID', colorMode: 'ignore' },
  { id: 'name', align: 'right', label: 'Name', colorMode: 'ignore' },
  { id: 'prev', align: 'right', label: 'Prev.', colorMode: 'ignore' },
  { id: 'day-long', align: 'right', label: 'Day Long', colorMode: 'ignore' },
  { id: 'day-short', align: 'right', label: 'Day Short', colorMode: 'ignore' },
  { id: 'net', align: 'right', label: 'Net', colorMode: 'ignore' },
  { id: 'market-price', align: 'right', label: 'Mkt.Prc', colorMode: 'normal' },
  { id: 'profit-loss', align: 'right', label: 'P/L', colorMode: 'normal' },
  { id: 'prev-close', align: 'right', label: 'Prv Close', colorMode: 'normal' },
  { id: 'avg-net-opt-val', align: 'right', label: 'Av.Net Opt.Val', colorMode: 'normal' },
  { id: 'ref-exchange-rate', align: 'right', label: 'Ref. Fx Rate', colorMode: 'ignore' },
  { id: 'contract', align: 'right', label: 'Contract', colorMode: 'ignore' }
];

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
        headerCells={headCells}
      />     
    </div>
  );
};

export {
  Positions
}
