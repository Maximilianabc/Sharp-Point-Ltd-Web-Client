import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox, 
  Fade,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow
} from '@material-ui/core';
import { useDispatch,useSelector } from 'react-redux';
import {
  DefaultAppbar,
  DefaultDrawer,
  StyledTablehead,
  StyledTableToolbar
} from '../Components';
import { useHistory } from 'react-router-dom';
import { 
  getComparator,
  stableSort,
  postRequest,
  setAccountBalanaceAction,
  setAccountOrderAction,
  setAccountPositionAction,
  setAccountSummaryAction,
  wsAddress
} from '../Util';

const headCells = [
  { id: 'id', align: 'left', label: 'ID' },
  { id: 'name', align: 'right', label: 'Name' },
  { id: 'prev', align: 'right', label: 'Prev.' },
  { id: 'day-long', align: 'right', label: 'Day Long' },
  { id: 'day-short', align: 'right', label: 'Day Short' },
  { id: 'net', align: 'right', label: 'Net' },
  { id: 'market-price', align: 'right', label: 'Mkt.Prc' },
  { id: 'profit-loss', align: 'right', label: 'P/L' },
  { id: 'prev-close', align: 'right', label: 'Prv Close' },
  { id: 'avg-net-opt-val', align: 'right', label: 'Av.Net Opt.Val' },
  { id: 'ref-exchange-rate', align: 'right', label: 'Ref. Fx Rate' },
  { id: 'contract', align: 'right', label: 'Contract' }
];

const createData = (id, optName, prev, daylong, dayshort, net, mkt, pl, prevClose, optVal, fx, contract) => {
  return { id, optName, prev, daylong, dayshort, net, mkt, pl, prevClose, optVal, fx, contract }
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const StyledTable = (props) => {
  const { positions } = props;
  const classes = useStyles();
  const token = useSelector(state => state.sessionToken);
  const userId = useSelector(state => state.userId);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidemenuopened, setSideMenuOpened] = useState(false);

  const handleDrawerOpen = () => {
    setSideMenuOpened(true);
  };
  const handleDrawerClose = () => {
    setSideMenuOpened(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleClickSelectAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = positions.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, positions.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <DefaultAppbar
        title="Dashboard"
        sidemenuopened={sidemenuopened}
        handleDrawerOpen={handleDrawerOpen}
      />
      <DefaultDrawer
        sidemenuopened={sidemenuopened}
        handleDrawerClose={handleDrawerClose}
      />
      <Paper className={classes.paper}>
        <StyledTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <StyledTablehead
              classes={classes}
              headerCells={headCells}
              order={order}
              orderBy={orderBy}
              onClickSelectAll={handleClickSelectAll}
              onRequestSort={handleRequestSort}
              numSelected={selected.length}
              numRow={positions.length}
            />
            <TableBody>
              {stableSort(positions, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.optName}</TableCell>
                      <TableCell align="right">{row.prev}</TableCell>
                      <TableCell align="right">{row.daylong}</TableCell>
                      <TableCell align="right">{row.dayshort}</TableCell>
                      <TableCell align="right">{row.net}</TableCell>
                      <TableCell align="right">{row.mkt}</TableCell>
                      <TableCell align="right">{row.pl}</TableCell>
                      <TableCell align="right">{row.prevClose}</TableCell>
                      <TableCell align="right">{row.optVal}</TableCell>
                      <TableCell align="right">{row.fx}</TableCell>
                      <TableCell align="right">{row.contract}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={positions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
};

const positionsToRows = (positions) => {
  
}

const ClientWS = (props) => {
  const { onReceivePush } = props;

  const token = useSelector(state => state.sessionToken);
  const accNo = useSelector(state => state.accNo);
  const positions = useSelector(state => state.position);
  const address = `${wsAddress}${token}`;
  const dispatch = useDispatch();
  const history = useHistory();
  const ws = useRef(null);

  useEffect(() => {
      ws.current = new WebSocket(address);
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify({
          "dataMask" : 15,
          "event" : "subscribe",
          "accNo" : "*"
        }));
        console.log("ws opened");
      }
      ws.current.onclose = () => console.log("ws closed");
      return () => {
          //ws.current.close();
      };
  }, []);

  useEffect(() => {
      if (!ws.current) return;
      ws.current.onmessage = e => {
          handlePushMessage(JSON.parse(e.data));
          return false;
      };
  }, []);

  const handlePushMessage = (message) => {
    console.log(message);
    if (message.dataMask === undefined) return;
    const payload = {
      sessionToken: token,
      targetAccNo: accNo
    };
    let op = '';
    switch (message.dataMask) {
      case 1:
        op = 'Summary';
        break;
      case 2:
        op = 'Balance';
        break;
      case 4:
        op = 'Position';
        break;
      case 8:
        op = 'Order';
        break;
      default:
        console.log(`unknown data mask ${message.dataMask}`);
        break;
    };
    postRequest(`/account/account${op}`, payload).then(data => {
      if (data.result_code === "40011") {
        ws.current.send(JSON.stringify({
          "dataMask" : 15,
          "event" : "release"
        }));
        ws.current.close();
        console.log('session expired.');
        history.push('/');
        return;
      }
      console.log(data.data);
      switch (message.dataMask) {
        case 1:
          dispatch(setAccountSummaryAction(data.data));
          break;
        case 2:
          dispatch(setAccountBalanaceAction(data.data));
          break;
        case 4:
          dispatch(setAccountPositionAction(data.data));
          onReceivePush(data.data.recordData);
          break;
        case 8:
          dispatch(setAccountOrderAction(data.data));
          break;
        default:
          console.log(`unknown data mask ${message.dataMask}`);
          break;
      };
    });
  };

  return null;
};

const Orders = (props) => {
  const token = useSelector(state => state.sessionToken);
  const userId = useSelector(state => state.userId);
  const [positions, setPositions] = useState([]);

  const positionsToRows = (positions) => {
    let p = [];
    if (positions !== undefined) {
      console.log(positions);
      Array.prototype.forEach.call(positions, pos => {
        p.push(createData(
          pos.prodCode,
          '', // TODO name?
          `${pos.psQty}@${pos.previousAvg}`,
          `${pos.longQty}@${pos.longAvg}`,
          `${pos.shortQty}@${pos.shortAvg}`,
          `${pos.netQty}@${pos.netAvg}`,
          pos.mktPrice,
          pos.profitLoss,
          pos.closeQty, // ?
          pos.totalAmt, //?
          '',
          ''  
        ));
      });
    }
    return p;
  };

  const onReceivePush = (positions) => {
    setPositions(positionsToRows(positions));
  };

  return (
    <div>
      <ClientWS onReceivePush={onReceivePush} />
      <Fade in={true}>
        <StyledTable positions={positions}/>     
      </Fade>
    </div>
  );
};

export {
  Orders
}
