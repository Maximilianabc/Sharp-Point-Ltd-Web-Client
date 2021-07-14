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
  Typography,
  FormLabel
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {
  genRandomHex,
  getComparator,
  ROBOTO_LIGHT,
  ROBOTO_REGULAR,
  stableSort,
  WHITE60,
} from '../Util';
import { useEffect } from 'react';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { isLabelBase, LabelBase } from './Label';

interface StyledTableheadProps {
  classes: any,
  headerCells: any[],
  order: 'asc' | 'desc',
  orderBy: string,
  onClickSelectAll?: (event: React.ChangeEvent) => void,
  onRequestSort: (event: React.MouseEvent, property: any) => void,
  numSelected?: number
}

interface StyledTableToolbarProps {
  title?: string,
  numSelected?: number
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

interface LabelColumnProps {
  labels: any[],
  content: (string | undefined)[],
  classes?: any
}

interface LabelRowProps {
  labels: any[],
  content: (string | undefined)[],
  classes?: any
}

interface LabelTableProps {
  title?: string,
  children: JSX.Element[],
  classes?: ClassNameMap<'container'|'title'>
}

interface DataTableHeaderProps {
  classes?: any
  labels: LabelBase[],
  order: 'asc' | 'desc',
  orderBy: string,
  onRequestSort: (event: React.MouseEvent, property: any) => void
}

interface DataTableProps {
  data: any,
  title?: string,
  headLabels: LabelBase[],
  addPageControl: boolean
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

const useStylesToolbar = makeStyles((theme) => ({
  root: {
    color: 'white',
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
  icon: {
    color: 'white'
  }
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
        [classes.highlight]: numSelected && numSelected > 0,
      })}
    >
      {numSelected && numSelected > 0 ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
      )}
      {numSelected && numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon className={classes.icon}/>
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
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
    fontSize: '1rem'
  },
  cellNeg: {
    color: rgb(255, 40, 0).alpha(1).string(),
    fontSize: '1rem',
    fontWeight: ROBOTO_REGULAR
  },
  cellPos: {
    color: rgb(0, 255, 0).alpha(0.6).string(),
    fontSize: '1rem'
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

const useStyleLabel = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    marginRight: '1rem'
  }
}));

const LabelColumn = (props: LabelColumnProps) => {
  const labelRoot = useStyleLabel();
  const { labels, content, classes } = props;
  return (
    <div className={classes?.column}>
      {labels.map((lbl, index) => {
        const n = lbl !== undefined && content[index] !== undefined
          ? +(content[index]!.toString().replace(/\,/gi,'').replace(' HKD', ''))
          : NaN;
        const normal = lbl.colorMode === 'normal';
        const revert = lbl.colorMode === 'revert';
        return (
          <div id={lbl.id} className={labelRoot.root}>
            <FormLabel className={classes?.label}>{lbl.label}</FormLabel>
            <FormLabel
              className={clsx(classes?.content, {
                [classes?.negative]: !isNaN(n) && ((n < 0 && normal) || (n > 0 && revert)),
                [classes?.positive]: !isNaN(n) && ((n > 0 && normal) || (n < 0 && revert)),
              })}
            >{content[index] ?? '?'}</FormLabel>
          </div>
        );
      })}
    </div>
  );
};

const useStyleLabelHorizontal = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    marginRight: '1rem'
  }
}));

const LabelRow = (props: LabelRowProps) => {
  const { labels, content, classes } = props;
  const labelRoot = useStyleLabelHorizontal();
  return (
    <div className={classes?.row}>
      {labels.map((lbl, index) => {
        const n = lbl !== undefined && content[index] !== undefined
          ? +(content[index]!.toString().replace(/\,/gi,'').replace(' HKD', ''))
          : NaN;
        const normal = lbl.colorMode === 'normal';
        const revert = lbl.colorMode === 'revert';
        return (
          <div id={lbl.id} className={labelRoot.root}>
            <FormLabel className={classes?.label}>{lbl.label}</FormLabel>
            <FormLabel
              className={clsx(classes?.content, {
                [classes?.negative]: !isNaN(n) && ((n < 0 && normal) || (n > 0 && revert)),
                [classes?.positive]: !isNaN(n) && ((n > 0 && normal) || (n < 0 && revert)),
              })}
            >{content[index] ?? '?'}</FormLabel>
          </div>
        );
      })}
    </div>
  );
}

