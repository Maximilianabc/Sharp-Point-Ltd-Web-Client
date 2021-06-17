import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  wsAddress,
  getDispatchSelectCB,
  AccOperations,
  UserState
} from '../Util';

interface WebSocketProps {
  onReceivePush: (data: any) => void, 
  operation: number
}

const ClientWS = forwardRef((props: WebSocketProps, ref) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const address = `${wsAddress}${token}`;
  const dispatch = useDispatch();
  const history = useHistory();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(address);
    ws.current.onopen = () => {
      ws.current!.send(JSON.stringify({
        "dataMask" : 15,
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

  useImperativeHandle(ref, () => ({
    closeExplicit: (normal: boolean) => {
      closeSocket(normal);
    }
  }));

  const handlePushMessage = (message: any) => {
    if (message.dataMask === undefined || message.dataMask !== props.operation) return;
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    const closeWSCallback = () => closeSocket(false);
    const hooks = getDispatchSelectCB(message.dataMask);
    AccOperations(hooks?.id, payload, closeWSCallback, hooks?.action).then(data => {
      if (data !== undefined) {
        dispatch(data.actionData);
        props.onReceivePush(data.data);
      }
    });
  };

  const closeSocket = (normal: boolean) => {
    if (!ws.current || ws.current.readyState !== 1) return;
    ws.current.send(JSON.stringify({
      "dataMask" : 15,
      "event" : "release"
    }));
    ws.current.close();
    if (normal) return;
    history.push({
      pathname: '/logout',
      state: 'Session expired. Please login again.'
    });
  };

  return null;
});

export {
  ClientWS
}
