import React, { ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  TableSortLabel,
  Tooltip,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {
  getComparator,
  stableSort,
} from '../Util';

interface StyledTableheadProps {
  classes: any,
  headerCells: any[],
  order: 'asc' | 'desc',
  orderBy: string,
  onClickSelectAll: (event: React.ChangeEvent) => void,
  onRequestSort: (event: React.MouseEvent, property: any) => void,
  numSelected: number,
  numRow: number
}

interface StyledTableToolbarProps {
  title: string,
  numSelected: number
}

interface StyledTableProps {
  data: any,
  title: string,
  headerCells: any[]
}

const StyledTablehead = (props: StyledTableheadProps) => {
  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    props.onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox 
            indeterminate={props.numSelected > 0 && props.numSelected < props.numRow}
            checked={props.numRow > 0 && props.numSelected === props.numRow}
            onChange={props.onClickSelectAll}
          />
        </TableCell>
        {props.headerCells.map((cell: any) => (
            <TableCell
              key={cell.id}
              align={cell.align}
              sortDirection={props.orderBy === cell.id ? props.order : 'asc'}
            >
              <TableSortLabel
                active={props.orderBy === cell.id}
                direction={props.orderBy === cell.id ? props.order : 'asc'}
                onClick={createSortHandler(cell.id)}
              >
                {cell.label}
                {props.orderBy === cell.id ? (
                  <span className={props.classes.visuallyHidden}>
                    {props.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

StyledTablehead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onClickSelectAll: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  numRow: PropTypes.number.isRequired,
};

const useStylesToolbar = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const StyledTableToolbar = (props: StyledTableToolbarProps) => {
  const classes = useStylesToolbar();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: props.numSelected > 0,
      })}
    >
      {props.numSelected > 0 ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          {props.numSelected} selected
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          {props.title}
        </Typography>
      )}
      {props.numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

StyledTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStylesTable = makeStyles((theme) => ({
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

const StyledTable = (props: StyledTableProps) => {
  const classes = useStylesTable();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleClickSelectAll = (event: React.ChangeEvent) => {
    if ((event?.target as HTMLInputElement)?.checked) {
      const newSelecteds = props.data.map((n: any) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event: React.MouseEvent<HTMLTableRowElement>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: any[] = [];

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
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt((event?.target as HTMLInputElement)?.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event: ChangeEvent, checked: boolean) => {
    setDense((event?.target as HTMLInputElement)?.checked);
  };
  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.data.length - page * rowsPerPage);

  return (
    <div>
      <Paper className={classes.paper}>
        <StyledTableToolbar
          numSelected={selected.length}
          title={props.title}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <StyledTablehead
              classes={classes}
              headerCells={props.headerCells}
              order={order}
              orderBy={orderBy}
              onClickSelectAll={handleClickSelectAll}
              onRequestSort={handleRequestSort}
              numSelected={selected.length}
              numRow={props.data.length}
            />
            <TableBody>
              {stableSort(props.data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event: React.MouseEvent<HTMLTableRowElement>) => handleClick(event, row.name)}
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
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">{row.prev}</TableCell>
                      <TableCell align="right">{row.dayLong}</TableCell>
                      <TableCell align="right">{row.dayShort}</TableCell>
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
          count={props.data.length}
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

export {
  StyledTablehead,
  StyledTableToolbar,
  StyledTable
}
