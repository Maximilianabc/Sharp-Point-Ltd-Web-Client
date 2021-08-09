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
import { getConditionTypeNumber, getValidTypeNumber, operations, UserState, WHITE40, WHITE5, WHITE60, WHITE80 } from "../Util";
import Color, { rgb } from 'color';
import {
  StyledDropDownMenu,
  FormInputField,
  FormNumericUpDown
} from "./";
import { TooltipIconButton } from "./Icon";
import { LabelBase } from "./Label";
import { GenericDropDownMenu } from "./Dropdown";
import { CheckBoxField } from "./InputField";

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
  checkbox: {
    '& label:disabled': {
      color: WHITE40
    }
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
    margin: '0.5rem 0.25rem 0.5rem 0.25rem',
    color: 'white',
    fontSize: '1.25rem'
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
  checked: {},
  dropdownLabel: {
    '&$disabled': {
      color: WHITE40
    }
  }
}));

const StyledPopoverForm = (props: StyledPopoverFormProps) => {
  const classes = useStyles();
  const accNo = useSelector((state: UserState) => state.accName);
  const token = useSelector((state: UserState) => state.token);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [newAccNo, setNewAccNo] = useState(accNo);
  const [Id, setId] = useState('');
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(0);
  const [date, setDate] = useState<Date | null>();
  const [condition, setCondition] = useState<'Normal'|'Enchanced Stop'|'OCO'|'Bull & Bear'|'Time To Send'|'Trade Booking'|''>('');
  const [validity, setValidity] = useState<'Today'|'FaK'|'FoK'|'GTC'|'Date'|''>('');
  const [stopTriggerType, setStopTriggerType] = useState<'Stop Limit'|'Stop Market'|'Up Trigger Limit'|'Down Trigger Limit'|''>('');
  const [enhancedBuySell, setEnhancedBuySell] = useState<'Buy'|'Sell'|''>('');
  const [openAfterAdd, setOpenAfterAdd] = useState<'success'|'failed'|''>('');

  const handleClickAway = (event: React.MouseEvent<EventTarget>) => {
    setBackdropOpen(false);
  };

  const handleToggle = (event: React.MouseEvent<EventTarget>) => {
    setBackdropOpen(!backdropOpen);
  };

  const sendOrder = (event: React.MouseEvent<EventTarget>, buySell: 'buy' | 'sell') => {
    const payload = {
      accNo: newAccNo,
      prodCode: Id,
      qty: qty,
      buySell: buySell === 'buy' ? 'B' : 'S',
      price: price,
      sessionToken: token,
      condType: getConditionTypeNumber(condition),
      validType: getValidTypeNumber(validity)
    };
    operations('order', 'add', payload, undefined, undefined).then(data => {
      if (data !== undefined) {
        if (data.data.errorMsg === "No Error") {
          setOpenAfterAdd('success');
          console.log('add success');
        } else {
          setOpenAfterAdd('failed');
        }
      }
    });
  };

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
              <FormInputField
                label="Account Name"
                variant="standard"
                onChange={(event: React.ChangeEvent) => setNewAccNo((event?.target as HTMLInputElement)?.value)}
              />
              <FormInputField
                label="Id"
                variant="standard"
                onChange={(event: React.ChangeEvent) => setId((event?.target as HTMLInputElement)?.value)}
              />
              <FormNumericUpDown
                label="Price"
                disable={condition === "Enchanced Stop" || stopTriggerType === "Stop Market"}
                onChange={(event: React.ChangeEvent) => setPrice(+(event?.target as HTMLInputElement)?.value)}
              />
              <FormNumericUpDown
                label="Quantity"
                onChange={(event: React.ChangeEvent) => setQty(+(event?.target as HTMLInputElement)?.value)}
              />
              <div className={classes.checkboxDiv}>
                <CheckBoxField
                  label="AO"
                  className={classes.checkbox}
                  control={<Checkbox classes={{ colorSecondary: classes.checkboxHover }} style={{ color: WHITE60 }}/>}
                  disabled={validity !== "" && validity !== "Today"}
                />
                <CheckBoxField
                  label="Market"
                  control={<Checkbox classes={{ colorSecondary: classes.checkboxHover }} style={{ color: WHITE60 }}/>}
                  disabled={validity !== "" && validity !== "Today"}
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
                  <div>
                    <GenericDropDownMenu title={validity === "" ? "Validity" : validity}>
                      <MenuItem onClick={(event: React.MouseEvent) => setValidity('Today')}>Today</MenuItem>
                      <MenuItem onClick={(event: React.MouseEvent) => setValidity('FaK')}>FaK</MenuItem>
                      <MenuItem onClick={(event: React.MouseEvent) => setValidity('FoK')}>FoK</MenuItem>
                      <MenuItem onClick={(event: React.MouseEvent) => setValidity('GTC')}>GTC</MenuItem>
                      <MenuItem onClick={(event: React.MouseEvent) => setValidity('Date')}>Date</MenuItem>
                    </GenericDropDownMenu>
                    <CheckBoxField
                      control={<Checkbox classes={{ colorSecondary: classes.checkboxHover }} style={{ color: WHITE60 }}/>}
                      label="Stop/Trigger Limit"
                      labelPlacement="end"
                      disabled={validity === "FaK" || validity === "FoK"}
                    />
                    <GenericDropDownMenu title={stopTriggerType === "" ? "Stop/Trigger Limit" : stopTriggerType} disabled={validity === "FaK" || validity === "FoK"}>
                      <MenuItem onClick={(event: React.MouseEvent) => setStopTriggerType('Stop Limit')}>Stop Limit</MenuItem>
                      <MenuItem onClick={(event: React.MouseEvent) => setStopTriggerType('Stop Market')}>Stop Market</MenuItem>
                      <MenuItem onClick={(event: React.MouseEvent) => setStopTriggerType('Up Trigger Limit')}>Up Trigger Limit</MenuItem>
                      <MenuItem onClick={(event: React.MouseEvent) => setStopTriggerType('Down Trigger Limit')}>Down Trigger Limit</MenuItem>
                    </GenericDropDownMenu>
                  </div>
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
                    <div style={{ display: 'flex', flexDirection: 'row' }} >
                      <FormNumericUpDown label="Level"/>
                      <FormNumericUpDown label="Tolerance"/>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel
                          classes={{ label: classes.checkboxLabel }}
                          control={<Checkbox style={{ color: 'white' }}/>}
                          label="Trailing Stop"
                          labelPlacement="end"/>
                        <FormNumericUpDown label="Step" />
                    </div>
                  </div>
                : null
              }
              <FormInputField label="Ref" variant="standard"/>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant="contained"
                  className={classes.button}
                  style={{ backgroundColor: 'rgba(0, 176, 255, 0.8)' }}
                  onClick={(event: React.MouseEvent) => sendOrder(event, 'buy')}
                >
                  BUY
                </Button>
                <Button
                  variant="contained"
                  className={classes.button}
                  style={{ backgroundColor: 'rgba(255, 187, 0, 0.8)' }}
                  onClick={(event: React.MouseEvent) => sendOrder(event, 'sell')}
                >
                  SELL
                </Button>
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