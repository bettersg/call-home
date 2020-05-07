import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import { UserTypes } from '../../../../services/User';
import { useUserService } from '../../../../contexts';
import CheckboxTable from '../../../shared/CheckboxTable';

const HEADER_LABELS = [
  "VOLUNTEER'S NAME",
  'LAST ACTIVE',
  'ASSIGNED SENIORS',
  'EDIT?',
];

function UserTable({ openEditUserDrawer }) {
  const [userState] = useUserService();
  const { users } = userState;
  const [selectedIndices, setSelectedIndices] = useState(new Set());

  const [rowItems, setRowItems] = useState([]);
  useEffect(() => {
    /* const callers = users.filter((user) => user.role === UserTypes.CALLER); */
    // TODO remove this
    const callers = users;
    setRowItems(
      callers.map((caller) => ({
        key: caller.email,
        data: caller,
      }))
    );
  }, [users]);

  const rowItemToTableRow = (caller) => {
    const numCallees = caller.callees.length;
    let calleesCellContent = 'No seniors assigned';
    if (numCallees >= 1) {
      calleesCellContent = caller.callees[0].name;
    }
    if (numCallees > 1) {
      calleesCellContent += ` & ${numCallees - 1} others`;
    }
    return (
      <>
        <TableCell component="th" scope="row">
          <Typography>{caller.name}</Typography>
          <Typography variant="subtitle2">{caller.email}</Typography>
        </TableCell>
        <TableCell>TODO</TableCell>
        <TableCell>{calleesCellContent}</TableCell>
        <TableCell>
          <Button color="primary" onClick={(e) => { e.stopPropagation(); openEditUserDrawer(caller) }}>
            <CreateIcon />
            Edit
          </Button>
        </TableCell>
      </>
    );
  };
  return (
    <CheckboxTable
      headerLabels={HEADER_LABELS}
      rowItems={rowItems}
      rowItemToTableRow={rowItemToTableRow}
      selectedIndices={selectedIndices}
      setSelectedIndices={setSelectedIndices}
    />
  );
}

export default UserTable;
