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
  AccDoneTradeRecord,
  FxRate
} from '../Util';
import { useHistory } from 'react-router';

interface ClearTradeProps {

}

const headCells = [
  { id: 'ccy', align: 'left', label: 'Ccy' },
  { id: 'ref-exchange-rate', align: 'right', label: 'Ref. Fx Rate' }
];

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 2px)',
  }
});

const Fx = (props: ClearTradeProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [fx, setFx] = useState<FxRate[]>([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.DONE_TRADE);
  const title = 'Fx';
  /*
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
  }, []);*/

  const onReceivePush = (data: any) => {
    if (data !== undefined) {
      let fx = data.fx ? data.fx : (data.recordData ? data.recordData : undefined);
      if (fx) {
        //setDoneTrade(doneTradeToRows(fx));
      }
    }
  };

  return (
    <div id={title.toLowerCase()}>
      <StyledTable
          data={fx}
          title={title}
          headerCells={headCells}
      />  
    </div>   
  );
};

export {
  Fx
}