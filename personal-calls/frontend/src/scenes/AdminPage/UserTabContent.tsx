import React, { useEffect } from 'react';
import { UserWalletResponse } from '@call-home/shared/types/User';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Grid, { GridColDef } from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { useAdminService } from 'contexts';
import PATHS from 'scenes/paths';
import { formatSecondsWithHours } from 'util/timeFormatters';

interface UserGridRow {
  id: number;
  name: string;
  phoneNumber: string | null;
  destinationCountry: string;
  callTime: string | null;
  hasAdminGrantedValidation: boolean;
}

export default function UserTabContent() {
  const [adminState, adminService] = useAdminService();
  const { users = [] } = adminState || {};

  useEffect(() => {
    if (adminService) {
      adminService.getUsers();
    }
  }, [adminService]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 80 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'destinationCountry', headerName: 'Country' },
    {
      field: 'hasAdminGrantedValidation',
      headerName: 'Special access',
      width: 150,
      renderCell(rowData) {
        const { hasAdminGrantedValidation, id } = rowData.row as UserGridRow;
        return (
          <Switch
            name="hasAdminGrantedValidation"
            checked={Boolean(hasAdminGrantedValidation)}
            onClick={() => {
              if (rowData.value) {
                adminService?.revokeSpecialAccess(Number(id));
              } else {
                adminService?.grantSpecialAccess(Number(id));
              }
            }}
          />
        );
      },
    },
    { field: 'callTime', headerName: 'Call Time Balance', width: 300 },
    {
      field: 'transactionHistoryButton',
      headerName: 'Transaction History',
      width: 400,
      renderCell(rowData) {
        return (
          <Link to={`${PATHS.TRANSACTIONS}?user=${rowData.row.id}`}>View</Link>
        );
      },
    },
  ];

  const rows: UserGridRow[] = users.map((user: UserWalletResponse) => ({
    id: user.id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    destinationCountry: user.destinationCountry,
    callTime:
      user.callTime === undefined || user.callTime === null
        ? ''
        : formatSecondsWithHours(user.callTime),
    hasAdminGrantedValidation: user.verificationState.adminGranted,
  }));

  return (
    <div style={{ margin: '8px' }}>
      <Typography variant="h5" component="h2">
        Users
      </Typography>
      <Grid
        autoHeight
        rows={rows}
        columns={columns}
        pagination
        rowsPerPageOptions={[10, 25, 100]}
      />
    </div>
  );
}
