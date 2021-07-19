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
  Schedule
} from '@material-ui/icons';
import { forwardRef } from 'react';

type IconTypes = 'DETAILS' | 'MORE_HORIZ' | 'MORE_VERT' | 'EDIT' | 'DELETE' | 'FILTER' | 'ACTIVATE' | 'DEACTIVATE' | 'WORKING' | '';
interface IconProps {
  name: IconTypes,
  size?: number,
  buttonStyle?: object,
  otherProps?: object
}

const NamedIconButton = forwardRef((props: IconProps, ref) => {
  const { name, size, buttonStyle, otherProps } = props;
  const style = { color: 'white', fontSize: size, ...otherProps };
  return (
    <IconButton style={buttonStyle}>
      {{
        'DETAILS':<ChevronRight style={style}/>,
        'MORE_HORIZ': <MoreHoriz style={style}/>,
        'MORE_VERT': <MoreVert style={style}/>,
        'EDIT': <Edit style={style}/>,
        'DELETE': <DeleteForever style={style}/>,
        'FILTER': <FilterList style={style}/>,
        'ACTIVATE': <PlayCircleFilled style={style}/>,
        'DEACTIVATE': <RemoveCircle style={style}/>,
        'WORKING': <Schedule style={style}/>,
        '': null
      }[name]}
    </IconButton>
  );
});

export {
  NamedIconButton
}

export type {
  IconProps,
  IconTypes
}
