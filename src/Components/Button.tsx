import { Button, createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { ROBOTO_SEMILIGHT } from "../Util";

interface CardActionButtonProps {
  label: string,
  icon?: any,
  iconPosition?: 'start' | 'end'
}

const CardActionButtonTheme = createMuiTheme({
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