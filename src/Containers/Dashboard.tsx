import clsx from 'clsx';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  DefaultAppbar,
  DefaultDrawer
} from '../Components';
import { SessionToken, State } from '../Util';

interface DashboardProps {

}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  }
}));

const Dashboard = (props: DashboardProps) => {
  const classes = useStyles();
  const [sidemenuopened, setSideMenuOpened] = useState(false);
  const token = useSelector((state: State<SessionToken>) => state.token);
  
  const handleDrawerOpen = () => {
    setSideMenuOpened(true);
  };

  const handleDrawerClose = () => {
    setSideMenuOpened(false);
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
        /*className={clsx(classes.content, {
          [classes.contentShift]: sidemenuopened,
        })}*/
      >
        <div /*className={classes.drawerHeader} *//>
      </main>
    </div>
  );
};

export {
  Dashboard
}
