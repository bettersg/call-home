import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import { useCalleeService } from '../../../../contexts';
import CheckboxTable from '../../../shared/CheckboxTable';

const HEADER_LABELS = ["SENIOR'S NAME", 'EDIT?'];

function CalleeTable({
  openEditCalleeDrawer,
  selectedIndices,
  setSelectedIndices,
}) {
  const [calleeState] = useCalleeService();
  const { callees } = calleeState;

  const [rowItems, setRowItems] = useState([]);
  useEffect(() => {
    setRowItems(
      callees.map((callee) => ({
        key: callee.id,
        data: callee,
      }))
    );
  }, [callees]);

  const rowItemToTableRow = (callee) => {
    return (
      <>
        <TableCell component="th" scope="row">
          <Typography>{callee.name}</Typography>
          <Typography variant="subtitle2">{callee.phoneNumber}</Typography>
        </TableCell>
        <TableCell>
          <Button
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              openEditCalleeDrawer(callee);
            }}
          >
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

export default CalleeTable;
