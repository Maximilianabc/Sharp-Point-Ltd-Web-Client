import React, { useState, useMemo, forwardRef } from 'react';
import {
  ClickAwayListener,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const StyledDrawerList = withStyles({
  root: {
    width: 250,
  },
})(List);

const Dashboard = (props) => {
  const [sideMenuOpened, setSideMenuOpened] = useState(true);

  const token = useSelector(state => state.sessionToken);
  const userId = useSelector(state => state.userId);

  const toggleDrawer = (event) => {
    setSideMenuOpened(false);
  };

  return (
      <Drawer
        anchor="left"
        open={sideMenuOpened}
        variant="temporary"
        ModalProps={{ onBackdropClick: toggleDrawer }}
        SlideProps={{ timeout: 250 }}
      >
        <StyledDrawerList>
          {['Dashboard', 'Profile', 'Orders', 'Settings', 'LogOut'].map((text, index) => (
            <ListItem button key={text} component={Link} to={`/${text.toLowerCase()}/`}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </StyledDrawerList>
      </Drawer>
  );
};

export {
  Dashboard
}
