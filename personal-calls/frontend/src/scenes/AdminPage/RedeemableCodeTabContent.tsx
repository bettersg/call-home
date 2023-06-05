import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import CropFreeIcon from '@mui/icons-material/CropFree';
import { useRedeemableCodeService } from 'contexts';
import PATHS from '../paths';
import './RedeemableCodeTabContent.css';

const baseUrl = process.env.PUBLIC_URL || 'http://localhost:4000';

function QRCodeDialog({
  open,
  code,
  onClose,
}: {
  open: boolean;
  code: string;
  onClose: () => void;
}) {
  const codeUrl = new URL(`${PATHS.PROMO_CODE}?code=${code}`, baseUrl);
  return (
    <Dialog
      classes={{
        root: 'opaque-dialog',
      }}
      fullWidth
      open={open}
      onClose={onClose}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <IconButton
          style={{ marginBottom: '1rem' }}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
        <QRCode size={256} value={codeUrl.href} />
      </div>
    </Dialog>
  );
}

export default function RedeemableCodeTabContent() {
  const [redeemableCodeState, redeemableCodeService] =
    useRedeemableCodeService();
  const [displayedQrCode, setDisplayedQrCode] = useState('');

  const redeemableCodes = redeemableCodeState?.codes ?? [];

  useEffect(() => {
    if (redeemableCodeService) {
      redeemableCodeService.refreshRedeemableCodes();
    }
  }, [redeemableCodeService]);

  const createFacebookDormCode = () =>
    redeemableCodeService?.createFacebookRedeemableCode();

  return (
    <>
      <Typography component="h2" style={{ margin: '8px' }}>
        Promo codes
      </Typography>
      <Button
        value="submit"
        variant="contained"
        color="primary"
        size="small"
        onClick={createFacebookDormCode}
      >
        Create code
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>QR</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {redeemableCodes
              .sort(
                (a, b) =>
                  (new Date(b.createdAt) as any) -
                  (new Date(a.createdAt) as any)
              )
              .map((redeemableCode) => (
                <TableRow key={redeemableCode.id}>
                  <TableCell>{redeemableCode.code}</TableCell>
                  <TableCell>
                    <IconButton
                      role="button"
                      onClick={() => setDisplayedQrCode(redeemableCode.code)}
                      size="large"
                    >
                      <CropFreeIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      role="button"
                      onClick={() =>
                        redeemableCodeService?.deleteRedeemableCode(
                          redeemableCode.id
                        )
                      }
                      size="large"
                    >
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <QRCodeDialog
        open={Boolean(displayedQrCode)}
        code={displayedQrCode}
        onClose={() => setDisplayedQrCode('')}
      />
    </>
  );
}
