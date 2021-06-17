import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch,useSelector } from 'react-redux';
import {
  ClientWS,
  DefaultAppbar,
  DefaultDrawer,
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  UserState,
  AccPositionRecord
} from '../Util';
import { useHistory } from 'react-router';

interface PositionProps {

}

const headCells = [
  { id: 'id', align: 'left', label: 'ID' },
  { id: 'name', align: 'right', label: 'Name' },
  { id: 'prev', align: 'right', label: 'Prev.' },
  { id: 'day-long', align: 'right', label: 'Day Long' },
  { id: 'day-short', align: 'right', label: 'Day Short' },
  { id: 'net', align: 'right', label: 'Net' },
  { id: 'market-price', align: 'right', label: 'Mkt.Prc' },
  { id: 'profit-loss', align: 'right', label: 'P/L' },
  { id: 'prev-close', align: 'right', label: 'Prv Close' },
  { id: 'avg-net-opt-val', align: 'right', label: 'Av.Net Opt.Val' },
  { id: 'ref-exchange-rate', align: 'right', label: 'Ref. Fx Rate' },
  { id: 'contract', align: 'right', label: 'Contract' }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  }
});

const Positions: React.FC = (props: PositionProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [positions, setPositions] = useState<AccPositionRecord[]>([]);
  const [sidemenuopened, setSideMenuOpened] = useState(false);
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
    let work = setInterval(() => {
      AccOperations(hooks.id, payload, undefined, hooks.action).then(data => {
        try {
          if (data && !data.closeSocket) {
            dispatch(data.actionData);
            onReceivePush(data.data);
          } else {
            if (wsRef && wsRef.current) {
              //wsRef!.current!.closeExplicit(false);
            }
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
    }, 1000); 
    return () => {
      clearInterval(work);
    };
  }, []);

  
  const handleDrawerOpen = () => {
    setSideMenuOpened(true);
  };
  const handleDrawerClose = () => {
    setSideMenuOpened(false);
  };

  const positionsToRows = (positions: any): AccPositionRecord[] => {
    let p: AccPositionRecord[] = [];
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
    <div className={classes.root}>
      <ClientWS
        onReceivePush={onReceivePush}
        operation={OPConsts.POSITION}
        ref={wsRef}
      />
      <DefaultAppbar
        title={title}
        sidemenuopened={sidemenuopened}
        handleDrawerOpen={handleDrawerOpen}
      />
      <DefaultDrawer
        sidemenuopened={sidemenuopened}
        handleDrawerClose={handleDrawerClose}
      />
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
