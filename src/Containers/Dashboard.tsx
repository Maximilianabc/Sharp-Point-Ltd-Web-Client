import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  DefaultAppbar,
  DefaultDrawer,
  DefaultTabControl
} from '../Components';
import { UserState } from '../Util';
import { Typography, Box } from '@material-ui/core/';
import {
  Profile,
  Positions,
  Cash,
  ClearTrade,
  Fx
} from './';

interface DashboardProps {

}

const drawerWidth = 240;
const useStylesDashboard = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minWidth: '90%'
  },
  welcomeMessage: {
    fontWeight: 300,
    marginBottom: '2rem'
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
          <Typography
            className={classes.welcomeMessage}
            variant="h3"
            align="left"
          >
            Welcome to Sharp Point Trading Platform.
          </Typography>
          <Typography
            className={classes.welcomeMessage}
            variant="h4"
            align="left"
          >
            {`Good ${getTimePhrase()}, ${userId}.`}
          </Typography>
          <Box height={720} width={1}>
            <DefaultTabControl>
              <Profile />
              <Positions />
              <div/>
              <Cash />
              <ClearTrade />
              <Fx />
            </DefaultTabControl>
          </Box>
      </main>
    </div>
  );
};

export {
  Dashboard
}
