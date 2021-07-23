import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  ClientWS,
  DefaultAppbar,
  DefaultDrawer,
  DefaultTabControl
} from '../Components';
import { ROBOTO_REGULAR, ROBOTO_SEMIBOLD, ROBOTO_SEMILIGHT, UserState, WHITE80, WHITE90 } from '../Util';
import { Typography, Box } from '@material-ui/core/';
import { ProfileMinified } from './Profile';
import { PositionsMinified } from './Positions';
import { OrdersMinified } from './Orders';

interface DashboardProps {

}

const drawerWidth = 240;
const useStylesDashboard = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minWidth: '90%'
  },
  welcomeBox: {
    position: 'absolute',
    top: '10%',
    left: '3%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    fontSize: '2rem',
    fontWeight: ROBOTO_SEMILIGHT,
    letterSpacing: '0.015rem'
  },
  welcomeMessage: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    marginBottom: '2rem',
    color: WHITE90
  },
  greetings: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    color: WHITE80
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    top: 200
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    top: '10%'
  },
  toolbar: theme.mixins.toolbar
}));

const Dashboard = (props: DashboardProps) => {
  const classes = useStylesDashboard();
  const [sidemenuopened, setSideMenuOpened] = useState(false);
  const userId = useSelector((state: any) => state.userId);
  const token = useSelector((state: UserState) => state.token);

  const handleDrawerOpen = () => {
    setSideMenuOpened(true);
  };

  const handleDrawerClose = () => {
    setSideMenuOpened(false);
  };

  const getTimePhrase = (): string => {
    const hour = new Date(Date.now()).getHours();
    switch (true) {
      case (hour >= 0 && hour < 12):
        return 'morning';
      case (hour >= 12 && hour < 18):
        return 'afternoon';
      case (hour >= 18 && hour <= 23):
        return 'evening';
      default:
        throw new Error('unknown time.');
    }
  };

  return (
    <div className={classes.root}>
      <ClientWS />
      <DefaultAppbar
        title="Dashboard"
        sidemenuopened={sidemenuopened}
        handleDrawerOpen={handleDrawerOpen}
      />
      <DefaultDrawer
        sidemenuopened={sidemenuopened}
        handleDrawerClose={handleDrawerClose}
      />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: sidemenuopened,
        })}
      >
          <div className={classes.toolbar} />
          <div className={classes.welcomeBox}>
            <Typography className={classes.welcomeMessage}>Welcome to Sharp Point Trading Platform.</Typography>
            <Typography className={classes.greetings}>{`Good ${getTimePhrase()}, ${userId}.`}</Typography>
          </div>
          <ProfileMinified />
          <PositionsMinified />
          <OrdersMinified />
      </main>
    </div>
  );
};

export {
  Dashboard
}
