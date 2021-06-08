import clsx from 'clsx';
import React from 'react';
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
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
  logoutButton: {
    marginRight: 0,
    marginLeft: 'auto'
  },
  hide: {
    display: 'none',
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

const DefaultAppbar = (props) => {
  const { title, sidemenuopened, handleDrawerOpen } = props;
  const classes = useStyles();
  return (
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
          {title}
        </Typography>
        <Button color="inherit" className={clsx(classes.logoutButton)}>LogOut</Button>
      </Toolbar>
    </AppBar>
  );
};

export {
  DefaultAppbar
}
