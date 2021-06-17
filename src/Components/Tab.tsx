import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Fragment } from 'react';

interface DefaultTabPanelProps {
  children?: React.ReactNode;
  value: number,
  index: number
}

const DefaultTabPanel = (props: DefaultTabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography><Fragment>{children}</Fragment></Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const ScrollableTabsButtonAuto = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Summary" {...a11yProps(0)} />
          <Tab label="Positions" {...a11yProps(1)} />
          <Tab label="Orders" {...a11yProps(2)} />
          <Tab label="Cash" {...a11yProps(3)} />
          <Tab label="Clear Trade" {...a11yProps(4)} />
          <Tab label="Ref. Fx Rate" {...a11yProps(5)} />
          <Tab label="Trade Blotter" {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <DefaultTabPanel value={value} index={0}>
        Summary
      </DefaultTabPanel>
      <DefaultTabPanel value={value} index={1}>
        Positions
      </DefaultTabPanel>
      <DefaultTabPanel value={value} index={2}>
        Orders
      </DefaultTabPanel>
      <DefaultTabPanel value={value} index={3}>
        Cash
      </DefaultTabPanel>
      <DefaultTabPanel value={value} index={4}>
        Clear Trade
      </DefaultTabPanel>
      <DefaultTabPanel value={value} index={5}>
        Ref. Fx Rate
      </DefaultTabPanel>
      <DefaultTabPanel value={value} index={6}>
        Trade Blotter
      </DefaultTabPanel>
    </div>
  );
}

export {
  DefaultTabPanel,
  ScrollableTabsButtonAuto
}
