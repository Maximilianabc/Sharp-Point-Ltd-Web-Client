import React, { useState } from 'react';
import clsx from 'clsx';
import { rgb } from 'color';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  TableSortLabel,
  Typography,
} from '@material-ui/core';
import {
  FLEX_ROW_CLASSES,
  genRandomHex,
  getComparator,
  LABEL_CONTENT_POSITIVE_CLASSES,
  ROBOTO_SEMIBOLD,
  stableSort,
  SVG_ICON_CLASSES,
  TABLE_CELL_CLASSES,
  TABLE_HEAD_CLASSES,
  TABLE_ROW_CLASSES,
  WHITE40,
  WHITE60,
  WHITE80
} from '../Util';
import {
  CompositeLabel,
  isCompositeLabel,
  isLabelBaseProps,
  isStackedLabel,
  LabelBase,
  LabelBaseProps,
  StackedLabel
} from './Label';
import { TooltipIconButton } from './Icon';

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
  numSelected?: number,
  children?: JSX.Element | JSX.Element[]
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

interface DataTableHeaderProps {
  labels: LabelBaseProps[],
  order: 'asc' | 'desc',
  orderBy: string,
  onRequestSort: (event: React.MouseEvent, property: any) => void,
  icons?: JSX.Element | JSX.Element[]
}

interface DataTableProps {
  data: LabelBaseProps[][],
  title?: string,
  headLabels: LabelBaseProps[],
  addPageControl: boolean,
  removeToolBar?: boolean,
  icons?: JSX.Element | JSX.Element[],
  containerClasses?: any
}

interface DataRowProps {
  row: LabelBaseProps[],
  icons?: JSX.Element | JSX.Element[],
  classes?: any
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
              {orderBy === cell.id ? 
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
               : null}
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
    padding: 0,
    marginBottom: '1rem',
    minHeight: 'fit-content'
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
    textAlign: 'left',
    fontSize: '1.75rem',
    fontWeight: ROBOTO_SEMIBOLD,
    color: WHITE80
  },
  icon: {
    color: 'white'
  }
}));

const StyledTableToolbar = (props: StyledTableToolbarProps) => {
  const {
    title,
    numSelected,
    children
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
        <Typography className={classes.title} id="tableTitle" component="div">
          {title}
        </Typography>
      )}
      {numSelected && numSelected > 0 ? (
        <TooltipIconButton title="Delete" name="DELETE"/>
      ) : 
        children
      }
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
    border: `1px solid ${WHITE60}`
  },
  table: {
    minWidth: 750
  },
  row: {
    
  },
  cell: {
    color: WHITE60,
    fontSize: '1rem'
  },
  cellNeg: {

  },
  cellPos: LABEL_CONTENT_POSITIVE_CLASSES,
  active: {},
  icon: {
    color: 'white'
  },
  pagination: {
    color: 'white'
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
    headerCells
  } = props;
  const classes = useStylesTable();
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
                            {i % 2 === 0 ? headerCells[loop].label : d[1]}
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

