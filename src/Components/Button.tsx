import { Button, MuiThemeProvider } from "@material-ui/core";
import { createTheme } from '@material-ui/core/styles';
import { ROBOTO_SEMILIGHT } from "../Util";

interface CardActionButtonProps {
  label: string,
  icon?: any,
  iconPosition?: 'start' | 'end'
}

const CardActionButtonTheme = createTheme({
  typography: {
    button: {
      backgroundColor: 'transparent',
      color: 'white',
      fontStyle: 'normal',
      fontSize: '1.25rem',
      fontWeight: ROBOTO_SEMILIGHT
    },
  }
});

const CardActionButton = (props: CardActionButtonProps) => {
  const { label, icon, iconPosition } = props;
  return (
    <MuiThemeProvider theme={CardActionButtonTheme}>
      <Button
        startIcon={(iconPosition !== undefined && iconPosition === 'start') ? icon : null}
        endIcon={(iconPosition !== undefined && iconPosition === 'end') ? icon : null}
      >
        {label}
      </Button>
    </MuiThemeProvider>
  );
};

export {
  CardActionButton
}