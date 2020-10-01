import React, { useCallback, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import { useAllowlistService, useUserService } from '../contexts';
import { PrimaryButton } from '../components/shared/RoundedButton';
import PhoneNumberMasks from '../components/shared/PhoneNumberMask';
import PATHS from './paths';

function AllowlistTabContent() {
  const [allowlistState, allowlistService] = useAllowlistService();
  const { allowlistEntries = [] } = allowlistState;
  const [newAllowlistPhoneNumber, setNewAllowlistPhoneNumber] = useState('');
  const [newAllowlistCountry, setNewAllowlistCountry] = useState('');

  useEffect(() => {
    if (allowlistService) {
      allowlistService.refreshAllowlistEntries();
    }
  }, [allowlistService]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await allowlistService.createAllowlistEntry({
      phoneNumber: `+65${newAllowlistPhoneNumber}`,
      destinationCountry: newAllowlistCountry,
    });
  };

  const deleteAllowlistEntry = async (id) => {
    await allowlistService.deleteAllowlistEntry(id);
  };

  const newEntryForm = (
    <form
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
      }}
      onSubmit={onSubmit}
    >
      <TextField
        style={{
          marginBottom: '12px',
          background: 'white',
        }}
        variant="outlined"
        label="Phone number"
        value={newAllowlistPhoneNumber}
        onChange={(event) => setNewAllowlistPhoneNumber(event.target.value)}
        InputProps={{
          inputComponent: PhoneNumberMasks.SG,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <InputLabel id="allowlist-country-label">Country</InputLabel>
        <Select
          style={{ background: 'white' }}
          labelId="allowlist-country-label"
          onChange={(e) => setNewAllowlistCountry(e.target.value)}
        >
          <MenuItem value="BD">BD</MenuItem>
          <MenuItem value="SG">SG</MenuItem>
        </Select>
      </div>
      <PrimaryButton type="submit" value="submit">
        Add entry
      </PrimaryButton>
    </form>
  );

  return (
    <>
      <Typography variant="h5" component="h2">
        Allowlist
      </Typography>
      <Typography variant="body2" component="h3">
        New entry
      </Typography>
      {newEntryForm}
      <Typography variant="body2" component="h3">
        Current entries
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phone number</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allowlistEntries.map((allowlistEntry) => (
              <TableRow key={allowlistEntry.phoneNumber}>
                <TableCell>
                  <Typography variant="body2">
                    {allowlistEntry.phoneNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {allowlistEntry.destinationCountry}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => deleteAllowlistEntry(allowlistEntry.id)}
                    role="button"
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function UserTabContent({ users }) {
  const formatSeconds = (callTimeSeconds) => {
    let remainingSeconds = callTimeSeconds;
    const seconds = callTimeSeconds % 60;
    remainingSeconds -= seconds;
    const minutes = (remainingSeconds / 60) % 60;
    remainingSeconds -= minutes * 60;
    const hours = remainingSeconds / 3600;
    return [
      [hours, 'hours'],
      [minutes, 'minutes'],
      [seconds, 'seconds'],
    ]
      .filter(([val]) => val)
      .map(([val, unit]) => `${val} ${unit}`)
      .join(' ');
  };

  return (
    <>
      <Typography variant="h5" component="h2">
        Users
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Call Time Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.phoneNumber}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.destinationCountry}</TableCell>
                <TableCell>{formatSeconds(user.callTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function TabPanel({ value, index, children }) {
  if (value !== index) {
    return null;
  }
  return children;
}

export default function AdminPage() {
  const [userRequestInFlight, setUserRequestInFlight] = useState(true);
  const [userState, userService] = useUserService();
  const { me: user, users } = userState;
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (userService) {
      userService.refreshSelf().finally(() => setUserRequestInFlight(false));
      userService.getUsers();
    }
  }, [userService]);
  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabIndex(newValue);
    },
    [setTabIndex]
  );

  if (!user) {
    if (userRequestInFlight) {
      return null;
    }
    return <Redirect to={PATHS.LOGIN} />;
  }

  return (
    <>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Allowlist" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <UserTabContent users={users} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <AllowlistTabContent />
      </TabPanel>
    </>
  );
}
