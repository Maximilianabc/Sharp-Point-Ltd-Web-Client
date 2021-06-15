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
  opConsts
} from '../Util';

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

const createData = (id, optName, prev, daylong, dayshort, net, mkt, pl, prevClose, optVal, fx, contract) => {
  return { id, optName, prev, daylong, dayshort, net, mkt, pl, prevClose, optVal, fx, contract }
};

const Positions = (props) => {
  const token = useSelector(state => state.sessionToken);
  const accNo = useSelector(state => state.accNo);
  const [positions, setPositions] = useState([]);
  const [sidemenuopened, setSideMenuOpened] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const hooks = getDispatchSelectCB(opConsts.POSITION);
  const title = "Positions";
  const dispatchAction = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    let work = setInterval(() => {
      AccOperations(hooks.id, payload, undefined, hooks.dispatch).then(data => {
        try {
          if (data && !data.close) {
            dispatchAction.current = () => dispatch(data.action);
            onReceivePush(data.data);
          } else {
            wsRef.current.closeExplicit(false);
            clearInterval(work);
          }
        } catch (error) {
          console.error(error);
          clearInterval(work);
        }
      });
    }, 1000); 
    return () => {
      console.log('positions unloaded');
      clearInterval(work);
    };
  }, []);

  
  const handleDrawerOpen = () => {
    setSideMenuOpened(true);
  };
  const handleDrawerClose = () => {
    setSideMenuOpened(false);
  };

  const positionsToRows = (data) => {
    let positions = data.positions ? data.positions : (data.recordData ? data.recordData : undefined);
    let p = [];
    if (positions) {
      Array.prototype.forEach.call(positions, pos => {
        p.push(createData(
          pos.prodCode,
          '', // TODO name?
          `${pos.psQty}@${pos.previousAvg}`,
          pos.longQty === 0 || pos.longAvg === 0 ? '' : `${pos.longQty}@${pos.longAvg}`,
          pos.shortQty === 0 || pos.shortAvg === 0 ? '' :`${pos.shortQty}@${pos.shortAvg}`,
          `${pos.netQty}@${pos.netAvg}`,
          pos.mktPrice,
          pos.profitLoss,
          pos.closeQty, // ?
          pos.totalAmt, //?
          '',
          ''  
        ));
      });
    }
    return p;
  };

  const onReceivePush = (positions) => {
    if (positions !== undefined) {
      setPositions(positionsToRows(positions));
    }
  };

  return (
    <div className={classes.root}>
      <ClientWS
        onReceivePush={onReceivePush}
        operation={opConsts.POSITION}
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
