import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Duration } from 'luxon';
import React, { useEffect } from 'react';
import Container from '../components/shared/Container';
import { useAdminService } from '../contexts';
import useAdminRoute from '../util/useAdminRoute';
import useQuery from '../util/useQuery';
import PATHS from './paths';

// TODO keep this generic so that it can be co-opted to display transactions for users
export default function TransactionsPage() {
  const query = useQuery();
  const userId = query.get('user');
  const [adminState, adminService] = useAdminService();
  const { users = [], userTransactions = [] } = adminState;

  useEffect(() => {
    if (adminService) {
      adminService.refreshTransactions(userId);
    }
  }, [adminService]);

  const adminRedirect = useAdminRoute();
  if (adminRedirect) {
    return adminRedirect;
  }

  const formatSeconds = (seconds) =>
    Duration.fromObject({ seconds }).toFormat(
      "hh 'hours' mm 'minutes' ss 'seconds'"
    );
  const userCallTime = users.filter(
    (user) => Number(user.id) === Number(userId)
  )[0]?.callTime;

  return (
    <Container>
      <Typography style={{ marginTop: '4rem' }} variant="h5" component="h2">
        Transactions
      </Typography>
      Balance: {formatSeconds(userCallTime)}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userTransactions
              .filter((transaction) => transaction.amount)
              .map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell>{formatSeconds(transaction.amount)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to={PATHS.ADMIN}>Back to admin</Link>
    </Container>
  );
}
