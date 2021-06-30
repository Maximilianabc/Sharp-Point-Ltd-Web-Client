import { ClickAwayListener, MenuList, Paper } from "@material-ui/core";
import { makeStyles, Button, Popper, MenuItem } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRef } from "react";

interface StyledDropDownMenuProps {
  title: string,
  children: JSX.Element[]
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(2)
  },
  menu: {
    zIndex: theme.zIndex.modal + 1
  }
}));

const StyledDropDownMenu = (props: StyledDropDownMenuProps) => {
  const { children: menuItems, title } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);
  const anchor = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchor.current && anchor.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchor.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <Button
        ref={anchor}
        onClick={handleToggle}
      >
        {title}
      </Button>
      <Popper
        open={open}
        anchorEl={anchor.current}
        className={classes.menu}
      >
        <Paper elevation={0}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList autoFocusItem={open}
              id="menu-list-grow"
            >
              {menuItems.map(item => {
                return (
                  item
                );
              })}
            </MenuList>
          </ClickAwayListener>     
        </Paper>
      </Popper>
    </div>
  );
};

export {
  StyledDropDownMenu
}