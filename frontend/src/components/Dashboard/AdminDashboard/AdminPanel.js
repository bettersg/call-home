import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import RemoveIcon from '@material-ui/icons/Remove';
import RoundedButton from '../../shared/RoundedButton';
import './index.css';
import './AdminPanel.css';

function AdminPanel({
  addText,
  onAddClicked,
  deleteCount,
  deleteText,
  deleteSelected,
  drawer,
  table,
}) {
  return (
    <div className="admin-panel">
      <div className="admin-panel-buttons">
        {deleteCount > 0 ? (
          <RoundedButton
            id="delete-button"
            color="primary"
            onClick={deleteSelected}
          >
            <RemoveIcon /> {deleteText}({deleteCount})
          </RoundedButton>
        ) : null}
        <div>
          <RoundedButton color="primary">
            <AddIcon /> Import from csv
          </RoundedButton>
          <RoundedButton
            variant="contained"
            color="primary"
            onClick={onAddClicked}
          >
            <AddIcon /> {addText}
          </RoundedButton>
        </div>
      </div>
      <Paper className="data-list">{table}</Paper>
      {drawer}
    </div>
  );
}

export default AdminPanel;
