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
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserState } from "../Util";
import Color, { rgb } from 'color';
import {
  StyledDropDownMenu,
  FormInputField,
  FormNumericUpDown
} from "./";
import { TooltipIconButton } from "./Icon";

interface StyledPopoverFormProps {
  id: string
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: rgb(40, 44, 52).alpha(0.5).string(),
    color: '#ffffff',
  },
  paper: {
    marginRight: theme.spacing(2),
    minWidth: '20vw',
    minHeight: '30vh'
  },
  checkbox: {
    width: '50%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  button: {
    width: '50%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  formControl: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const StyledPopoverForm = (props: StyledPopoverFormProps) => {
  const classes = useStyles();
  const token = useSelector((state: UserState) => state.token);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleClickAway = (event: React.MouseEvent<EventTarget>) => {
    setBackdropOpen(false);
  }

  return (
    <div>
      <TooltipIconButton
        title="Add Order"
        name="ADD"
        onClick={(event: React.MouseEvent) => setBackdropOpen(!backdropOpen)}
      />
      <Popover
        className={classes.root}
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
              <div className={classes.checkbox}>
                <FormControlLabel
                  label="AO"
                  control={<Checkbox/>}
                />
                <FormControlLabel
                  label="Market"
                  control={<Checkbox/>}
                />
              </div>
              <StyledDropDownMenu title="Condition">
                <MenuItem>Normal</MenuItem>
                <MenuItem>Enchanced Stop</MenuItem>
                <MenuItem>Bull & Bear</MenuItem>
                <MenuItem>Time To Send</MenuItem>
                <MenuItem>Trade Booking</MenuItem>
              </StyledDropDownMenu>
              <Grid container direction="column" alignContent="flex-start">
                <Typography>Validity</Typography>
                <StyledDropDownMenu title="">
                  <MenuItem>Today</MenuItem>
                  <MenuItem>FaK</MenuItem>
                  <MenuItem>FoK</MenuItem>
                  <MenuItem>GTC</MenuItem>
                  <MenuItem>Date</MenuItem>
                </StyledDropDownMenu>
                <FormInputField 
                  label="Date"
                  variant="standard"
                  type="date"
                  labelProps={{ shrink: true }}
                />
              </Grid>
              <div>
                <Button variant="contained" className={classes.button}>BUY</Button>
                <Button variant="contained"className={classes.button}>SELL</Button>
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