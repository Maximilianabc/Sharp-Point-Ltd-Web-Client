import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
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