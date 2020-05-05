import React, { useState } from 'react';
import MuiDrawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';

const drawer = makeStyles({
  paper: {
    width: '30%',
  },
  child: {
    padding: '24px',
  },
});

function Drawer({ children, header, onCloseClick, ...rest }) {
  const drawerClasses = drawer();

  return (
    <MuiDrawer
      classes={{ paper: drawerClasses.paper }}
      anchor="right"
      {...rest}
    >
      <div className={drawerClasses.child}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {header && <Typography variant="h6">{header}</Typography>}
          <IconButton>
            <ClearIcon onClick={onCloseClick} />
          </IconButton>
        </div>
        {children}
      </div>
    </MuiDrawer>
  );
}

export default Drawer;
