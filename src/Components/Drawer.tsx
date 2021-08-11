import React from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth: number = 240;
const useStyles = makeStyles((theme) => ({
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
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

interface DrawerProps {
  sidemenuopened: boolean,
  handleDrawerClose: () => void
}

const DefaultDrawer = (props: DrawerProps) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={props.sidemenuopened}
        classes={{paper: classes.drawerPaper}}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={props.handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <List>
        {['Dashboard', 'LogOut'].map((text, index) => (
          <ListItem
            button
            key={text}
            component={Link}
            to={`/${text.toLowerCase()}/`}
          >
            <ListItemText primary={text} />
          </ListItem> 
        ))}
      </List>
    </Drawer>
  );
};

export {
  DefaultDrawer
}
