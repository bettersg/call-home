import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Checkbox from '@material-ui/core/Checkbox';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

// This is intentionally restrictive. If this doesnt make sense, we can break this abstraction.
function CheckboxTable({
  headerLabels,
  rowItems,
  rowItemToTableRow,
  setSelectedIndices,
  selectedIndices,
}) {
  const selectIndex = (idx) => {
    const newSelectedIndices = new Set(selectedIndices);
    if (selectedIndices.has(idx)) {
      newSelectedIndices.delete(idx);
    } else {
      newSelectedIndices.add(idx);
    }
    setSelectedIndices(newSelectedIndices);
  };

  const selectAll = () => {
    if (selectedIndices.size === rowItems.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(rowItems.map((_, idx) => idx)));
    }
  };

  const rowCount = Number(rowItems && rowItems.length);
  const selectedCount = Number(selectedIndices && selectedIndices.size);

  const header = (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={selectedCount > 0 && selectedCount < rowCount}
            checked={rowCount > 0 && selectedCount === rowCount}
            onChange={selectAll}
          />
        </TableCell>
        {headerLabels.map((label) => (
          <TableCell key={label}>{label}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
  const rows = rowItems.map(({ data, key }, idx) => (
    <TableRow hover onClick={() => selectIndex(idx)} role="checkbox" key={key}>
      <TableCell padding="checkbox">
        <Checkbox
          onChange={() => selectIndex(idx)}
          checked={selectedIndices.has(idx)}
        />
      </TableCell>
      {rowItemToTableRow(data)}
    </TableRow>
  ));
  return (
    <TableContainer>
      <Table>
        {header}
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default CheckboxTable;
