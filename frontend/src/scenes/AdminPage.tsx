import React, { useCallback, useState, useEffect, FormEvent } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Switch from '@material-ui/core/Switch';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { FormControlLabel, Grid } from '@material-ui/core';
import { useAllowlistService, useAdminService } from '../contexts';
import PhoneNumberMasks from '../components/shared/PhoneNumberMask';
import { ApiValidationError } from '../services/apiClient';
import useAdminRoute from '../util/useAdminRoute';
import PATHS from './paths';
import { formatSecondsWithHours } from '../util/timeFormatters';
import { SceneProps } from './types';

function AllowlistTabContent() {
  const [allowlistState, allowlistService] = useAllowlistService();
  const { allowlistEntries = [] } = allowlistState;
  const [newAllowlistPhoneNumber, setNewAllowlistPhoneNumber] = useState('');
  const [
    newAllowlistMultiplePhoneNumbers,
    setNewAllowlistMultiplePhoneNumbers,
  ] = useState('');
  const [useMultipleNumbers, setUseMultipleNumbers] = useState(false);
  const [newAllowlistCountry, setNewAllowlistCountry] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    if (allowlistService) {
      (allowlistService as any).refreshAllowlistEntries();
    }
  }, [allowlistService]);

  const createAllowlistEntry = async (newNumber: string) => {
    try {
      await (allowlistService as any).createAllowlistEntry({
        phoneNumber: `+65${newNumber}`,
        destinationCountry: newAllowlistCountry,
      });
    } catch (error) {
      let errorMessage;
      if (error instanceof ApiValidationError) {
        errorMessage = error.code;
      } else {
        errorMessage = error.message;
      }
      setErrorMessages([...errorMessages, errorMessage]);
      console.error(`Failed to create entry for ${newNumber}`);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Modify the array in-place because createAllowlistEntry has a closure over the actual errorMessages instance. This can be handled more elegantly by returning the error type, but that's too much effort for now.
    errorMessages.splice(0, errorMessages.length);

    if (useMultipleNumbers) {
      const newNumbers = newAllowlistMultiplePhoneNumbers.split('\n');
      const newAllowListRequests = newNumbers.map(createAllowlistEntry);
      return Promise.all(newAllowListRequests);
    }

    return createAllowlistEntry(newAllowlistPhoneNumber);
  };

  const deleteAllowlistEntry = async (id: number) => {
    await (allowlistService as any).deleteAllowlistEntry(id);
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (useMultipleNumbers) {
      setNewAllowlistMultiplePhoneNumbers(event.target.value);
    } else {
      setNewAllowlistPhoneNumber(event.target.value);
    }
  };

  const newEntryForm = (
    <form onSubmit={onSubmit}>
      <Grid
        container
        alignItems="center"
        spacing={2}
        style={{ margin: '8px 0 0 0' }}
      >
        {useMultipleNumbers ? (
          <Grid item>
            <TextField
              style={{
                background: 'white',
              }}
              multiline
              variant="outlined"
              label="Phone numbers"
              value={newAllowlistMultiplePhoneNumbers}
              onChange={handlePhoneNumberChange}
            />
          </Grid>
        ) : (
          <Grid item>
            <TextField
              style={{
                background: 'white',
              }}
              variant="outlined"
              label="Phone number"
              value={newAllowlistPhoneNumber}
              onChange={handlePhoneNumberChange}
              InputProps={{
                inputComponent: PhoneNumberMasks.SG as any,
              }}
            />
          </Grid>
        )}
        <Grid item>
          <FormControl
            variant="outlined"
            style={{
              background: 'white',
            }}
          >
            <InputLabel>Country</InputLabel>
            <Select
              native
              onChange={(e: React.ChangeEvent<any>) =>
                setNewAllowlistCountry(e.target.value)
              }
              label="Country"
            >
              <option value="BD">BD</option>
              <option value="SG">SG</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                name="useMultipleNumbers"
                checked={useMultipleNumbers}
                onChange={() => setUseMultipleNumbers(!useMultipleNumbers)}
              />
            }
            label="Multiple Entries"
          />
        </Grid>

        <Button
          type="submit"
          value="submit"
          variant="contained"
          color="primary"
          size="small"
        >
          Add entry
        </Button>
      </Grid>
    </form>
  );

  const rows: { 
    id: string; 
    phoneNumber: string; 
    destinationCountry: string 
  }[] = allowlistEntries.map((allowlistEntry: any) => ({
      id: allowlistEntry.id,
      phoneNumber: allowlistEntry.phoneNumber,
      destinationCountry: allowlistEntry.destinationCountry
    })
  );

  const columns: ColDef[] = [
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'destinationCountry', headerName: 'Country' },
    {
      field: '',
      headerName: 'Delete',
      hideSortIcons: true,
      renderCell(row) {
        return (
          <IconButton role="button" style={{ color: 'red' }}>
            <CloseIcon
              onClick={() => {
                deleteAllowlistEntry(Number(row.data.id));
              }}
            />
          </IconButton>
        );
      },
    },
  ];

  return (
    <>
      <Typography variant="h5" component="h2" style={{ margin: '8px' }}>
        Allowlist
      </Typography>

      {errorMessages.map((errorMessage) => (
        <Typography key={errorMessage} variant="body1" color="error">
          {errorMessage}
        </Typography>
      ))}
      {newEntryForm}

      <div style={{ margin: '8px' }}>
        <Typography variant="body2" component="h3">
          Current Entries
        </Typography>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pagination
          rowsPerPageOptions={[10, 25, 100]}
        />
      </div>
    </>
  );
}

function UserTabContent() {
  const [adminState, adminService] = useAdminService();
  const { users = [] } = adminState;

  useEffect(() => {
    if (adminService) {
      (adminService as any).getUsers();
    }
  }, [adminService]);

  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'destinationCountry', headerName: 'Country' },
    { field: 'callTime', headerName: 'Call Time Balance', width: 300 },
    {
      field: 'transactionHistory',
      headerName: 'Transaction History',
      width: 400,
      renderCell(rowData) {
        return (
          <Link to={`${PATHS.TRANSACTIONS}?user=${rowData.value}`}>View</Link>
        );
      },
    },
  ];

  const rows: {
    id: string;
    name: string;
    phoneNumber: string;
    destinationCountry: string;
    callTime: string;
    transactionHistory: string;
  }[] = users.map((user: any) => ({
    id: user.id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    destinationCountry: user.destinationCountry,
    callTime: formatSecondsWithHours(user.callTime),
    transactionHistory: user.id,
  }));

  return (
    <>
      <div style={{ margin: '8px' }}>
        <Typography variant="h5" component="h2">
          Users
        </Typography>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pagination
          rowsPerPageOptions={[10, 25, 100]}
          pageSize={5}
        />
      </div>
    </>
  );
}

function TabPanel({
  value,
  index,
  children,
}: {
  value: number;
  index: number;
  children: JSX.Element;
}) {
  if (value !== index) {
    return null;
  }
  return children;
}

export default function AdminPage({ locale, routePath }: SceneProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = useCallback(
    (_event, newValue) => {
      setTabIndex(newValue);
    },
    [setTabIndex]
  );

  const adminRedirect = useAdminRoute();
  if (adminRedirect) {
    return adminRedirect;
  }

  return (
    <>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Allowlist" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <UserTabContent />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <AllowlistTabContent />
      </TabPanel>
    </>
  );
}
