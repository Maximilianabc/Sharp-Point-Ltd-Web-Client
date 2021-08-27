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
  Typography,
  FormHelperText,
 } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useIntl } from 'react-intl';
import { useSelector } from "react-redux";
import {
  AccOrderRecord,
  CARD_BUTTON_CLASSES,
  CARD_TITLE_CLASSES,
  dateFilters,
  Filter,
  FLEX_COLUMN_CLASSES,
  genRandomHex,
  getConditionTypeNumber,
  getOperatorDisplayText,
  getValidTypeNumber,
  LABEL_CLASSES,
  messages,
  NumberFilterOperator,
  numFilters,
  operations,
  OrderHistoryRecordRow,
  OrderRecordRow,
  ROBOTO_SEMIBOLD,
  StringFilterOperator,
  stringFilters,
  UserState,
  WHITE40,
  WHITE5,
  WHITE60,
  WHITE80,
  WorkingOrderRecordRow
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
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

interface OrderFormWithButtonProps {
  refresh: () => void;
}

interface OrderFormProps {
  refresh: () => void,
  reset?: () => void,
  editContent?: OrderRecordRow
  resetToggle?: () => void,
  open: boolean
}

interface FilterFormProps {
  applyFilters: (filters?: Filter[]) => void,
  handleClickAway: (event: React.MouseEvent<EventTarget>) => void,
  handleToggle: () => void,
  backdropOpen: boolean
}

const useStyles = makeStyles(theme => ({
  root: {
      flex: '1 1 10%'
  },
  title: {
    ...CARD_TITLE_CLASSES,
    marginBottom: 0,
    fontSize: '1.25rem'
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

const OrderForm = (props: OrderFormProps) => {
  const { refresh, reset, resetToggle, editContent, open } = props;
  const isEdit = editContent !== undefined;

  const classes = useStyles();
  const resultClasses = useStylesResult();

  const accNo = useSelector((state: UserState) => state.accName);
  const token = useSelector((state: UserState) => state.token);
  const mktDataLong = useSelector((state: UserState) => state.marketDataLong);

  const [newAccNo, setNewAccNo] = useState(accNo);
  const [Id, setId] = useState(editContent?.id ?? '');
  const [price, setPrice] = useState(editContent?.price ?? (Id === '' ? 0 : mktDataLong?.[Id]?.bidPrice1 ?? 0));
  const [qty, setQty] = useState(editContent?.qty ?? 1);
  const [date, setDate] = useState<Date | null>();
  const [condition, setCondition] = useState<'Normal'|'Enchanced Stop'|'OCO'|'Bull & Bear'|'Time To Send'|'Trade Booking'>('Normal');
  const [validity, setValidity] = useState<'Today'|'FaK'|'FoK'|'GTC'|'Date'>('Today');
  const [stopTriggerType, setStopTriggerType] = useState<''|'Stop Limit'|'Stop Market'|'Up Trigger Limit'|'Down Trigger Limit'>('');
  const [enhancedBuySell, setEnhancedBuySell] = useState<'Buy'|'Sell'|''>('');
  const [tPlusOne, setTPlusOne] = useState(false);
  const [result, setResult] = useState<'success'|'failed'|''>('');
  const [failedReason, setFailedReason] = useState(undefined);
  const [fieldMissing, setFieldMissing] = useState<('acc'|'id')[]>([]);
  const [backdropOpen, setBackdropOpen] = useState(true);

  useEffect(() => {
    setBackdropOpen(open);
    if (!open) {
      setId('');
      setPrice(0);
      setQty(1);
      setDate(null);
      setCondition('Normal');
      setValidity('Today');
      setEnhancedBuySell('');
      setTPlusOne(false);
      setResult('');
      setFailedReason(undefined);
      setFieldMissing([]);
    }
  }, [open]);

  const sendOrder = (event: React.MouseEvent<EventTarget>, buySell: 'buy' | 'sell') => {
    let missingFields: ('acc'|'id')[] = [];
    if (newAccNo === '') {
      missingFields.push('acc');
    }
    if (Id === '') {
      missingFields.push('id');
    }
    if (missingFields.length !== 0) {
      setFieldMissing(missingFields);
      return;
    }
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
          setFailedReason(undefined);
          refresh();
        } else {
          setResult('failed');
          setFailedReason(data.data.errorMsg);
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
      extOrderNo: order.orderNo,
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
          setFailedReason(data.data.errorMsg);
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
    if (resetToggle) {
      resetToggle();
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
        <Paper elevation={0} className={classes.paper} style={{ overflow: 'auto' }}>
          <Typography className={classes.title}>Orders</Typography>
          <FormControl id="order-form" className={classes.formControl}>
            <div className={classes.firstColumn}>
              <FormInputField
                label="Account Name"
                variant="standard"
                onChange={(event: React.ChangeEvent) => setNewAccNo((event?.target as HTMLInputElement)?.value)}
                defaultValue={accNo}
                disable={isEdit}
                require
                error={fieldMissing.findIndex(f => f === 'acc') >= 0}
                helperText={fieldMissing.findIndex(f => f === 'acc') >= 0 ? 'Account name required' : undefined}
              />
              <FormInputField
                label="Id"
                variant="standard"
                onChange={(event: React.ChangeEvent) => setId((event?.target as HTMLInputElement)?.value)}
                defaultValue={isEdit ? editContent?.id : ""}
                disable={isEdit}
                require
                error={fieldMissing.findIndex(f => f === 'id') >= 0}
                helperText={fieldMissing.findIndex(f => f === 'id') >= 0 ? 'Product ID required' : undefined}
              />
              <FormNumericUpDown
                label="Price"
                defaultValue={+(editContent?.price ?? (Id === '' ? 0 : mktDataLong?.[Id]?.bidPrice1 ?? 0))}
                min={0}
                disable={condition === "Enchanced Stop" || stopTriggerType === "Stop Market"}
                require
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
                require
                defaultValue={+(editContent?.qty ?? 1)}
                min={1}
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
          {result !== '' ? <FormLabel className={resultClasses.label}>{isEdit ? 'Edit' : 'Add'} order {result}{failedReason !== undefined ? `, reason: ${failedReason}` : ''}</FormLabel> : null}
        </Paper>
      </ClickAwayListener>
    </Popover>
  );
};

const useStyleFilterForm = makeStyles((theme) => ({
  control: {
    margin: '0.25rem'
  },
  button: {
    ...CARD_BUTTON_CLASSES,
    color: 'cornflowerblue',
    fontSize: '1.25rem',
    fontWeight: ROBOTO_SEMIBOLD
  },
  title: {
    ...CARD_TITLE_CLASSES,
    marginBottom: 0,
    fontSize: '1.25rem'
  }
}))

const FilterForm = (props: FilterFormProps) => {
  const { applyFilters, handleClickAway, handleToggle, backdropOpen } = props;
  const classes = useStyles();
  const formClasses = useStyleFilterForm();
  const intl = useIntl();

  const newFilter: Filter = { property: '', operator: '', value: { lower: '', upper: '' } };
  const [filters, setFilters] = useState<{[index: number]: Filter}>({0: newFilter});
  const [errorText, setErrorText] = useState<{[index: number]: error}>({});

  interface error {
    property?: string,
    operator?: string,
    lower?: string,
    upper?: string
  }

  const validateFilters = (): boolean => {
    setErrorText({});
    let err: {[index: number]: error} = errorText;
    Object.values(filters).map((f: Filter, index: number) => {
      if (f.property === '') {
        err = {...err, [index]: { ...err[index], property: 'missing' }};
      } else {
        delete err[index]?.property;
      }
      if (f.operator === '') {
        err = {...err, [index]: { ...err[index], operator: 'missing' }};
      } else {
        delete err[index]?.operator;
      }
      if (f.value.lower === '') {
        err = {...err, [index]: { ...err[index], lower: 'missing' }};
      } else if (f.property === 'price' && isNaN(+f.value.lower)) {
        err = {...err, [index]: { ...err[index], lower: 'is in invalid format' }};
      } else {
        delete err[index]?.lower;
      }
      if (f.operator === 'between') {
        if (f.value.upper === '') {
          err = {...err, [index]: { ...err[index], upper: 'missing' }};
        } else if (f.property === 'price' && isNaN(+f.value.upper)) {
          err = {...err, [index]: { ...err[index], upper: 'is in invalid format' }};
        } else {
          delete err[index]?.upper;
        }
      } else {
        delete err[index]?.upper;
      }
    });
    setErrorText(err);
    return Object.keys(err).length === 0;
  };

  const removeFilter = (index: number, {[index]: _, ...filters}) => filters;

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
        <Paper elevation={0} className={classes.paper} style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography className={formClasses.title}>Filter</Typography>
          <div>
          {
            [Object.keys(filters).map(index => {
              const filter = filters[+index];
              const isError = (err: error, item: keyof error) => err !== undefined && err[item] !== '' && err[item] !== undefined;

              return (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <WhiteSelectFormControl
                    required
                    className={formClasses.control}
                    style={{ minWidth: '5rem' }}
                    error={isError(errorText[+index], 'property')}
                    key={genRandomHex(8)}
                  >
                    <InputLabel key={genRandomHex(8)}>Item</InputLabel>
                    <Select
                      required
                      key={genRandomHex(8)}
                      value={filter.property === undefined ? '' : filter.property.toLowerCase()}
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
                      <MenuItem
                        value="id"
                        key={genRandomHex(8)}
                        onClick={(event: React.MouseEvent) => setFilters({...filters, [+index]: { ...filters[+index], property: 'id' }})}
                      >
                        ID
                      </MenuItem>
                      <MenuItem
                        value="price"
                        key={genRandomHex(8)}
                        onClick={(event: React.MouseEvent) => setFilters({...filters, [+index]: { ...filters[+index], property: 'price'}})}
                      >
                        Price
                      </MenuItem>
                      <MenuItem
                        value="time"
                        key={genRandomHex(8)}
                        onClick={(event: React.MouseEvent) => setFilters({...filters, [+index]: { ...filters[+index], property: 'time'}})}
                      >
                        Time
                      </MenuItem>
                    </Select>
                    {isError(errorText[+index], 'property') ? <FormHelperText key={genRandomHex(8)}>{`Item ${errorText[+index].property}`}</FormHelperText> : null}
                  </WhiteSelectFormControl>
                  <WhiteSelectFormControl
                    required
                    key={genRandomHex(8)}
                    className={formClasses.control}
                    style={{ minWidth: '15rem' }}
                    error={isError(errorText[+index], 'operator')}
                  >
                    <InputLabel key={genRandomHex(8)}>Operator</InputLabel>
                    <Select
                      required
                      key={genRandomHex(8)}
                      value={filter.operator === undefined ? '' : filter.operator}
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
                      {filter.property === "id"
                        ?
                          stringFilters.map(o => {
                            return (
                              <MenuItem
                                value={o}
                                style={{ minWidth: '30rem' }}
                                key={genRandomHex(8)}
                                onClick={(event: React.MouseEvent) => setFilters({...filters, [+index]: { ...filters[+index], operator: o}})}
                              >
                                {getOperatorDisplayText(o)}
                              </MenuItem>
                            );
                          })
                        : filter.property === "price"
                          ? 
                            numFilters.map(o => {
                              return (
                                <MenuItem
                                  value={o}
                                  style={{ minWidth: '30rem' }}
                                  key={genRandomHex(8)}
                                  onClick={(event: React.MouseEvent) => setFilters({...filters, [+index]: { ...filters[+index], operator: o}})}
                                >
                                  {getOperatorDisplayText(o)}
                                </MenuItem>
                              );
                            })
                          : filter.property === "time"
                            ?
                              dateFilters.map(o => {
                                return (
                                  <MenuItem
                                    value={o}
                                    style={{ minWidth: '30rem' }}
                                    key={genRandomHex(8)}
                                    onClick={(event: React.MouseEvent) => setFilters({...filters, [+index]: { ...filters[+index], operator: o}})}
                                  >
                                    {getOperatorDisplayText(o)}
                                  </MenuItem>
                                );
                              })
                            : null
                      }
                    </Select>
                    {isError(errorText[+index], 'operator') ? <FormHelperText>{`Operator ${errorText[+index].operator}`}</FormHelperText> : null}
                  </WhiteSelectFormControl>
                  <div style={{ display: 'flex', flexDirection: 'row', minWidth: '28rem', alignItems: 'flex-end' }}>
                    {filter.property !== 'time'
                      ?
                        <FormInputField
                          require
                          error={isError(errorText[+index], 'lower')}
                          label="Value"
                          type={filter.property === 'price' ? 'number' : undefined}
                          variant="standard"
                          defaultValue={filter.value.lower}
                          onChange={(event: React.ChangeEvent) => setFilters({
                            ...filters,
                            [+index]: {
                              ...filters[+index],
                              value: {
                                ...filters[+index].value,
                                lower: (event.target as HTMLInputElement).value
                              }
                            }
                          })}
                          helperText={isError(errorText[+index], 'lower') ? `Value ${errorText[+index].lower}` : undefined}
                        />
                      :
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <WhiteDatePicker
                            disableToolbar
                            disableFuture
                            variant="inline"
                            format="dd/MM/yyyy"
                            value={filter.value.lower === '' ? undefined : filter.value.lower}
                            onChange={(date: MaterialUiPickersDate) => setFilters({
                              ...filters,
                              [+index]: {
                                ...filters[+index],
                                value: {
                                  ...filters[+index].value,
                                  lower: date?.toString() ?? ''
                                }
                              }
                            })}
                            keyboardIcon={<Event style={{ fontSize: 24, color: 'white' }}/>}
                            className={classes.datePicker}
                            style={{ margin: '0.25rem 0.5rem 0.25rem 0.5rem' }}
                          />
                      </MuiPickersUtilsProvider>
                    }
                    <FormInputField
                      require
                      error={isError(errorText[+index], 'upper')}
                      style={{ display: filter.operator !== 'between' ? 'none' : 'inline-flex' }}
                      label="Value"
                      type={filter.property === 'price' ? 'number' : undefined}
                      variant="standard"
                      defaultValue={filter.value.upper}
                      onChange={(event: React.ChangeEvent) => setFilters({
                        ...filters,
                        [+index]: {
                          ...filters[+index],
                          value: {
                            ...filters[+index].value,
                            upper: (event.target as HTMLInputElement).value
                          }
                        }
                      })}
                      helperText={isError(errorText[+index], 'upper') ? `Value ${errorText[+index].upper}` : undefined}
                    />
                  </div>
                  <TooltipIconButton
                    name="ADD"
                    title="Add Filter"
                    key={genRandomHex(8)}
                    onClick={(event: React.MouseEvent) => setFilters({...filters, [+index + 1]: newFilter})}
                  />
                  <TooltipIconButton
                    name="DELETE"
                    title="Delete Filter"
                    key={genRandomHex(8)}
                    onClick={(event: React.MouseEvent) => {
                      if (Object.keys(filters).length === 1) {
                        return;
                      }
                      setFilters(removeFilter(+index, filters));
                    }}
                  />
                </div>
              );
            })]
          }
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', bottom: 0, left: '40%' }}>
            <Button
              className={formClasses.button}
              key={genRandomHex(8)}
              style={{ marginRight: '2rem '}}
              onClick={() => {
                if (!validateFilters()) {
                  return;
                }
                applyFilters(Object.values(filters));
                setErrorText({});
                handleToggle();
              }}>
                Apply
            </Button>
            <Button 
              className={formClasses.button}
              key={genRandomHex(8)}
              onClick={() => {
                setFilters({0: newFilter});
                setErrorText({});
                applyFilters();
              }}>
                Clear
            </Button>
          </div>
        </Paper>
      </ClickAwayListener>
    </Popover>
  )
};

export {
  OrderForm,
  FilterForm
}