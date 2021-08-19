import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch,useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  wsAddress,
  getDispatchSelectCB,
  operations,
  UserState,
  messages,
  wsPriceAddress,
  updateMarketDataShortAction,
  updateMarketDataLongAction,
  store,
  DataMask8,
  DataMask32,
  DataMask4,
  DataMask2,
  DataMask1,
  setAccountOrderAction,
  setAccountOrderByPushAction,
  setAccountPositionByPushAction,
  setAccountBalanaceAction,
  setAccountSummaryByPushAction,
  setDoneTradeReportByPushAction
} from '../Util';

interface WebSocketProps {

}

interface PriceWebSocketProps {
  messages?: string[]
}

const ClientWS = (props: WebSocketProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const ae = useSelector((state: UserState) => state.isAE);
  const address = `${wsAddress}${token}`;
  const dispatch = useDispatch();
  const history = useHistory();
  const ws = useRef<WebSocket | null>(null);
  const intl = useIntl();

  useEffect(() => {
    ws.current = new WebSocket(address);
    ws.current.onopen = () => {
      ws.current!.send(JSON.stringify({
        "dataMask" : 47,
        "event" : "subscribe",
        "accNo" : ae ? "*" : accNo
      }));
    }
    ws.current.onclose = () => {};
    return () => closeSocket(true);
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = e => { 
      handlePushMessage(JSON.parse(e.data));
      return false;
    };
  }, []);

  const handlePushMessage = (message: any) => {
    if (message.dataMask === undefined) return;
    /*
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    const closeWSCallback = () => closeSocket(false);
    const hooks = getDispatchSelectCB(message.dataMask);
    //TODO change op type later
    operations('account', hooks?.id, payload, closeWSCallback, hooks?.action).then(data => {
      if (data !== undefined) {
        dispatch(data.actionData);
      }
    });*/
    switch (+message.dataMask) {
      case 1:
        const data1 = message as DataMask1;
        dispatch(setAccountSummaryByPushAction(data1));
        break;
      case 2:
        const data2 = message as DataMask2;
        dispatch(setAccountBalanaceAction(data2));
        break;
      case 4:
        const data4 = message as DataMask4;
        dispatch(setAccountPositionByPushAction(data4));
        break;
      case 8:
        const data8 = message as DataMask8;
        dispatch(setAccountOrderByPushAction(data8));
        break;
      case 32:
        const data32 = message as DataMask32;
        dispatch(setDoneTradeReportByPushAction(data32));
        break;
      default:
        console.log('Unknown data mask');
    }
  };

  const closeSocket = (normal: boolean) => {
    if (!ws.current || ws.current.readyState !== 1) return;
    ws.current.send(JSON.stringify({
      "dataMask" : 47,
      "event" : "release"
    }));
    ws.current.close();
    if (normal) return;
    history.push({
      pathname: '/logout',
      state: messages[intl.locale].session_expired
    });
  };

  return null;
};

const ClientPriceWS = (props: PriceWebSocketProps) => {
  const { messages } = props;
  const accNo = useSelector((state: UserState) => state.accName);
  const serverKey = useSelector((state: UserState) => state.serverKey);
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const intl = useIntl();

  const handlePushMessage = (message: any) => {
    let data: string[] = (message as string).split(',');
    switch (+data[0]) {
      case 4102:
        dispatch(updateMarketDataLongAction({
          prodCode: data[2],
          productName: data[3],
          productType: +data[4],
          contractSize: +data[5],
          expiryDate: +data[6],
          instrumentCode: data[7],
          currency: data[8],
          strike: +data[9],
          callPut: data[10],
          underlying: data[11],
          bidPrice1: +data[12],
          bidPrice2: +data[13],
          bidPrice3: +data[14],
          bidPrice4: +data[15],
          bidPrice5: +data[16],
          bidQty1: +data[17],
          bidQty2: +data[18],
          bidQty3: +data[19],
          bidQty4: +data[20],
          bidQty5: +data[21],
          askPrice1: +data[22],
          askPrice2: +data[23],
          askPrice3: +data[24],
          askPrice4: +data[25],
          askPrice5: +data[26],
          askQty1: +data[27],
          askQty2: +data[28],
          askQty3: +data[29],
          askQty4: +data[30],
          askQty5: +data[31],
          lastPrice1: +data[32],
          lastPrice2: +data[33],
          lastPrice3: +data[34],
          lastPrice4: +data[35],
          lastPrice5: +data[36],
          lastQty1: +data[37],
          lastQty2: +data[38],
          lastQty3: +data[39],
          lastQty4: +data[40],
          lastQty5: +data[41],
          openInterest: +data[42],
          turnoverAmount: +data[43],
          turnoverVolume: +data[44],
          reserved1: +data[45],
          reserved2: +data[46],
          equilibriumPrice: +data[47],
          open: +data[48],
          high: +data[49],
          low: +data[50],
          previousClose: +data[51],
          previousCloseDate: +data[52],
          notUsed: +data[53],
          tradeStateNo: +data[54],
        }));
        break;
      case 4104:
        // TODO add handle for login result
      case 4107:
        // TODO add handle for subscribe result
      case 4108:
        return;
      case 4202:
        dispatch(updateMarketDataShortAction({
          prodCode: data[2],
          mktPrice: +data[3],
          previousClose: +data[4],
          time: +data[5]
        }));
        break;
      default:
        console.log(`unknown code ${+data[0]}`);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(wsPriceAddress);
    ws.current.onopen = () => {
      ws.current!.send(`4104,0,${accNo},${serverKey},3,8.7,1.0,1.0,SPMARIADB_F,${Date.now()},0\r\n`);
    }
    ws.current.onclose = () => {};
    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = e => { 
      handlePushMessage(e.data);
      return false;
    };
  }, []);

  useEffect(() => {
    const sendMessage = () => {
      if (messages !== undefined && messages.length !== 0) {
        if (ws.current?.readyState === WebSocket.OPEN) {
          messages.forEach((m, i)=> {
            if (m !== '') {
              setTimeout(() => ws.current?.send(m), i * 100);
            }
          });
          clearTimeout(check);
          return;
        } else {
          if (ws.current?.readyState === WebSocket.CLOSING || ws.current?.readyState === WebSocket.CLOSED) {
            console.log('socket closed return');
            clearTimeout(check);
          } else {
            console.log('connecting to price server...');
          }
        }
      }
    }
    const check = setTimeout(sendMessage, 1000);
  }, [messages]);

  return null;
};

export {
  ClientWS,
  ClientPriceWS
}
