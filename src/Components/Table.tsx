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

interface StyledVerticalTableProps {
  data: any,
  title: string,
  headerCells: any[]
}

interface TableColumnProps {
  data: [any, any]
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
    onClickSelectAll,
    onRequestSort,
    numSelected,
    numRow
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
              key={cell.id}
              align={cell.align}
              sortDirection={orderBy === cell.id ? order : 'asc'}
            >
              <TableSortLabel
                classes={{
                  root: labelClasses.root,
                  active: labelClasses.active
                }}
                active={orderBy === cell.id}
                direction={orderBy === cell.id ? order : 'asc'}
                onClick={createSortHandler(cell.id)}
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
    backgroundColor: 'transparent'
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
    font: '1rem roboto',
    paddingLeft: '0.3rem',
    paddingRight: '0.3rem'
  },
  cellNeg: {
    color: rgb(255, 0, 0).alpha(0.6).string(),
    font: '1rem roboto',
    paddingLeft: '0.3rem',
    paddingRight: '0.3rem'
  },
  cellPos: {
    color: rgb(0, 255, 0).alpha(0.6).string(),
    font: '1rem roboto',
    paddingLeft: '0.3rem',
    paddingRight: '0.3rem'
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
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      className={classes.row}
                      onClick={(event: React.MouseEvent<HTMLTableRowElement>) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      {Object.entries(row).map((key: [string, any], index) => {
                        return (
                          <TableCell
                          component={index === 0 ? "th" : undefined}
                          scope={index === 0 ? "row" : undefined}
                          padding={index === 0 ? "none" : undefined}
                          className={clsx(classes.cell, {
                            [classes.cellNeg]: !isNaN(+key[1]) && +key[1] < 0,
                            [classes.cellPos]: !isNaN(+key[1]) && +key[1] > 0
                          })}
                          align={index === 0 ? "left" : "right"}
                          id={`${labelId}-${key[0]}`}
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

const TableColumn = (props: TableColumnProps) => {
  const { data } = props;
  return (
    <TableRow>
      <TableCell>{data[0]}</TableCell>
      <TableCell>{data[1]}</TableCell>
    </TableRow>
  );
};

const StyledVerticalTable = (props: StyledVerticalTableProps) => {
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
  const [columnsPerPage, setColumnsPerPage] = useState(3);
  const emptyColumns = columnsPerPage - Math.min(columnsPerPage, data.length - page * columnsPerPage);
  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  return (
    <div>
    <TableContainer className={classes.container}>
      <Table
        className={classes.table}
        aria-labelledby="tableTitle"
        size="medium"
        aria-label="enhanced table"
      >
        <TableHead>
          <TableBody>
            {stableSort(data, getComparator(order, orderBy))
              .slice(page * columnsPerPage, page * columnsPerPage + columnsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    className={classes.row}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {/*<TableCell padding="checkbox" className={classes.cell}>
                      <Checkbox
                        className={classes.cell}
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      /}
                      </TableCell>*/}
                    {Object.entries(row).map((key: [string, any], index) => {
                      return (
                        <TableCell
                        component={index === 0 ? "th" : undefined}
                        scope={index === 0 ? "row" : undefined}
                        padding={index === 0 ? "none" : undefined}
                        className={clsx(classes.cell, {
                          [classes.cellNeg]: !isNaN(+key[1]) && +key[1] < 0,
                          [classes.cellPos]: !isNaN(+key[1]) && +key[1] > 0
                        })}
                        align={index === 0 ? "left" : "right"}
                        id={`${labelId}-${key[0]}`}
                        >
                          {key[1]}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                );
              })}
            {emptyColumns > 0 && (
              <TableRow style={{ height: 53 * emptyColumns }}/>
            )}
          </TableBody>
        </TableHead>
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
