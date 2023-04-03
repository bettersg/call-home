import { Link, Redirect } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Container } from '../components';
import { useAdminService } from '../contexts';
import useAdminRoute from '../util/useAdminRoute';
import useQuery from '../util/useQuery';
import PATHS from './paths';
import { formatSecondsWithHours } from '../util/timeFormatters';

// TODO keep this generic so that it can be co-opted to display transactions for users
export default function TransactionsPage() {
  const query = useQuery();
  const userId = query.get('user');
  const [adminState, adminService] = useAdminService();
  const { users = [], userTransactions = [] } = adminState;
  const [transactionAmount, setTransactionAmount] = useState(0);

  useEffect(() => {
    if (adminService) {
      adminService.refreshTransactions(userId);
      adminService.getUsers();
    }
  }, [adminService, userId]);

  const adminRedirect = useAdminRoute();
  if (adminRedirect) {
    return adminRedirect;
  }

  const userCallTime = users.filter(
    (user) => Number(user.id) === Number(userId)
  )[0]?.callTime;

  const onSubmit = async (event) => {
    event.preventDefault();
    await adminService.createTransaction(userId, Number(transactionAmount));
    await adminService.getUsers();
  };

  if (!userId) {
    return <Redirect to={PATHS.ADMIN} />;
  }

  return (
    <Container>
      <Typography style={{ marginTop: '4rem' }} variant="h5" component="h2">
        Transactions
      </Typography>
      <Typography variant="body1">
        Balance: {formatSecondsWithHours(userCallTime)}
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth
          value={transactionAmount}
          onChange={(event) => setTransactionAmount(event.target.value)}
          label="Transaction amount (seconds)"
        />
      </form>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userTransactions
              .filter((transaction) => transaction.amount)
              .map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {DateTime.fromISO(transaction.createdAt).toLocaleString(
                      DateTime.DATETIME_FULL_WITH_SECONDS
                    )}
                  </TableCell>
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell>
                    {formatSecondsWithHours(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to={PATHS.ADMIN}>Back to admin</Link>
    </Container>
  );
}
