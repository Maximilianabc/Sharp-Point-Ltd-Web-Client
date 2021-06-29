import { Button, FormControl, makeStyles, MenuItem, Paper, Popover } from "@material-ui/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserState } from "../Util";
import Color, { rgb } from 'color';
import { StyledDropDownMenu } from "./Dropdown";

interface StyledPopoverFormProps {
  id: string
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: rgb(40, 44, 52).alpha(0.5).string(),
    color: '#ffffff'
  },
  paper: {
    marginRight: theme.spacing(2),
    minWidth: '30vw',
    minHeight: '30vh'
  }
}));

const StyledPopoverForm = (props: StyledPopoverFormProps) => {
  const classes = useStyles();
  const token = useSelector((state: UserState) => state.token);
  const [backdropOpen, setBackdropOpen] = useState(false);

  return (
    <div>
      <Button
        id="add-order-button"
        variant="contained"
        onClick={(event: React.MouseEvent) => setBackdropOpen(!backdropOpen)}
      >
        ADD
      </Button>
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
        onClick={(event: React.MouseEvent) => setBackdropOpen(false)}
      >
        <Paper elevation={0} className={classes.paper}>
          <FormControl id="order-form">
            <StyledDropDownMenu>
              <MenuItem>abc</MenuItem>
              <MenuItem>def</MenuItem>
            </StyledDropDownMenu>
          </FormControl>
        </Paper>
      </Popover>
    </div>
  )
};

export {
  StyledPopoverForm
}