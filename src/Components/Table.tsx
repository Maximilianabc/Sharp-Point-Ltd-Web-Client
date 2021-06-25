import React, { ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Color, { rgb } from 'color';
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
  genRandomHex,
  getComparator,
  stableSort,
} from '../Util';
import { useEffect } from 'react';

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

interface StyledVerticalTableProps {
  data: any,
  title: string,
  headerCells: any[]
}

const useStylesTablehead = makeStyles((theme) => ({
  root :{
    '&:hover': {
      color: rgb(255, 255, 255).alpha(0.8).string(),
    },
    '&$active': {
      color: rgb(255, 255, 255).string(),
    }
  },
  active: {
    color: rgb(255, 255, 255).string()
  }
}));

const StyledTablehead = (props: StyledTableheadProps) => {
  const {
    classes,
    headerCells,
    order,
    orderBy,
    onRequestSort,
  } = props;

  const labelClasses = useStylesTablehead();
  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headerCells.map((cell: any) => (
            <TableCell
              className={classes.cell}
              align={cell.align}
              sortDirection={orderBy === cell.id ? order : 'asc'}
              key={genRandomHex(16)}
            >
              <TableSortLabel
                classes={{
                  root: labelClasses.root,
                  active: labelClasses.active
                }}
                active={orderBy === cell.id}
                direction={orderBy === cell.id ? order : 'asc'}
                onClick={createSortHandler(cell.id)}
                key={genRandomHex(16)}
              >
                {cell.label}
                {orderBy === cell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  const {
    title,
    numSelected
  } = props;
  const classes = useStylesToolbar();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
      )}
      {numSelected > 0 ? (
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
    backgroundColor: '#282c34'
  },
  container: {
    border: '1px solid rgba(255, 255, 255, 0.6)'
  },
  table: {
    minWidth: 750
  },
  row: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.4)'
  },
  cell: {
    color: rgb(255, 255, 255).alpha(0.6).string(),
    font: '1rem roboto'
  },
  cellNeg: {
    color: rgb(255, 40, 0).alpha(1).string(),
    font: '1rem roboto',
    fontWeight: 500
  },
  cellPos: {
    color: rgb(0, 255, 0).alpha(0.6).string(),
    font: '1rem roboto'
  },
  active: {},
  icon: {
    color: rgb(255, 255, 255).string()
  },
  pagination: {
    color: '#FFFFFF'
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
  const {
    data,
    title,
    headerCells
  } = props;
  const classes = useStylesTable();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleClickSelectAll = (event: React.ChangeEvent) => {
    if ((event?.target as HTMLInputElement)?.checked) {
      const newSelecteds = data.map((n: any) => n.name);
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
  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <div>
      <Paper className={classes.paper} elevation={0}>
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <StyledTablehead
              classes={classes}
              headerCells={headerCells}
              order={order}
              orderBy={orderBy}
              onClickSelectAll={handleClickSelectAll}
              onRequestSort={handleRequestSort}
              numSelected={selected.length}
              numRow={data.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  return (
                    <TableRow
                      hover
                      className={classes.row}
                      onClick={(event: React.MouseEvent<HTMLTableRowElement>) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      key={genRandomHex(16)}
                    >
                      {Object.entries(row).map((key: [string, any], index) => {
                        const n = key !== undefined && key[1] !== undefined
                                ? +(key[1].toString().replace(/\,/gi,'').replace(' HKD', ''))
                                : NaN;
                        const normal = headerCells[index].colorMode === 'normal';
                        const revert = headerCells[index].colorMode === 'revert';
                        return (
                          <TableCell
                            component={index === 0 ? "th" : undefined}
                            scope={index === 0 ? "row" : undefined}
                            className={clsx(classes.cell, {
                              [classes.cellNeg]: !isNaN(n) && ((n < 0 && normal) || (n > 0 && revert)),
                              [classes.cellPos]: !isNaN(n) && ((n > 0 && normal) || (n < 0 && revert)),
                            })}
                            align={index === 0 ? "left" : "right"}
                            id={`${key[0]}-${index}`}
                            key={genRandomHex(16)}
                          >
                            {key[1]}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}/>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const StyledVerticalTable = (props: StyledVerticalTableProps) => {
  const {
    data,
    title,
    headerCells
  } = props;
  const classes = useStylesTable();
  const [selected, setSelected] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [columnsPerPage, setColumnsPerPage] = useState(3);
  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const dataEntries: [string, any][] = Object.entries(data);

  return (
    <div>
    <TableContainer className={classes.container}>
      <Table
        className={classes.table}
        aria-labelledby="tableTitle"
        size="medium"
        aria-label="enhanced table"
      >
        <TableHead />
        <TableBody>
          {
            [...Array(Math.ceil(dataEntries.length / 3))].map((_, index) => {
              return (
                <TableRow key={genRandomHex(16)}>
                  {
                    [...Array(6).keys()].map((_, i) => {
                      const loop = 3 * index + Math.floor(i / 2);
                      const d = dataEntries[loop];
                      const n = d !== undefined && d[1] !== undefined
                              ? +(d[1].toString().replace(/\,/gi,'').replace(' HKD', ''))
                              : NaN;
                      return (
                        d 
                        ? <TableCell 
                            id={i % 2 === 0 ? `${headerCells[loop].id}-item` : `${headerCells[loop].id}-value`}
                            align="left"
                            className={i % 2 === 0 ? classes.cell : clsx(classes.cell, {
                              [classes.cellNeg]: !isNaN(n) && n < 0,
                              [classes.cellPos]: !isNaN(n) && n > 0,
                            })}
                            style={i % 2 === 0 ? undefined : {borderRight: '1px solid rgba(255, 255, 255, 0.6)'}}
                            key={genRandomHex(16)}
                          >
                            {i % 2 == 0 ? headerCells[loop].label : d[1]}
                          </TableCell>
                        : null
                      );
                    })
                  }
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  )
};

export {
  StyledTablehead,
  StyledTableToolbar,
  StyledTable,
  StyledVerticalTable
}
