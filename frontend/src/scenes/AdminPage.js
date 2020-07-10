import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Container from '../components/shared/Container';
import { useAllowlistService, useUserService } from '../contexts';
import { NeutralButton } from '../components/shared/RoundedButton';
import PhoneNumberMasks from '../components/shared/PhoneNumberMask';
import PATHS from './paths';

export default function AdminPage() {
  const [userRequestInFlight, setUserRequestInFlight] = useState(true);
  const [userState, userService] = useUserService();
  const { me: user } = userState;
  const [allowlistState, allowlistService] = useAllowlistService();
  const { allowlistEntries = [] } = allowlistState;
  const [newAllowlistPhoneNumber, setNewAllowlistPhoneNumber] = useState('');
  const [newAllowlistCountry, setNewAllowlistCountry] = useState('');

  useEffect(() => {
    if (userService) {
      userService.refreshSelf().finally(() => setUserRequestInFlight(false));
    }
  }, [userService]);

  useEffect(() => {
    if (allowlistService) {
      allowlistService.refreshAllowlistEntries();
    }
  }, [allowlistService]);

  if (!user) {
    if (userRequestInFlight) {
      return null;
    }
    return <Redirect to={PATHS.LOGIN} />;
  }

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
    <form onSubmit={onSubmit}>
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
      <FormControl>
        <InputLabel />
        <Select
          style={{ background: 'white' }}
          onChange={(e) => setNewAllowlistCountry(e.target.value)}
        >
          <MenuItem value="BD">BD</MenuItem>
          <MenuItem value="SG">SG</MenuItem>
        </Select>
      </FormControl>
      <NeutralButton type="submit" value="submit">
        Add entry
      </NeutralButton>
    </form>
  );

  return (
    <Container
      style={{
        background: 'no-repeat url(/images/contacts_bg.svg) bottom center',
        backgroundSize: 'contain',
      }}
    >
      <Typography variant="h5" component="h1">
        Admin
      </Typography>
      <List
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {allowlistEntries.map((allowlistEntry) => (
          <ListItem key={allowlistEntry.phoneNumber}>
            <Box
              onClick={() => deleteAllowlistEntry(allowlistEntry.id)}
              style={{
                marginBottom: '0.5rem',
                paddingBottom: '0',
                paddingTop: '0',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
              }}
            >
              <Typography variant="body1">
                Allowed country: {allowlistEntry.destinationCountry}
              </Typography>
              <Typography variant="body2">
                Phone number: {allowlistEntry.phoneNumber}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      {newEntryForm}
    </Container>
  );
}
