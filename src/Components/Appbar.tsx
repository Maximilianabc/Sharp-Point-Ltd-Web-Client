import clsx from 'clsx';
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { useIntl } from 'react-intl';
import { genRandomHex, locales, messages } from '../Util';
import companyLogo from '../logo.svg';
import { useHistory } from 'react-router';

const drawerWidth: number = 240;
const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: '1rem',
  },
  logoutButton: {
    marginRight: 0,
    marginLeft: 'auto'
  },
  hide: {
    display: 'none',
  }
}));

interface AppbarProps {
  title: string,
  sidemenuopened: boolean,
  handleDrawerOpen: () => void,
  onChangeLang: (locale: string) => void
}

const DefaultAppbar = (props: AppbarProps) => {
  const { onChangeLang } = props;
  const classes = useStyles();
  const intl = useIntl();
  const history = useHistory();

  const getLangButtonName = (label: string) => {
    switch (label) {
      case '繁':
        return locales.CHINESE_TRADITIONAL;
      case '简':
        return locales.CHINESE_SIMPLIFIED;
      case 'Eng':
        return locales.ENGLISH;
      default:
        throw new Error('Unknown Language');
    }
  }

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.sidemenuopened,
      })}
      key={genRandomHex(8)}
    >
      <Toolbar key={genRandomHex(8)}>
        <IconButton
          color="inherit"
          aria-label="sidemenuopened drawer"
          onClick={props.handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, props.sidemenuopened && classes.hide)}
          key={genRandomHex(8)}
        >
          <MenuRoundedIcon key={genRandomHex(8)}/>
        </IconButton>
        <img src={companyLogo} alt="company logo" style={{ height: '64px', width: '64px' }} key={genRandomHex(8)}/>
        <Typography variant="h6" noWrap>
          {props.title}
        </Typography>
        <div className={classes.logoutButton}>
          {['繁', '简', 'Eng'].map(text => {
            return (
              <Button
                color="inherit"
                classes={{ disableElevation: 'true' }}
                style={{ fontSize: '1rem' }}
                onClick={() => onChangeLang(getLangButtonName(text))}
                key={genRandomHex(8)}
              >
                {text}
              </Button>
            );
          })}
          <Button
            color="inherit"
            classes={{ disableElevation: 'true' }}
            style={{ fontSize: '1rem' }}
            onClick={() => history.push('/logout')}
            key={genRandomHex(8)}
          >
            {messages[intl.locale].logout}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export {
  DefaultAppbar
}
