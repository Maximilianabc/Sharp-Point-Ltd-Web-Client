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
  Collapse,
  Box,
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
  WHITE5,
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
import { TooltipIconButton, IconProps, isTooltipIconButton, NamedIconButton } from './Icon';

interface StyledTableToolbarProps {
  title?: string,
  numSelected?: number,
  children?: JSX.Element | JSX.Element[]
}

interface DataTableHeaderProps {
  labels: LabelBaseProps[],
  order: 'asc' | 'desc',
  orderBy: string,
  onRequestSort: (event: React.MouseEvent, property: any) => void,
  iconsLength: number
}

interface DataTableProps {
  data: LabelBaseProps[][],
  title?: string,
  headLabels: LabelBaseProps[],
  rowCollapsible?: boolean,
  addPageControl?: boolean,
  removeToolBar?: boolean,
  openArray?: boolean[],
  icons?: (IconProps | undefined)[],
  containerClasses?: any,
  setOpenArray?: any
}

interface DataRowProps {
  row: LabelBaseProps[],
  index: number,
  open?: boolean
  collapsible?: boolean,
  icons?: (IconProps | undefined)[],
  classes?: any
}

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
    iconsLength
  } = props;
  const classes = useStyleDataTableHeader();
  const createSortHandler = (property?: string) => (event: React.MouseEvent) => {
    if (property === undefined) return;
    onRequestSort(event, property);
  };
  const indices = [...Array(iconsLength).keys()];

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
        {indices.map(i => {
          return (
            <TableCell className={classes.cell}/>
          )
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
    rowCollapsible,
    openArray,
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
              iconsLength={icons?.length ?? 0}
            />
            <TableBody key={genRandomHex(16)}>            
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <DataRow
                      row={row}
                      index={index}
                      icons={icons}
                      classes={classes}
                      collapsible={rowCollapsible}
                      open={openArray && openArray[index]}
                      key={genRandomHex(16)}
                    />
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }} key={genRandomHex(16)}/>
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
              key={genRandomHex(16)}
            />
          : null
        }
      </Paper>
  );
};

const useStlyeDataRow = makeStyles((theme) => ({
  root: {
    backgroundColor: 'inherit',
    '&:hover': {
      backgroundColor: WHITE5
    }
  },
  
}));

const DataRow = (props: DataRowProps) => {
  const { row, icons, classes, collapsible, open, index } = props;
  const rowClasses = useStlyeDataRow();
  return (
    <React.Fragment>
      <TableRow
        key={genRandomHex(16)}
        className={rowClasses.root}
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
        {icons && icons.length !== 0
          ? icons?.map(icon => {
              return (
                icon 
                ?
                  <TableCell className={classes.iconCell}>
                    {
                      isTooltipIconButton(icon)
                      ? 
                        <TooltipIconButton
                          title={icon.title}
                          name={icon.name}
                          size={icon.size}
                          buttonStyle={icon.buttonStyle}
                          otherProps={icon.otherProps}
                          classes={icon.classes}
                          onClick={icon.onClick}
                        />
                      :
                        <NamedIconButton 
                          name={icon.name}
                          size={icon.size}
                          buttonStyle={icon.buttonStyle}
                          otherProps={icon.otherProps}
                          onClick={icon.onClick}
                        />
                    }
                  </TableCell>
                : null
              );
            })
          : null
        }
      </TableRow>
      {collapsible && open
        ?
          <TableRow>
            <TableCell colSpan={row.length + (icons !== undefined ? icons.length : 0)}>
              <Collapse in={open}>
                <Box />
              </Collapse>
            </TableCell>
          </TableRow>
        : null
      }
    </React.Fragment>
  )
};

export {
  StyledTableToolbar,
  DataTable,
  DataRow
}
