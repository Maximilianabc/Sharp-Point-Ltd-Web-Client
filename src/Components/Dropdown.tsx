import {
  makeStyles,
  Button,
  Popper, 
  MenuItem,
  Backdrop,
  ClickAwayListener,
  FormLabel,
  IconButton,
  MenuList,
  Paper,
  MenuItemProps,
  Zoom,
  Collapse,
  withStyles,
  Select
} from "@material-ui/core";
import React, { ReactNode, RefObject, useEffect, useState } from "react";
import { useRef } from "react";
import { 
  CARD_BUTTON_HEADER_LABEL_CLASSES,
  CARD_CLASSES,
  FilterType,
  genRandomHex,
  getOperatorDisplayText,
  getOperators,
  LABEL_CLASSES,
  NumberFilterOperation,
  ROW_CONTAINER_CLASSES, 
  StringFilterOperation,
  WHITE60,
  WHITE80
} from "../Util";
import {
  IconProps,
  isTooltipIconButton,
  NamedIconButton,
  TooltipIconButton,
  TooltipIconProps
} from "./Icon";
import { DefaultInputField, FormInputField } from "./InputField";
import { LabelBase } from "./Label";

interface StyledDropDownMenuProps {
  title: string,
  children: JSX.Element | JSX.Element[],
  iconSize?: number,
  open?: boolean,
  anchor?: RefObject<HTMLButtonElement>,
  disabled?: boolean,
  handleClose?: (event: React.MouseEvent<Document, MouseEvent>) => void,
  handleToggle?: (event: React.MouseEvent) => void
}

interface FilterDropDownMenuProps {
  controlButton: IconProps | TooltipIconProps,
  title?: string,
  // label & type
  filterLabels: string[],
  filterTypes: FilterType[]
}

interface FilterOperatorDropDownMenuProps {
  operators: (NumberFilterOperation | StringFilterOperation)[]
}

interface GenericDropDownMenuProps {
  title: string,
  children: React.ReactElement<MenuItemProps> | React.ReactElement<MenuItemProps>[],
  disabled?: boolean
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: 'fit-content'
  },
  button: {
    ...CARD_BUTTON_HEADER_LABEL_CLASSES,
    fontSize: '1rem',
  },
  menu: {
    zIndex: theme.zIndex.modal + 1
  },
  paper: {
    borderRadius: 0,
    backgroundColor: '#282c34',
    color: WHITE80
  }
}));

const StyledDropDownMenu = (props: StyledDropDownMenuProps) => {
  const {
    children: menuItems,
    title,
    iconSize,
    open,
    anchor,
    disabled,
    handleToggle,
    handleClose,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NamedIconButton
        name="EXPAND"
        size={iconSize ?? 16}
        onClick={disabled ? () => {} : handleToggle}
        buttonRef={anchor}
      />
      <LabelBase label={title} classes={{ 
        root: { 
          color: `${WHITE80} !important`, 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}}/>
      <Popper
        open={open ?? false}
        anchorEl={anchor?.current}
        className={classes.menu}
        placement="bottom-start"
      >
        <Paper elevation={0} className={classes.paper}>
          <ClickAwayListener onClickAway={handleClose ?? (() => {})}>
            <MenuList autoFocusItem={open}>
              {Array.isArray(menuItems)
                ?
                  menuItems.map(item => {
                    return (
                      item
                    );
                  })
                : menuItems
              }
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
};

const useStyleFilterDropDown = makeStyles((theme) => ({
  popper: {
    ...CARD_CLASSES,
    zIndex: theme.zIndex.modal + 1
  },
  paper: {
    background: '#282c34'
  },
  row: {
    ...ROW_CONTAINER_CLASSES,
    color: WHITE60,
    padding: 0
  }
}));

const FilterDropDownMenu = (props: FilterDropDownMenuProps) => {
  const { controlButton, title, filterLabels, filterTypes } = props;
  const classes = useStyleFilterDropDown();
  
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
    <div style={{ flex: '1 1 10%' }}>
      { isTooltipIconButton(controlButton)
        ?
          <TooltipIconButton
            name={controlButton.name}
            title={controlButton.title}
            size={controlButton.size}
            buttonStyle={controlButton.buttonStyle}
            buttonRef={anchor}
            otherProps={controlButton.otherProps}
            isRowBasedCallback={controlButton.isRowBasedCallback}
            onClick={handleToggle}
            classes={controlButton.classes}
            key={genRandomHex(8)}
          />
        :
          <NamedIconButton
            name={controlButton.name}
            size={controlButton.size}
            buttonStyle={controlButton.buttonStyle}
            buttonRef={anchor}
            otherProps={controlButton.otherProps}
            isRowBasedCallback={controlButton.isRowBasedCallback}
            onClick={handleToggle}
            key={genRandomHex(8)}
          />
      }     
      <Popper
        open={open}
        anchorEl={anchor.current}
        className={classes.popper}
        key={genRandomHex(8)}
      >
        <Paper elevation={0} className={classes.paper} key={genRandomHex(8)}>
          <ClickAwayListener onClickAway={handleClose} key={genRandomHex(8)}>
            <MenuList autoFocusItem={false} key={genRandomHex(8)}>
              {
                filterLabels.map((f, index) => {
                  return (
                    <MenuItem className={classes.row} button={false} key={genRandomHex(8)}>
                      <FilterOperatorDropDownMenu operators={getOperators(filterTypes[index])} key={genRandomHex(8)}/>
                      <FormInputField label={f} variant="filled" key={genRandomHex(8)}/>
                    </MenuItem>
                  )
                })
              }
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
};

const FilterOperatorDropDownMenu = (props: FilterOperatorDropDownMenuProps) => {
  const { operators } = props;
  const [op, setOP] = useState<NumberFilterOperation | StringFilterOperation | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
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
    <StyledDropDownMenu
      title={title}
      open={open}
      anchor={anchor}
      handleClose={handleClose}
      handleToggle={handleToggle}
    >
      { operators.map(op => {
        return (
          <MenuItem onClick={(event: React.MouseEvent) => { 
            setOP(op);
            setTitle(getOperatorDisplayText(op));
            handleClose(event);
          }}>
            <LabelBase label={getOperatorDisplayText(op)} classes={{ root: { color: WHITE80, fontSize: '0.875rem' } }}/>
          </MenuItem>
        );
      })}
    </StyledDropDownMenu>
  );
};

const GenericDropDownMenu = (props: GenericDropDownMenuProps) => {
  const { title, children, disabled } = props;
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
    <StyledDropDownMenu
      title={title}
      open={open}
      anchor={anchor}
      disabled={disabled}
      handleClose={handleClose}
      handleToggle={handleToggle}
    >
      {children}
    </StyledDropDownMenu>
  );
};

export {
  StyledDropDownMenu,
  FilterDropDownMenu,
  FilterOperatorDropDownMenu,
  GenericDropDownMenu
}