import clsx from 'clsx';
import { useState } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  DefaultAppbar,
  DefaultDrawer
} from '../Components';
import { SessionToken, State, UserInfo } from '../Util';
import { Typography } from '@material-ui/core/';
import { useEffect } from 'react';
import { useContext } from 'react';

interface DashboardProps {

}

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
  }
}));

const Dashboard = (props: DashboardProps) => {
  const classes = useStyles();
  const [sidemenuopened, setSideMenuOpened] = useState(false);
  const userId = useSelector((state: State<UserInfo>) => state.userId);
  const token = useSelector((state: State<SessionToken>) => state.token);

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
        <div /*className={classes.drawerHeader} *//>
        <Typography variant="h1" gutterBottom>Welcome to Sharp Point Trading Platform.</Typography>
        <Typography variant="h2" gutterBottom>{`Good ${getTimePhrase()}, ${userId}.`}</Typography>
      </main>
    </div>
  );
};

export {
  Dashboard
}
