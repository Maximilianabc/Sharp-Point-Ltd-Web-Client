import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch,useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  wsAddress,
  getDispatchSelectCB,
  operations,
  UserState,
  store,
  messages
} from '../Util';

interface WebSocketProps {

}

const ClientWS = (props: WebSocketProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
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
        "accNo" : "*"
      }));
      console.log('opened');
    }
    ws.current.onclose = () => console.log('closed');
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
    console.log(message);
    if (message.dataMask === undefined) return;
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
    });
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

export {
  ClientWS
}
