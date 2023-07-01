import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRedeemableCodeService } from 'contexts';
import { ApiValidationError } from 'services/apiClient';
import useQuery from 'util/useQuery';
import PATHS, { useAuthRouting } from 'scenes/paths';
import { Container, ErrorButton, PrimaryButton } from '../components';

import { SceneProps } from './types';

// TODO figure out where to put these later
const EN_STRINGS = {
  PROMO_CODE_TITLE: 'Enter your promo code here!',
  PROMO_CODE_SUCCESS_MESSAGE: 'Promo code redeemed successfully!',
  PROMO_CODE_ERROR_CODE_NOT_FOUND_MESSAGE: 'Promo code was not found',
  PROMO_CODE_ERROR_USER_CODE_REDEMPTIONS_EXCEEDED_MESSAGE:
    'You have already claimed this code',
  PROMO_CODE_ERROR_CODE_FULLY_REDEEMED_MESSAGE:
    'This code has already been claimed',
  PROMO_CODE_ERROR_GENERIC_MESSAGE: 'We are unable to process this code',
  SUBMIT: 'Submit',
  CLOSE: 'Close',
};
const STRINGS: Record<string, typeof EN_STRINGS> = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

export default function PromoCode({ locale, routePath }: SceneProps) {
  const [, redeemableCodeService] = useRedeemableCodeService();
  const navigate = useNavigate();
  const routeResult = useAuthRouting(routePath);
  const [codeClaimed, setCodeClaimed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const query = useQuery();

  useEffect(() => {
    const queryCode = query.get('code');
    if (queryCode) {
      setCode(queryCode);
    }
  }, [query]);

  if (!routeResult.ready) {
    return null;
  }
  if (routeResult.ready && routeResult.renderElement) {
    return routeResult.renderElement;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await redeemableCodeService?.redeemCode(code);
      setCodeClaimed(true);
      setErrorMessage('');
    } catch (error) {
      if (error instanceof ApiValidationError) {
        switch (error.code) {
          case 'CODE_NOT_FOUND':
            setErrorMessage(
              STRINGS[locale].PROMO_CODE_ERROR_CODE_NOT_FOUND_MESSAGE
            );
            break;
          case 'USER_CODE_REDEMPTIONS_EXCEEDED':
            setErrorMessage(
              STRINGS[locale]
                .PROMO_CODE_ERROR_USER_CODE_REDEMPTIONS_EXCEEDED_MESSAGE
            );
            break;
          case 'CODE_FULLY_REDEEMED':
            setErrorMessage(
              STRINGS[locale].PROMO_CODE_ERROR_CODE_FULLY_REDEEMED_MESSAGE
            );
            break;
          default:
            setErrorMessage(STRINGS[locale].PROMO_CODE_ERROR_GENERIC_MESSAGE);
        }
        return;
      }
      setErrorMessage(STRINGS[locale].PROMO_CODE_ERROR_GENERIC_MESSAGE);
    }
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" style={{ marginBottom: '12px' }}>
        {STRINGS[locale].PROMO_CODE_TITLE}
      </Typography>
      <form
        onSubmit={onSubmit}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          fullWidth
          value={code}
          onChange={(event) => setCode(event.target.value)}
          label="Enter your code here"
          error={Boolean(errorMessage)}
          helperText={
            errorMessage ||
            (codeClaimed ? STRINGS[locale].PROMO_CODE_SUCCESS_MESSAGE : ' ')
          }
        />
        <PrimaryButton
          disableFocusRipple
          color="primary"
          type="submit"
          value="submit"
          style={{
            marginTop: 'auto',
          }}
        >
          {STRINGS[locale].SUBMIT}
        </PrimaryButton>
        <ErrorButton
          disableFocusRipple
          style={{
            marginTop: '12px',
          }}
          onClick={() => navigate(PATHS.HOME)}
        >
          {STRINGS[locale].CLOSE}
        </ErrorButton>
      </form>
    </Container>
  );
}
