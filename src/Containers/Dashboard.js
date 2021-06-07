import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { postRequest, setAccountBalanaceAction, setAccountOrderAction, setAccountPositionAction, setAccountSummaryAction, wsAddress } from '../Util';

const StyledDrawerList = withStyles({
  root: {
    width: 250,
  },
})(List);

const Dashboard = (props) => {
  const [sideMenuOpened, setSideMenuOpened] = useState(true);

  const token = useSelector(state => state.sessionToken);
  const userId = useSelector(state => state.userId);

  const toggleDrawer = (event) => {
    setSideMenuOpened(false);
  };

  return (
    <div>
      <ClientWS />
      <Drawer
        anchor="left"
        open={sideMenuOpened}
        variant="temporary"
        ModalProps={{ onBackdropClick: toggleDrawer }}
        SlideProps={{ timeout: 250 }}
      >
        <StyledDrawerList>
          {['Dashboard', 'Profile', 'Orders', 'Settings', 'LogOut'].map((text, index) => (
            <ListItem button key={text} component={Link} to={`/${text.toLowerCase()}/`}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </StyledDrawerList>
      </Drawer>
    </div>
  );
};

const ClientWS = (props) => {
  const token = useSelector(state => state.sessionToken);
  const accNo = useSelector(state => state.accNo);
  const address = `${wsAddress}${token}`;
  const [isPaused, setPause] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const ws = useRef(null);

  useEffect(() => {
      ws.current = new WebSocket(address);
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify({
          "dataMask" : 15,
          "event" : "subscribe",
          "accNo" : "*"
        }));
        console.log("ws opened");
      }
      ws.current.onclose = () => console.log("ws closed");
      return () => {
          //ws.current.close();
      };
  }, []);

  useEffect(() => {
      if (!ws.current) return;
      ws.current.onmessage = e => {
          if (isPaused) return;
          handlePushMessage(JSON.parse(e.data));
      };
  }, [isPaused]);

  const handlePushMessage = (message) => {
    if (message.dataMask === undefined) return;
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    let op = '';
    switch (message.dataMask) {
      case 1:
        op = 'Summary';
        break;
      case 2:
        op = 'Balance';
        break;
      case 4:
        op = 'Position';
        break;
      case 8:
        op = 'Order';
        break;
      default:
        console.log(`unknown data mask ${message.dataMask}`);
        break;
    };
    postRequest(`/account/account${op}`, payload).then(data => {
      console.log(data);
      if (data.result_code === "40011") {
        ws.current.send(JSON.stringify({
          "dataMask" : 15,
          "event" : "release"
        }));
        ws.current.close();
        console.log('session expired.')
        history.push('/');
        return;
      }
      switch (message.dataMask) {
        case 1:
          dispatch(setAccountSummaryAction(data));
          break;
        case 2:
          dispatch(setAccountBalanaceAction(data));
          break;
        case 4:
          dispatch(setAccountPositionAction(data));
          break;
        case 8:
          dispatch(setAccountOrderAction(data));
          break;
        default:
          console.log(`unknown data mask ${message.dataMask}`);
          break;
      };
    });
  };

  return (
    <button onClick={() => setPause(!isPaused)}>
        {isPaused ? "Resume" : "Pause"}
    </button>
  );
};

export {
  Dashboard,
  ClientWS
}
