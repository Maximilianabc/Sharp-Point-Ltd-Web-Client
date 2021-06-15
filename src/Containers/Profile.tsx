import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  ClientWS,
  DefaultAppbar,
  DefaultDrawer
} from '../Components';

interface ProfileProps {

}

const useStyles = makeStyles({
  root: {
    width: '100%',
  }
});

const Profile = (props: ProfileProps) => {
  const [wsClose, setWSClose] = useState(false);
  const [sidemenuopened, setSideMenuOpened] = useState(false);
  const classes = useStyles();
  const title = "Profile";

  const handleDrawerOpen = () => {
    setSideMenuOpened(true);
  };
  const handleDrawerClose = () => {
    setSideMenuOpened(false);
  };
  return (
    <div className={classes.root}>
      <ClientWS onReceivePush={() => {}} close={wsClose}/>
      <DefaultAppbar
        title={title}
        sidemenuopened={sidemenuopened}
        handleDrawerOpen={handleDrawerOpen}
      />
      <DefaultDrawer
        sidemenuopened={sidemenuopened}
        handleDrawerClose={handleDrawerClose}
      /> 
    </div>
  );
};

export {
  Profile
};