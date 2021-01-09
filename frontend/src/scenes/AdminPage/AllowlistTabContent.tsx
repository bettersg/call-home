import React, { useState, useEffect, FormEvent } from 'react';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import { FormControlLabel, Grid } from '@material-ui/core';
import { useAllowlistService } from 'contexts';
import PhoneNumberMasks from 'components/shared/PhoneNumberMask';
import { ApiValidationError } from 'services/apiClient';

interface AllowlistGridRow {
  id: string;
  phoneNumber: string;
  destinationCountry: string;
}

export default function AllowlistTabContent() {
  const [allowlistState, allowlistService] = useAllowlistService();
  const { allowlistEntries = [] } = allowlistState;
  const [newAllowlistPhoneNumber, setNewAllowlistPhoneNumber] = useState('');
  const [
    newAllowlistMultiplePhoneNumbers,
    setNewAllowlistMultiplePhoneNumbers,
  ] = useState('');
  const [useMultipleNumbers, setUseMultipleNumbers] = useState(false);
  const [newAllowlistCountry, setNewAllowlistCountry] = useState('BD');
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

  const rows: AllowlistGridRow[] = allowlistEntries.map(
    (allowlistEntry: any) => ({
      id: allowlistEntry.id,
      phoneNumber: allowlistEntry.phoneNumber,
      destinationCountry: allowlistEntry.destinationCountry,
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
          <IconButton
            role="button"
            style={{ color: 'red' }}
            onClick={() => {
              deleteAllowlistEntry(Number(row.row.id));
            }}
          >
            <CloseIcon />
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
