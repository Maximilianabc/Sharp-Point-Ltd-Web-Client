import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Tabs,
  Tab,
  Typography
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

interface DefaultTabPanelProps {
  title?: string,
  children?: JSX.Element | never[],
  value: number,
  index: number,
  dir: string
}

interface TabControlProps {
  children: JSX.Element[]
}

const DefaultTabPanel = (props: DefaultTabPanelProps) => {
  const { title, children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      {...other}
    >
      {/*{(value === index && (
        <Box p={3}>
          <Typography><Fragment>{title}</Fragment></Typography>
        </Box>
      ))}*/}
      {children}
    </div>
  );
}

const useStylesTabControl = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  tabcontrol: {
    color: '#ffffff',
    backgroundColor: '#282C34',
    borderBottom: '2px solid rgba(255, 255, 255, 0.6)',
  },
  indicator: {
    backgroundColor: '#bb86fc'
  },
  tab: {
    fontSize: '1.5rem',
    fontWeight: 300,
    letterSpacing: '0.15rem',
    padding: '6px 24px'
  }
}));

const DefaultTabControl = (props: TabControlProps) => {
  const { children } = props;
  const classes = useStylesTabControl();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    console.log(value);
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Tabs
          classes={{ indicator: classes.indicator }}
          className={classes.tabcontrol}
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Summary" className={classes.tab}/>
          <Tab label="Positions" className={classes.tab}/>
          <Tab label="Orders" className={classes.tab}/>
          <Tab label="Cash" className={classes.tab}/>
          <Tab label="Clear Trade" className={classes.tab}/>
          <Tab label="Ref. Fx Rate" className={classes.tab}/>
          <Tab label="Trade Blotter" className={classes.tab}/>
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <DefaultTabPanel value={value} index={0} dir={theme.direction}>
          {children[0]}
        </DefaultTabPanel>
        <DefaultTabPanel value={value} index={1} dir={theme.direction}>     
          {children[1]}
        </DefaultTabPanel>
        <DefaultTabPanel value={value} index={2} dir={theme.direction}>
          {children[2]}
        </DefaultTabPanel>
        <DefaultTabPanel value={value} index={3} dir={theme.direction}>
          {children[3]}
        </DefaultTabPanel>
        <DefaultTabPanel value={value} index={4} dir={theme.direction}>
          
        </DefaultTabPanel>
        <DefaultTabPanel value={value} index={5} dir={theme.direction}>
          
        </DefaultTabPanel>
        <DefaultTabPanel value={value} index={6} dir={theme.direction}>
          
        </DefaultTabPanel>
      </SwipeableViews>
    </div>
  );
}

export {
  DefaultTabPanel,
  DefaultTabControl
}
