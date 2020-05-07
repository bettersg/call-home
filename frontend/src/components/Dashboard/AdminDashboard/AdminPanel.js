import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import roundedButtonStyles from '../../shared/RoundedButtonStyles';
import './index.css';
import './AdminPanel.css';

function AdminPanel({ addText, onAddClicked, drawer, table }) {
  const classes = roundedButtonStyles();

  return (
    <div className="admin-panel">
      <div className="admin-panel-buttons">
        <Button color="primary" className={classes.root}>
          <AddIcon /> Import from csv
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.root}
          onClick={onAddClicked}
        >
          <AddIcon /> {addText}
        </Button>
      </div>
      <Paper className="data-list">{table}</Paper>
      {drawer}
    </div>
  );
}

export default AdminPanel;
