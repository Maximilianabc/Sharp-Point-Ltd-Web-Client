import React, { useState } from 'react';
import clsx from 'clsx';
import { lighten } from '@material-ui/core/styles';
import {
  makeStyles,
  Paper,
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
  BoxProps,
  CardProps,
} from '@material-ui/core';
import {
  FLEX_ROW_CLASSES,
  genRandomHex,
  ROBOTO_SEMIBOLD,
  SVG_ICON_CLASSES,
  TABLE_CELL_CLASSES,
  TABLE_HEAD_CLASSES,
  TABLE_ROW_CLASSES,
  WHITE5,
  WHITE40,
  WHITE60,
  WHITE80,
  messages
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
import { TooltipIconButton, IconProps, isTooltipIconButton, NamedIconButton, IconTypes } from './Icon';
import { useIntl } from 'react-intl';

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
  setOpenArray?: any,
  collapsibleContents?: React.ReactElement<CardProps|BoxProps>[]
}

interface DataRowProps {
  row: LabelBaseProps[],
  index: number,
  open?: boolean,
  openArray?: boolean[],
  collapsible?: boolean,
  icons?: (IconProps | undefined)[],
  classes?: any,
  collapsibleContent?: React.ReactElement<CardProps|BoxProps>
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
    flex: '1 1 80%',
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
    <TableHead className={classes.root} key={genRandomHex(8)}>
      <TableRow className={classes.row} key={genRandomHex(8)}>
        {labels.map((lbl, index) => {
          return (
            <TableCell
              className={classes.cell}
              align={lbl.align}
              key={genRandomHex(8)}
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
                      key={genRandomHex(8)}
                    />
                  : isStackedLabel(lbl)
                    ? <StackedLabel
                        classes={lbl.classes}
                        otherLabels={lbl.otherLabels}
                        key={genRandomHex(8)}
                      />
                    : isLabelBaseProps(lbl)
                      ? <LabelBase
                          label={lbl.label}
                          colorMode={lbl.colorMode}
                          classes={lbl.classes}
                          icon={lbl.icon}
                          key={genRandomHex(8)}
                        />
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
                  key={genRandomHex(8)}
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
            <TableCell className={classes.cell} key={genRandomHex(8)}/>
          )
        })}
      </TableRow>
    </TableHead>
  );
};

const useStyleDataTable = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: '1rem',
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
    containerClasses,
    collapsibleContents
  } = props;
  const classes = useStyleDataTable();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [scroll, setScroll] = useState(0);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const intl = useIntl();

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
  /*
  useEffect(() => {
    window.onscroll = () => {
      setScroll(window.pageYOffset);
    }
  }, [])*/

  return (
    <Paper className={classes.paper} elevation={0} key={genRandomHex(8)}>
        { removeToolBar ? null :
          <StyledTableToolbar title={title} key={genRandomHex(8)}>
            <TooltipIconButton
              title={messages[intl.locale].filter_list}
              name="FILTER"
              key={genRandomHex(8)}
            />
          </StyledTableToolbar>
        }
        <TableContainer className={clsx(classes.container, containerClasses)} key={genRandomHex(8)}>
          <Table
            size="medium"
            stickyHeader
            classes={{
              stickyHeader: classes.table
            }}
            key={genRandomHex(8)}
          >
            <DataTableHeader
              labels={headLabels}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              key={genRandomHex(8)}
              iconsLength={icons?.length ?? 0}
            />
            <TableBody key={genRandomHex(8)}>            
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
                      openArray={openArray}
                      key={genRandomHex(8)}
                      collapsibleContent={collapsibleContents && collapsibleContents[index]}
                    />
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }} key={genRandomHex(8)}/>
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              key={genRandomHex(8)}
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
  const {
    row,
    icons,
    classes,
    collapsible,
    open,
    openArray,
    index,
    collapsibleContent
  } = props;
  const rowClasses = useStlyeDataRow();

  const getRowCallback = (icon: IconProps, index: number) => {
    switch (icon.name) {
      case 'MORE_HORIZ':
        return () => icon.onClick && openArray && icon.onClick(openArray.map((val, i) => i === index ? !val : val));
      case 'EDIT':
      case 'DELETE':
        return () => icon.onClick && icon.onClick(index);
    };
  };

  return (
    <React.Fragment key={genRandomHex(8)}>
      <TableRow
        key={genRandomHex(8)}
        className={rowClasses.root}
      >
        {row.map((lbl, index) => {
          return (
            <TableCell
              component={index === 0 ? "th" : undefined}
              scope={index === 0 ? "row" : undefined}
              className={classes.cell}
              align={lbl.align}
              key={genRandomHex(8)}
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
                    key={genRandomHex(8)}
                  />
                : isStackedLabel(lbl)
                  ? <StackedLabel
                      classes={{root: { ...lbl.classes?.root, marginRight: '1rem'}}}
                      otherLabels={lbl.otherLabels}
                      icon={lbl.icon}
                      key={genRandomHex(8)}
                    />
                  : isLabelBaseProps(lbl)
                    ? <LabelBase 
                        label={lbl.label}
                        colorMode={lbl.colorMode}
                        classes={{root: { ...lbl.classes?.root, marginRight: '1rem'}}}
                        icon={lbl.icon}
                        key={genRandomHex(8)}
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
                  <TableCell className={classes.iconCell} key={genRandomHex(8)}>
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
                          onClick={icon.isRowBasedCallback ? getRowCallback(icon, index) : icon.onClick} // TODO add support to other row-based callbacks
                          key={genRandomHex(8)}
                        />
                      :
                        <NamedIconButton 
                          name={icon.name}
                          size={icon.size}
                          buttonStyle={icon.buttonStyle}
                          otherProps={icon.otherProps}
                          onClick={icon.onClick}
                          key={genRandomHex(8)}
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
          <TableRow className={rowClasses.root} key={genRandomHex(8)}>
            <TableCell colSpan={row.length + (icons !== undefined ? icons.length : 0)} className={classes.cell} key={genRandomHex(8)}>
              <Collapse in={open} key={genRandomHex(8)}>
                {collapsibleContent}
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
