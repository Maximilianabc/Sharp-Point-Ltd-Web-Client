import { IconButton } from '@material-ui/core';
import {
  MoreHoriz,
  ChevronRight,
  Edit,
  FilterList,
  PlayCircleFilled,
  RemoveCircle,
  DeleteForever,
  MoreVert,
  Schedule,
  Build,
  Backup,
  Cancel,
  Delete,
  CheckCircle,
  History,
  DoneAll
} from '@material-ui/icons';
import { forwardRef, MouseEventHandler } from 'react';
import { OrderStatus } from '../Util';

type IconTypes = 'DETAILS' | 'MORE_HORIZ' | 'MORE_VERT' | 
                 'EDIT' | 'DELETE' | 'DELETED' | 'FILTER' | 
                 'INACTIVE' | 'ACTIVATE' | 'DEACTIVATE' | 
                 'WORKING' | 'PENDING' | 'UPLOADING' | 
                 'DONE' | 'DONE_ALL' | 'HISTORY' | '';

interface IconProps {
  name: IconTypes,
  size?: number,
  buttonStyle?: object,
  otherProps?: object,
  onClick?: MouseEventHandler
}

const NamedIconButton = forwardRef((props: IconProps, ref) => {
  const { name, size, buttonStyle, otherProps, onClick } = props;
  const style = { color: 'white', fontSize: size, ...otherProps };
  return (
    <IconButton style={buttonStyle} onClick={onClick}>
      {{
        'DETAILS':<ChevronRight style={style}/>,
        'MORE_HORIZ': <MoreHoriz style={style}/>,
        'MORE_VERT': <MoreVert style={style}/>,
        'EDIT': <Edit style={style}/>,
        'DELETE': <DeleteForever style={style}/>,
        'DELETED': <Delete style={style}/>,
        'FILTER': <FilterList style={style}/>,
        'INACTIVE': <Cancel style={style}/>,
        'ACTIVATE': <PlayCircleFilled style={style}/>,
        'DEACTIVATE': <RemoveCircle style={style}/>,
        'WORKING': <Build style={style}/>,
        'PENDING': <Schedule style={style}/>,
        'UPLOADING': <Backup style={style}/>,
        'DONE': <CheckCircle style={style}/>,
        'DONE_ALL': <DoneAll style={style}/>,
        'HISTORY': <History style={style}/>,
        '': null
      }[name]}
    </IconButton>
  );
});

const getIconTypeByStatus = (status: OrderStatus): IconTypes => {
  switch (status) {
    case 'Sending':
      return 'UPLOADING';
    case 'Pending':
      return 'PENDING';
    case 'Working':
      return 'WORKING';
    case 'Inactive':
      return 'INACTIVE';
    case 'Deleted':
      return 'DELETED';
    case 'Traded':
      return 'DONE';
  }
};

export {
  NamedIconButton,
  getIconTypeByStatus
}

export type {
  IconProps,
  IconTypes
}