const useStyleDataTableHeader = makeStyles((theme) => ({
  root: TABLE_HEAD_CLASSES,
  row: TABLE_ROW_CLASSES,
  cell: {
    ...TABLE_CELL_CLASSES,
    color: WHITE60,
    fontSize: '1.25rem',
    borderBottom: `1px solid ${WHITE40}`
  },
  cellContainer: FLEX_ROW_CLASSES,
  icon: SVG_ICON_CLASSES,
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
    onRequestSort,
    icons
  } = props;
  const classes = useStyleDataTableHeader();
  const createSortHandler = (property?: string) => (event: React.MouseEvent) => {
    if (property === undefined) return;
    onRequestSort(event, property);
  };

  return (
    <TableHead className={classes.root}>
      <TableRow className={classes.row}>
        {labels.map((lbl, index) => {
          return (
            <TableCell
              className={classes.cell}
              align={lbl.align}
              key={genRandomHex(16)}
              classes={{
                stickyHeader: classes.cell
              }}
            >
              <div className={classes.cellContainer}>
                {
                  isCompositeLabel(lbl)
                  ? <CompositeLabel 
                      id={lbl.id}
                      label={lbl.label}
                      align={lbl.align}
                      colorMode={lbl.colorMode}
                      classes={lbl.classes}
                      subLabels={lbl.subLabels}
                    />
                  : isStackedLabel(lbl)
                    ? <StackedLabel classes={lbl.classes} otherLabels={lbl.otherLabels} />
                    : isLabelBaseProps(lbl)
                      ? <LabelBase label={lbl.label} colorMode={lbl.colorMode} classes={lbl.classes} icon={lbl.icon}/>
                      : null
                }
                <TableSortLabel
                  active={orderBy === lbl.id}
                  direction={orderBy === lbl.id ? order : 'asc'}
                  onClick={createSortHandler(lbl.id)}
                  classes={{
                    active: classes.icon,
                    icon: classes.icon
                  }}
                >               
                  {
                    orderBy === lbl.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </div>
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
    overflow: 'auto'
  },
  table: {
    backgroundColor: '#282c34',
    overflow: 'auto'
  },
  cell: {
    ...TABLE_CELL_CLASSES,
    color: WHITE80,
    padding: '0.5rem 1.5rem 0 0',
    border: 'none'
  },
  iconCell: {
    ...TABLE_CELL_CLASSES,
    padding: '0.5rem 1rem 0 0',
    border: 'none'
  },
  active: {},
  pagination: {
    color: 'white'
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
    addPageControl,
    removeToolBar,
    icons,
    containerClasses
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
    <Paper className={classes.paper} elevation={0} key={genRandomHex(16)}>
        { removeToolBar ? null :
          <StyledTableToolbar title={title} key={genRandomHex(16)}>
            <TooltipIconButton
              title="Filter list"
              name="FILTER"
              key={genRandomHex(16)}
            />
          </StyledTableToolbar>
        }
        <TableContainer className={clsx(classes.container, containerClasses)} key={genRandomHex(16)}>
          <Table
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
            stickyHeader
            classes={{
              stickyHeader: classes.table
            }}
            key={genRandomHex(16)}
          >
            <DataTableHeader
              labels={headLabels}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              key={genRandomHex(16)}
            />
            <Slide in={true} direction='left' key={genRandomHex(16)}>
              <TableBody key={genRandomHex(16)}>            
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <DataRow row={row} icons={icons} classes={classes} key={genRandomHex(16)}/>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }} key={genRandomHex(16)}/>
                )}   
              </TableBody>
            </Slide>
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
              key={genRandomHex(16)}
            />
          : null
        }
      </Paper>
  );
};

const DataRow = (props: DataRowProps) => {
  const { row, icons, classes } = props;
  return (
    <TableRow
      key={genRandomHex(16)}
      hover
    >
      {row.map((lbl, index) => {
        return (
          <TableCell
            component={index === 0 ? "th" : undefined}
            scope={index === 0 ? "row" : undefined}
            className={classes.cell}
            align={lbl.align}
            key={genRandomHex(16)}
          >
            {
              isCompositeLabel(lbl)
              ? <CompositeLabel 
                  id={lbl.id}
                  label={lbl.label}
                  align={lbl.align}
                  colorMode={lbl.colorMode}
                  icon={lbl.icon}
                  classes={{root: { ...lbl.classes?.root, marginRight: '1rem'}}}
                  subLabels={lbl.subLabels}
                />
              : isStackedLabel(lbl)
                ? <StackedLabel
                    classes={{root: { ...lbl.classes?.root, marginRight: '1rem'}}}
                    otherLabels={lbl.otherLabels}
                    icon={lbl.icon}
                  />
                : isLabelBaseProps(lbl)
                  ? <LabelBase 
                      label={lbl.label}
                      colorMode={lbl.colorMode}
                      classes={{root: { ...lbl.classes?.root, marginRight: '1rem'}}}
                      icon={lbl.icon}
                    />
                  : null
            }
          </TableCell>
        )
      })}
      {Array.isArray(icons) 
        ? icons?.map(icon => {
            return (
              (icon.props && Object.keys(icon.props).length !== 0) ?
              <TableCell className={classes.iconCell}>
                {icon}
              </TableCell>
              : null
            );
          })
        : <TableCell className={classes.iconCell}>{icons}</TableCell>
      }
    </TableRow>
  )
};

export {
  StyledTablehead,
  StyledTableToolbar,
  StyledTable,
  StyledVerticalTable,
  DataTable,
  DataRow
}