const useStylesLabelTable = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row'
  }
}));

const LabelTable = (props: LabelTableProps) => {
  const { title, children, classes } = props;
  const tableRoot = useStylesLabelTable();
  return (
    <div className={classes?.container}>
      {title ? <Typography className={classes?.title}>{title}</Typography> : null}
      <div className={tableRoot.root}>
        {children}
      </div>
    </div>
  );
};

const useStyleDataTableHeader = makeStyles((theme) => ({
  cell: {
    color: WHITE60,
    fontSize: '1.25rem',
    fontWeight: ROBOTO_LIGHT,
    padding: '0 0.5rem 0 0.5rem'
  },
  label: {
    color: WHITE60,
    fontSize: '1.25rem',
    fontWeight: ROBOTO_LIGHT,
  },
  icon: {
    '& path': {
      fill: 'white'
    }
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

const DataTableHeader = (props: DataTableHeaderProps) => {
  const {
    labels,
    order,
    orderBy,
    onRequestSort
  } = props;
  const classes = useStyleDataTableHeader();
  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {labels.map((lbl, index) => {
          if (isLabelBase(lbl)) {

          }
          return (
            <TableCell
              className={classes.cell}
              align={lbl.align}
              key={genRandomHex(16)}
            >
              <TableSortLabel
                active={orderBy === lbl.id}
                direction={orderBy === lbl.id ? order : 'asc'}
                onClick={createSortHandler(lbl.id)}
                classes={{
                  active: classes.icon,
                  icon: classes.icon
                }}
              >
                {isLabelBase(lbl) ? <FormLabel className={classes.label}>{lbl.label}</FormLabel> : lbl}
                {orderBy === lbl.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const useStyleDataTable = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    backgroundColor: '#282c34'
  },
  toolBar: {
    color: 'white'
  },
  container: {
    
  },
  table: {
    
  },
  row: {
    
  },
  cell: {
    color: rgb(255, 255, 255).alpha(0.6).string(),
    fontSize: '1rem'
  },
  cellNeg: {
    color: rgb(255, 40, 0).alpha(1).string(),
    fontSize: '1rem',
    fontWeight: ROBOTO_REGULAR
  },
  cellPos: {
    color: rgb(0, 255, 0).alpha(0.6).string(),
    fontSize: '1rem'
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

const DataTable = (props: DataTableProps) => {
  const {
    data,
    title,
    headLabels,
    addPageControl
  } = props;
  const classes = useStyleDataTable();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt((event?.target as HTMLInputElement)?.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Paper className={classes.paper} elevation={0}>
        <StyledTableToolbar title={title}/>
        <TableContainer className={classes.container}>
          <Table
            //className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <DataTableHeader
              classes={classes}
              labels={headLabels}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      //className={classes.row}
                      tabIndex={-1}
                      key={genRandomHex(16)}
                    >
                      {Object.entries(row).map((key: [string, any], index) => {
                        const n = key !== undefined && key[1] !== undefined
                                ? +(key[1].toString().replace(/\,/gi,'').replace(' HKD', ''))
                                : NaN;
                        const normal = headLabels[index].colorMode === 'normal';
                        const revert = headLabels[index].colorMode === 'reverse';
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
        {addPageControl 
          ?
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
          : null
        }
      </Paper>
    </div>
  );
};

export {
  StyledTablehead,
  StyledTableToolbar,
  StyledTable,
  StyledVerticalTable,
  LabelColumn,
  LabelRow,
  LabelTable,
  DataTable
}
