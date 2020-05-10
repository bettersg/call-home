import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import PhoneIcon from '@material-ui/icons/Phone';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { useCalleeService } from '../../../contexts/CalleeService';
import './CalleeTable.css';

function CalleeTable({ onCallClick }) {
  const [calleeState] = useCalleeService();
  const { callees } = calleeState;

  const header = (
    <TableHead>
      <TableRow>
        <TableCell>SENIOR&apos;S NAME</TableCell>
        <TableCell>LAST CALLED BY ME</TableCell>
        <TableCell>CALL?</TableCell>
      </TableRow>
    </TableHead>
  );
  const rows = callees.map((callee) => (
    <TableRow key={callee.id}>
      <TableCell>{callee.name}</TableCell>
      <TableCell>TODO</TableCell>
      <TableCell>
        <Button onClick={() => onCallClick(callee)}>
          <PhoneIcon />
          Call
        </Button>
      </TableCell>
    </TableRow>
  ));
  return (
    <Paper className="callee-table">
      <TableContainer>
        <Table>
          {header}
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default CalleeTable;
