import clsx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { 
  postRequest,
  setAccountBalanaceAction,
  setAccountOrderAction,
  setAccountPositionAction,
  setAccountSummaryAction,
  wsAddress
} from '../Util';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [sidemenuopened, setSideMenuOpened] = useState(false);

  const token = useSelector(state => state.sessionToken);
  const userId = useSelector(state => state.userId);

  const handleDrawerOpen = () => {
    setSideMenuOpened(true);
  };

  const handleDrawerClose = () => {
    setSideMenuOpened(false);
  };

  return (
    <div className={classes.root}>
      <ClientWS/>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: sidemenuopened,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="sidemenuopened drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, sidemenuopened && classes.hide)}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        sidemenuopened={sidemenuopened ? 1 : 0}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <List classes={classes.drawerList}>
          {['Dashboard', 'Profile', 'Orders', 'Settings', 'LogOut'].map((text, index) => (
            <ListItem button key={text} component={Link} to={`/${text.toLowerCase()}/`}>
              <ListItemText primary={text} />
            </ListItem> 
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: sidemenuopened,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
};

const ClientWS = (props) => {
  const token = useSelector(state => state.sessionToken);
  const accNo = useSelector(state => state.accNo);
  const address = `${wsAddress}${token}`;
  const dispatch = useDispatch();
  const history = useHistory();
  const ws = useRef(null);

  useEffect(() => {
      ws.current = new WebSocket(address);
      ws.current.onopen = () => {
        console.log(address);
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
          handlePushMessage(JSON.parse(e.data));
          return false;
      };
  }, []);

  const handlePushMessage = (message) => {
    console.log(message);
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
      console.log(data.result_code);
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
    <div/>
  );
};

export {
  Dashboard,
  ClientWS
}
