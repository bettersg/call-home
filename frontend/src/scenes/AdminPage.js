import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
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
import Container from '../components/shared/Container';
import { useAllowlistService, useUserService } from '../contexts';
import { PrimaryButton } from '../components/shared/RoundedButton';
import PhoneNumberMasks from '../components/shared/PhoneNumberMask';
import PATHS from './paths';

function AllowlistTab() {
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

export default function AdminPage() {
  const [userRequestInFlight, setUserRequestInFlight] = useState(true);
  const [userState, userService] = useUserService();
  const { me: user } = userState;

  useEffect(() => {
    if (userService) {
      userService.refreshSelf().finally(() => setUserRequestInFlight(false));
    }
  }, [userService]);

  if (!user) {
    if (userRequestInFlight) {
      return null;
    }
    return <Redirect to={PATHS.LOGIN} />;
  }

  return (
    <Container>
      <Typography variant="h5" component="h1">
        Admin
      </Typography>
      <AllowlistTab />
    </Container>
  );
}
