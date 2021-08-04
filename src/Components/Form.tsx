import { 
  Button,
  Checkbox,
  ClickAwayListener, 
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  makeStyles, 
  MenuItem, 
  Paper, 
  Popover,
  TextField,
  Typography
 } from "@material-ui/core";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { UserState, WHITE5, WHITE60, WHITE80 } from "../Util";
import Color, { rgb } from 'color';
import {
  StyledDropDownMenu,
  FormInputField,
  FormNumericUpDown
} from "./";
import { TooltipIconButton } from "./Icon";
import { LabelBase } from "./Label";
import { GenericDropDownMenu } from "./Dropdown";

interface StyledPopoverFormProps {

}

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  paper: {
    backgroundColor: '#282c34',
    minWidth: '20vw',
    minHeight: '30vh',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem'
  },
  popover: {
    color: WHITE80,
    backgroundColor: 'rgba(40, 44, 52, 0.5)'
  },
  checkboxDiv: {
    width: '50%',
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  checkboxHover: {
    '&:hover': {
      backgroundColor: WHITE5
    }
  },
  button: {
    width: '50%',
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  formControl: {
    display: 'flex',
    flexDirection: 'column'
  },
  checkboxLabel: {
    color: WHITE80
  }
}));

const StyledPopoverForm = (props: StyledPopoverFormProps) => {
  const classes = useStyles();
  const token = useSelector((state: UserState) => state.token);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [date, setDate] = useState<Date | null>();

  const handleClickAway = (event: React.MouseEvent<EventTarget>) => {
    setBackdropOpen(false);
  }

  const handleToggle = (event: React.MouseEvent<EventTarget>) => {
    setBackdropOpen(!backdropOpen);
  }

  return (
    <div className={classes.root}>
      <TooltipIconButton
        title="Add Order"
        name="ADD"
        onClick={handleToggle}
      />
      <Popover
        className={classes.popover}
        open={backdropOpen} 
        anchorReference="anchorPosition"
        anchorPosition={{ top: window.screen.height / 2, left: window.screen.width / 2 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={0} className={classes.paper}>
            <FormControl id="order-form" className={classes.formControl}>
              <FormInputField label="Account Name" variant="standard"/>
              <FormInputField label="Id" variant="standard"/>
              <FormNumericUpDown label="Price"/>
              <FormNumericUpDown label="Quantity"/>
              <div className={classes.checkboxDiv}>
                <FormControlLabel
                  label="AO"
                  control={<Checkbox classes={{ colorSecondary: classes.checkboxHover }} style={{ color: WHITE60 }}/>}
                  classes={{ label: classes.checkboxLabel }}
                />
                <FormControlLabel
                  label="Market"
                  control={<Checkbox classes={{ colorSecondary: classes.checkboxHover }} style={{ color: WHITE60 }}/>}
                  classes={{ label: classes.checkboxLabel }}
                />
              </div>
              <GenericDropDownMenu title="Condition">
                <MenuItem>Normal</MenuItem>
                <MenuItem>Enchanced Stop</MenuItem>
                <MenuItem>Bull & Bear</MenuItem>
                <MenuItem>Time To Send</MenuItem>
                <MenuItem>Trade Booking</MenuItem>
              </GenericDropDownMenu>
              <GenericDropDownMenu title="Validity">
                <MenuItem>Today</MenuItem>
                <MenuItem>FaK</MenuItem>
                <MenuItem>FoK</MenuItem>
                <MenuItem>GTC</MenuItem>
                <MenuItem>Date</MenuItem>
              </GenericDropDownMenu>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button variant="contained" className={classes.button} style={{ margin: '0 0.25rem 0 0.25rem' }}>BUY</Button>
                <Button variant="contained"className={classes.button} style={{ margin: '0 0.25rem 0 0.25rem' }}>SELL</Button>
              </div>
            </FormControl>
          </Paper>
        </ClickAwayListener>        
      </Popover>
    </div>
  )
};

export {
  StyledPopoverForm
}