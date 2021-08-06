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
  Radio,
  RadioGroup,
  TextField,
  Typography
 } from "@material-ui/core";
import React, { useRef, useState } from "react";
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
  },
  radio: {
    '&$checked': {
      color: WHITE60
    }
  },
  checked: {}
}));

const StyledPopoverForm = (props: StyledPopoverFormProps) => {
  const classes = useStyles();
  const token = useSelector((state: UserState) => state.token);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [date, setDate] = useState<Date | null>();
  const [condition, setCondition] = useState<'Normal'|'Enchanced Stop'|'Bull & Bear'|'Time To Send'|'Trade Booking'|''>('');
  const [validity, setValidity] = useState<'Today'|'FaK'|'FoK'|'GTC'|'Date'|''>('');
  const [enhancedBuySell, setEnhancedBuySell] = useState<'Buy'|'Sell'|''>('');

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
              <GenericDropDownMenu title={condition === "" ? "Condition" : condition}>
                <MenuItem onClick={(event: React.MouseEvent) => setCondition('Normal')}>Normal</MenuItem>
                <MenuItem onClick={(event: React.MouseEvent) => setCondition('Enchanced Stop')}>Enchanced Stop</MenuItem>
                <MenuItem onClick={(event: React.MouseEvent) => setCondition('Bull & Bear')}>Bull & Bear</MenuItem>
                <MenuItem onClick={(event: React.MouseEvent) => setCondition('Time To Send')}>Time To Send</MenuItem>
                <MenuItem onClick={(event: React.MouseEvent) => setCondition('Trade Booking')}>Trade Booking</MenuItem>
              </GenericDropDownMenu>
              {condition === "Normal" 
                ?
                  <GenericDropDownMenu title={validity === "" ? "Validity" : validity}>
                    <MenuItem onClick={(event: React.MouseEvent) => setValidity('Today')}>Today</MenuItem>
                    <MenuItem onClick={(event: React.MouseEvent) => setValidity('FaK')}>FaK</MenuItem>
                    <MenuItem onClick={(event: React.MouseEvent) => setValidity('FoK')}>FoK</MenuItem>
                    <MenuItem onClick={(event: React.MouseEvent) => setValidity('GTC')}>GTC</MenuItem>
                    <MenuItem onClick={(event: React.MouseEvent) => setValidity('Date')}>Date</MenuItem>
                  </GenericDropDownMenu>
                : null
              }
              {condition === "Enchanced Stop"
                ?
                  <div>
                    <RadioGroup row value={enhancedBuySell} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEnhancedBuySell(enhancedBuySell)}>
                      <FormControlLabel
                        value="Buy"
                        control={
                          <Radio
                            style={{ color: WHITE60 }}
                            classes={{ root: classes.radio, checked: classes.checked }}
                          />
                        }
                        label="Buy"
                        labelPlacement="end"
                        classes={{ label: classes.checkboxLabel }}
                      />
                      <FormControlLabel
                        value="Sell"
                        control={
                          <Radio
                            style={{ color: WHITE60 }}
                            classes={{ root: classes.radio, checked: classes.checked }}
                          />
                        }
                        label="Sell"
                        labelPlacement="end"
                        classes={{ label: classes.checkboxLabel }}
                      />
                    </RadioGroup>
                    <FormNumericUpDown label="Level"/>
                    <FormNumericUpDown label="Toler"/>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <FormControlLabel control={<Checkbox />} label="Trailing Stop" labelPlacement="end"/>
                        <FormNumericUpDown label="Step" />
                    </div>
                  </div>
                : null
              }
              <FormInputField label="Ref" variant="standard"/>
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