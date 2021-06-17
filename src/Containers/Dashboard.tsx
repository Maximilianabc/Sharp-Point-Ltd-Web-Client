import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  DefaultAppbar,
  DefaultDrawer,
  ScrollableTabsButtonAuto
} from '../Components';
import { UserState } from '../Util';
import { Typography } from '@material-ui/core/';

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
  const classes = useStyles();
  const [sidemenuopened, setSideMenuOpened] = useState(false);
  const userId = useSelector((state: any) => {console.log(state); return state.userId;});
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
          <Typography variant="h3" gutterBottom>Welcome to Sharp Point Trading Platform.</Typography>
          <Typography variant="h4" gutterBottom>{`Good ${getTimePhrase()}, ${userId}.`}</Typography>
          <ScrollableTabsButtonAuto/>
      </main>
    </div>
  );
};

export {
  Dashboard
}
