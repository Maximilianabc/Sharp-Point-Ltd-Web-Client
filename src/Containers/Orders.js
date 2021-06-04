import { 
  Button,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow
} from '@material-ui/core';
import { useSelector } from 'react-redux';

const Orders = (props) => {
  const token = useSelector(state => state.sessionToken);
  const userId = useSelector(state => state.userId);
  return (
    <Fade in={true}>
      <Table
        id="futures-table"
        size="medium"
      >
        <TableHead>Futures</TableHead>
        <TableBody>
          <TableRow hover={true} selected={true}>
            <TableCell>
              1
            </TableCell>
            <TableCell>
              2
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter/>       
      </Table>
    </Fade>
  );
};

export {
  Orders
}
