import { IconButton } from '@material-ui/core';
import {
  MoreHoriz,
  ChevronRight,
  Edit,
  Delete,
  FilterList
} from '@material-ui/icons';

type IconTypes = 'DETAILS' | 'MORE_HORIZ' | 'MORE_VERT' | 'EDIT' | 'DELETE' | 'FILTER';
interface IconProps {
  name: IconTypes,
  size?: number
}

const DETAILS = (size: number = 24) =>
  <IconButton>
    <ChevronRight style={{
      color: 'white',
      fontSize: size
    }}/>
  </IconButton>

const MORE_HORIZ = (size: number = 24) => 
  <IconButton>
    <MoreHoriz style={{
      color: 'white',
      fontSize: size
    }}/>
  </IconButton>

const MORE_VERT = (size: number = 24) =>
  <IconButton>
    <MoreHoriz style={{
      color: 'white',
      fontSize: size
    }}/>
  </IconButton>

const EDIT = (size: number = 24) => 
  <IconButton>
    <Edit style={{
      color: 'white',
      fontSize: size
    }}
    />
  </IconButton>

const DELETE = (size: number = 24) => 
  <IconButton>
    <Delete style={{
      color: 'white',
      fontSize: size
    }}
    />
  </IconButton>

const FILTER = (size: number = 24) =>
  <IconButton>
    <FilterList style={{
      color: 'white',
      fontSize: size
    }}
    />
  </IconButton>

const getIconByName = (name: IconTypes, size: number = 24) => {
  switch (name) {
    case 'DETAILS':
      return DETAILS(size);
    case 'MORE_HORIZ':
      return MORE_HORIZ(size);
    case 'MORE_VERT':
      return MORE_VERT(size);
    case 'EDIT':
      return EDIT(size);
    case 'DELETE': 
      return DELETE(size);
    case 'FILTER':
      return FILTER(size);
  }
}

export {
  DETAILS,
  MORE_HORIZ,
  MORE_VERT,
  EDIT,
  DELETE,
  FILTER,
  getIconByName
}

export type {
  IconProps,
  IconTypes
}
