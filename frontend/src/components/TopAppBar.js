import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { green } from '@material-ui/core/colors';
import { useUserService } from '../contexts';
import { UserTypes } from '../services/User';
import './TopAppBar.css';

const appBarStyles = {
  [UserTypes.ADMIN]: {
    background: green[700],
  },
};

const switchViewName = {
  [UserTypes.ADMIN]: 'caller',
  [UserTypes.CALLER]: 'admin',
};

function TopAppBar({ dashboardChoice, setDashboardChoice }) {
  const [userState] = useUserService();
  const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = useState(null);
  const isOptionsMenuOpen = Boolean(optionsMenuAnchorEl);
  const { me: userInfo } = userState || {};
  const { picture = null } = userInfo || {};

  const openOptionsMenu = (e) => {
    setOptionsMenuAnchorEl(e.currentTarget);
  };
  const closeOptionsMenu = () => {
    setOptionsMenuAnchorEl(null);
  };
  const toggleDashboardChoice = () => {
    if (dashboardChoice === UserTypes.ADMIN) {
      setDashboardChoice(UserTypes.CALLER);
    } else {
      setDashboardChoice(UserTypes.ADMIN);
    }
  };

  // We render two Toolbars because otherwise, content gets hidden
  return (
    <>
      <AppBar position="sticky" style={appBarStyles[dashboardChoice]}>
        <Toolbar>
          <div className="app-toolbar-container">
            <Typography component="h1" variant="h6">
              Care Corner-Ring a Senior
            </Typography>
            {dashboardChoice === UserTypes.ADMIN ? (
              <Typography variant="subtitle1"> Admin View</Typography>
            ) : null}
            <div>
              <div className="avatar-menu">
                {picture ? <Avatar src={picture} /> : null}
                <IconButton onClick={openOptionsMenu}>
                  <MoreVertIcon className="avatar-menu-icon" />
                </IconButton>
              </div>
            </div>
            <Menu
              open={isOptionsMenuOpen}
              onClose={closeOptionsMenu}
              anchorEl={optionsMenuAnchorEl}
            >
              <MenuItem onClick={toggleDashboardChoice}>
                Switch to {switchViewName[dashboardChoice]} view
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default TopAppBar;
