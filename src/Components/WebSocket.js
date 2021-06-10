import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  wsAddress,
  getDispatchSelectCB,
  AccOperations
} from '../Util';

const ClientWS = forwardRef((props, ref) => {
  const { onReceivePush } = props;

  const token = useSelector(state => state.sessionToken);
  const accNo = useSelector(state => state.accNo);
  const address = `${wsAddress}${token}`;
  const dispatch = useDispatch();
  const history = useHistory();
  const ws = useRef(null);
  const dispatchAction = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(address);
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        "dataMask" : 15,
        "event" : "subscribe",
        "accNo" : "*"
      }));
      console.log('opened');
    }
    ws.current.onclose = () => console.log('closed');
    return () => closeSocket(true)
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = e => { 
      handlePushMessage(JSON.parse(e.data));
      return false;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    closeExplicit: (normal) => {
      console.log('close explicit');
      closeSocket(normal);
    }
  }));

  const handlePushMessage = (message) => {
    if (message.dataMask === undefined) return;

    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    const closeWSCallback = closeSocket(false);
    const hooks = getDispatchSelectCB(message.dataMask);
    AccOperations(hooks.id, payload, message.dataMask, closeWSCallback, hooks.dispatch).then(data => {
      if (data !== undefined) {
        dispatchAction.current = () => dispatch(data.action);
        onReceivePush(data.data);
      }
    });
  };

  const closeSocket = (normal) => {
    if (!ws.current) return;
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
