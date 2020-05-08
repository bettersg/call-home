import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import RoundedButton from '../../shared/RoundedButton';
import './index.css';
import './AdminPanel.css';

function AdminPanel({ addText, onAddClicked, drawer, table }) {
  return (
    <div className="admin-panel">
      <div className="admin-panel-buttons">
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
      <Paper className="data-list">{table}</Paper>
      {drawer}
    </div>
  );
}

export default AdminPanel;
