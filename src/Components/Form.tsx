import { 
  Button,
  Checkbox,
  ClickAwayListener, 
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles, 
  MenuItem,
  InputLabel,
  Paper, 
  Popover,
  Radio,
  RadioGroup,
  Select,
 } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  AccOrderRecord,
  FLEX_COLUMN_CLASSES,
  getConditionTypeNumber,
  getValidTypeNumber,
  LABEL_CLASSES,
  operations,
  OrderRecordRow,
  ROBOTO_SEMIBOLD,
  UserState,
  WHITE40,
  WHITE5,
  WHITE60,
  WHITE80
} from "../Util";
import {
  FormInputField,
  FormNumericUpDown
} from "./";
import { TooltipIconButton } from "./Icon";
import { CheckBoxField, WhiteDatePicker, WhiteSelectFormControl } from "./InputField";
import { Event, KeyboardArrowDown, Refresh } from "@material-ui/icons";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

interface StyledPopoverFormProps {
  refresh: () => void;
}

interface OrderFormProps {
  refresh: () => void,
  reset?: () => void,
  editContent?: OrderRecordRow
  open: boolean
}

const useStyles = makeStyles(theme => ({
  root: {
      flex: '1 1 10%'
  },
  paper: {
    backgroundColor: '#282c34',
    minWidth: '20vw',
    minHeight: '30vh',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    display: 'flex',
    flexDirection: 'column'
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
    margin: '0 0.5rem 0 0.5rem',
    display: 'flex',
    flexDirection: 'row'
  },
  checkboxHover: {
    '&:hover': {
      backgroundColor: WHITE5
    }
  },
  checkboxDisabled: {
    color: WHITE40
  },
  datePicker: {
    padding: '0 0.5rem 0 0.5rem'
  },
  button: {
    width: '50%',
    margin: '0.5rem 0.25rem 0.5rem 0.25rem',
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: ROBOTO_SEMIBOLD,
    borderRadius: '0.75rem',
    letterSpacing: '0.1rem'
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row'
  },
  select: {
    margin: '0.25rem 0.5rem 0.25rem 0.5rem',
    minWidth: '15rem'
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
  firstColumn: {
    ...FLEX_COLUMN_CLASSES,
    borderRight: `1px solid ${WHITE40}`,
    paddingRight: '1rem'
  },
  secondColumn: {
    ...FLEX_COLUMN_CLASSES,
    paddingLeft: '1rem'
  }
}));

const useStylesResult = makeStyles((theme) => ({
  label: {
    ...LABEL_CLASSES,
    color: WHITE80
  },
  paper: {
    backgroundColor: '#282c34',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    display: 'flex',
    flexDirection: 'column'
  },
}));

const StyledPopoverForm = (props: StyledPopoverFormProps) => {
  const classes = useStyles();
  const { refresh } = props;
  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleToggle = (event: React.MouseEvent<EventTarget>) => {
    setBackdropOpen(!backdropOpen);
  };

  return (
    <div className={classes.root}>
      <TooltipIconButton
        title="Add Order"
        name="ADD"
        onClick={handleToggle}
      />
      <OrderForm refresh={refresh} open={backdropOpen}/>
    </div>
  )
};

const OrderForm = (props: OrderFormProps) => {
  const { refresh, reset, editContent, open } = props;
  const isEdit = editContent !== undefined;

  const classes = useStyles();
  const resultClasses = useStylesResult();

  const accNo = useSelector((state: UserState) => state.accName);
  const token = useSelector((state: UserState) => state.token);

  const [newAccNo, setNewAccNo] = useState(accNo);
  const [Id, setId] = useState(editContent?.id ?? '');
  const [price, setPrice] = useState(editContent?.price ?? 0);
  const [qty, setQty] = useState(editContent?.qty ?? 1);
  const [date, setDate] = useState<Date | null>();
  const [condition, setCondition] = useState<'Normal'|'Enchanced Stop'|'OCO'|'Bull & Bear'|'Time To Send'|'Trade Booking'>('Normal');
  const [validity, setValidity] = useState<'Today'|'FaK'|'FoK'|'GTC'|'Date'>('Today');
  const [stopTriggerType, setStopTriggerType] = useState<''|'Stop Limit'|'Stop Market'|'Up Trigger Limit'|'Down Trigger Limit'>('');
  const [enhancedBuySell, setEnhancedBuySell] = useState<'Buy'|'Sell'|''>('');
  const [tPlusOne, setTPlusOne] = useState(false);
  const [result, setResult] = useState<'success'|'failed'|''>('');
  const [backdropOpen, setBackdropOpen] = useState(true);
  
  useEffect(() => {
    setBackdropOpen(open);
  }, [open]);

  const sendOrder = (event: React.MouseEvent<EventTarget>, buySell: 'buy' | 'sell') => {
    const payload = {
      accNo: newAccNo,
      prodCode: Id,
      qty: qty,
      buySell: buySell === 'buy' ? 'B' : 'S',
      options: +tPlusOne,
      priceInDec: price,
      sessionToken: token,
      condType: getConditionTypeNumber(condition),
      validType: getValidTypeNumber(validity)
    };
    operations('order', 'add', payload, undefined, undefined).then(data => {
      if (data !== undefined && data.data !== undefined) {
        if (data.data.errorMsg === "No Error") {
          setResult('success');
          refresh();
        } else {
          setResult('failed');
        }
      }
    });
  };

  const editOrder = (event: React.MouseEvent<EventTarget>, order: OrderRecordRow) => {
    const payload = {
      accNo: newAccNo,
      accOrderNo: +order.accOrderNo,
      prodCode: Id,
      buySell: order.buySell,
      // downLevelInDec
      // downPriceInDec
      extOrderNo: +order.orderNo,
      priceInDec: price,
      qty: qty,
      // schedTime
      sessionToken: token,
      // stopPriceInDec
      // upLevelInDec
      // upPriceInDec
      // validDate
    };
    operations('order', 'change', payload, undefined, undefined).then(data => {
      if (data !== undefined && data.data !== undefined) {
        if (data.data.errorMsg === "No Error") {
          setResult('success');
          refresh();
        } else {
          setResult('failed');
        }
      }
    });
  };

  const handleClickAway = (event: React.MouseEvent<EventTarget>) => {
    setBackdropOpen(false);
    setResult('');
    if (reset) {
      reset();
    }
  };

  return (
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
            <div className={classes.firstColumn}>
              <FormInputField
                label="Account Name"
                variant="standard"
                onChange={(event: React.ChangeEvent) => setNewAccNo((event?.target as HTMLInputElement)?.value)}
                defaultValue={isEdit ? editContent?.initiator : ""}
                disable={isEdit}
              />
              <FormInputField
                label="Id"
                variant="standard"
                onChange={(event: React.ChangeEvent) => setId((event?.target as HTMLInputElement)?.value)}
                defaultValue={isEdit ? editContent?.id : ""}
                disable={isEdit}
              />
              <FormNumericUpDown
                label="Price"
                defaultValue={+(editContent?.price ?? 0)}
                disable={condition === "Enchanced Stop" || stopTriggerType === "Stop Market"}
                onChange={(event: React.ChangeEvent) => setPrice(+(event?.target as HTMLInputElement)?.value)}
              />
              <div className={classes.checkboxDiv}>
                <CheckBoxField
                  label="AO"
                  className={classes.checkbox}
                  control={<Checkbox classes={{ colorSecondary: classes.checkboxHover }}
                  style={{ color: WHITE60 }}/>}
                  disabled={validity !== "Today" || stopTriggerType !== "" || isEdit}
                />
                <CheckBoxField
                  label="Market"
                  control={<Checkbox classes={{ colorSecondary: classes.checkboxHover, disabled: classes.checkboxDisabled }}
                  style={{ color: WHITE60 }}/>}
                  disabled={validity !== "Today" || stopTriggerType !== "" || isEdit}
                />
              </div>
              <FormNumericUpDown
                label="Quantity"
                defaultValue={+(editContent?.qty ?? 1)}
                onChange={(event: React.ChangeEvent) => setQty(+(event?.target as HTMLInputElement)?.value)}
              />
            </div>
            <div className={classes.secondColumn}>
              <WhiteSelectFormControl className={classes.select} disabled={isEdit}>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={condition as string}
                  IconComponent={(props) => <KeyboardArrowDown style={{ fontSize: 24, color: 'white' }} {...props}/>}
                  MenuProps={{ 
                    disablePortal: true,
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left"
                    },
                    getContentAnchorEl: null
                  }}
                >
                  <MenuItem value="Normal" onClick={(event: React.MouseEvent) => setCondition('Normal')}>Normal</MenuItem>
                  <MenuItem value="Enchanced Stop" onClick={(event: React.MouseEvent) => setCondition('Enchanced Stop')}>Enchanced Stop</MenuItem>
                  <MenuItem value="Bull & Bear" onClick={(event: React.MouseEvent) => setCondition('Bull & Bear')}>Bull & Bear</MenuItem>
                  <MenuItem value="Time To Send" onClick={(event: React.MouseEvent) => setCondition('Time To Send')}>Time To Send</MenuItem>
                  <MenuItem value="Trade Booking" onClick={(event: React.MouseEvent) => setCondition('Trade Booking')}>Trade Booking</MenuItem>
                </Select>
              </WhiteSelectFormControl>
              {condition === "Normal" 
                ?
                  <WhiteSelectFormControl className={classes.select} disabled={isEdit}>
                    <InputLabel>Validity</InputLabel>
                    <Select
                      value={validity as string}
                      IconComponent={(props) => <KeyboardArrowDown style={{ fontSize: 24, color: 'white' }} {...props}/>}
                      MenuProps={{ 
                        disablePortal: true,
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }}
                    >
                      <MenuItem value="Today" onClick={(event: React.MouseEvent) => setValidity('Today')}>Today</MenuItem>
                      <MenuItem value="FaK" onClick={(event: React.MouseEvent) => { setValidity('FaK'); setStopTriggerType(''); }}>FaK</MenuItem>
                      <MenuItem value="FoK" onClick={(event: React.MouseEvent) => { setValidity('FoK'); setStopTriggerType(''); }}>FoK</MenuItem>
                      <MenuItem value="GTC" onClick={(event: React.MouseEvent) => { setValidity('GTC'); setStopTriggerType(''); }}>GTC</MenuItem>
                      <MenuItem value="Date" onClick={(event: React.MouseEvent) => { setValidity('Date'); setStopTriggerType(''); }}>Date</MenuItem>
                    </Select>
                  </WhiteSelectFormControl>
                : null
              }
              {condition === "Normal" && validity === "Date"
                ?
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <WhiteDatePicker
                      disabled={isEdit}
                      disableToolbar
                      disablePast
                      variant="inline"
                      format="dd/MM/yyyy"
                      value={date}
                      onChange={setDate}
                      keyboardIcon={<Event style={{ fontSize: 24, color: 'white' }}/>}
                      className={classes.datePicker}
                    />
                  </MuiPickersUtilsProvider>
                : null
              }
              {condition === "Normal"
                ?
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <WhiteSelectFormControl className={classes.select} disabled={validity === "FaK" || validity === "FoK" || isEdit}>
                      <InputLabel>Stop/Trigger Limit</InputLabel>
                      <Select
                        value={stopTriggerType as string}
                        IconComponent={(props) => <KeyboardArrowDown style={{ fontSize: 24, color: 'white' }} {...props}/>}
                        MenuProps={{ 
                          disablePortal: true,
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                          },
                          getContentAnchorEl: null
                        }}
                      >
                        <MenuItem value="Stop Limit" onClick={(event: React.MouseEvent) => setStopTriggerType('Stop Limit')}>Stop Limit</MenuItem>
                        <MenuItem value="Stop Market" onClick={(event: React.MouseEvent) => setStopTriggerType('Stop Market')}>Stop Market</MenuItem>
                        <MenuItem value="Up Trigger Limit" onClick={(event: React.MouseEvent) => setStopTriggerType('Up Trigger Limit')}>Up Trigger Limit</MenuItem>
                        <MenuItem value="Down Trigger Limit" onClick={(event: React.MouseEvent) => setStopTriggerType('Down Trigger Limit')}>Down Trigger Limit</MenuItem>
                      </Select>
                    </WhiteSelectFormControl>
                    <FormNumericUpDown label="Price" disable={stopTriggerType === "" || isEdit}></FormNumericUpDown>
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
              <CheckBoxField
                label="T+1"
                className={classes.checkbox}
                control={<Checkbox classes={{ colorSecondary: classes.checkboxHover }} style={{ color: WHITE60 }}/>}
                onChange={(event: React.ChangeEvent<{}>, checked: boolean) => setTPlusOne(checked)}
              />
            </div>
          </FormControl>
          <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              variant="contained"
              className={classes.button}
              style={{ backgroundColor: 'rgba(0, 176, 255, 0.8)' }}
              onClick={(event: React.MouseEvent) => isEdit && editContent !== undefined ? editOrder(event, editContent) : sendOrder(event, 'buy')}
              disabled={isEdit && editContent?.buySell === 'S'}
            >
              BUY
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              style={{ backgroundColor: 'rgba(255, 187, 0, 0.8)' }}
              onClick={(event: React.MouseEvent) => isEdit && editContent !== undefined ? editOrder(event, editContent) : sendOrder(event, 'sell')}
              disabled={isEdit && editContent?.buySell === 'B'}
            >
              SELL
            </Button>
          </FormControl>
          {result !== '' ? <FormLabel className={resultClasses.label}>{isEdit ? 'Edit' : 'Add'} order {result}</FormLabel> : null}
        </Paper>
      </ClickAwayListener>
    </Popover>
  );
}

export {
  StyledPopoverForm,
  OrderForm
}