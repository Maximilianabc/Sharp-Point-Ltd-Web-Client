import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyledTable
} from '../Components';
import { 
  getDispatchSelectCB,
  AccOperations,
  OPConsts,
  UserState,
  AccSummaryRecord
} from '../Util';
import { useHistory } from 'react-router';

interface ProfileProps {

}

const headCells = [
  { id: '' },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  }
});

const Profile = (props: ProfileProps) => {
  const token = useSelector((state: UserState) => state.token);
  const accNo = useSelector((state: UserState) => state.accName);
  const [summary, setSummary] = useState<AccSummaryRecord[]>([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const hooks = getDispatchSelectCB(OPConsts.BALANCE);
  const title = 'Summary';

  return (
    <div id={title.toLowerCase()}>
      <StyledTable
          data={summary}
          title={title}
          headerCells={headCells}
      />  
    </div>
  );
};

export {
  Profile
};