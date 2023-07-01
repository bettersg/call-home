import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useUserService } from 'contexts';
import { PrimaryButton, Container, Footer } from 'components';
import { validateFin } from 'services/FinValidation';
import { Locale, SceneProps } from 'scenes/types';

const EN_STRINGS = {
  VERIFY_FIN_TITLE: 'Enter your FIN',
  VERIFY_FIN_FIN_PLACEHOLDER: 'e.g. M1234567X',
  VERIFY_FIN_HELP:
    'We need this to verify you’re a foreign worker in Singapore.',
  VERIFY_FIN_CANCEL: 'Cancel',
  VERIFY_FIN_WP_LIKE_MESSAGE: 'Enter your FIN, not work pass number',
  VERIFY_FIN_INVALID_SN_MESSAGE: 'Not a valid FIN. Try again',
  VERIFY_FIN_UNKNOWN_SN_MESSAGE: 'An unknown error has occurred',
  VERIFY_FIN_CONFLICTING_SN_MESSAGE:
    'This FIN is already being used by somebody',
  NEXT: 'Next',
};
const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

const WP_SERIAL_NUMBER_REGEX = /[A-Za-z][0-9]{,6}/;
const FIN_REGEX = /[A-Za-z][0-9]+[A-Za-z]/;

interface VerifyFinPresenterProps {
  locale: Locale;
  fin: string;
  onSubmit: (event: React.FormEvent) => void;
  onFinChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

function VerifyFinPresenter({
  locale,
  fin,
  onSubmit,
  onFinChanged,
  errorMessage,
}: VerifyFinPresenterProps) {
  return (
    <Container>
      <form
        onSubmit={onSubmit}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Typography
          variant="h2"
          component="h1"
          style={{ marginBottom: '12px' }}
        >
          {STRINGS[locale].VERIFY_FIN_TITLE}
        </Typography>
        <Typography>{STRINGS[locale].VERIFY_FIN_HELP}</Typography>
        <TextField
          fullWidth
          autoFocus
          error={Boolean(errorMessage)}
          placeholder={STRINGS[locale].VERIFY_FIN_FIN_PLACEHOLDER}
          value={fin}
          variant="outlined"
          onChange={onFinChanged}
          helperText={errorMessage || ' '}
          style={{
            marginBottom: '12px',
          }}
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
          {STRINGS[locale].NEXT}
        </PrimaryButton>
      </form>
      <Footer locale={locale} />
    </Container>
  );
}

export default function VerifyFin({ locale }: SceneProps) {
  const [, userService] = useUserService();

  const [fin, setFin] = useState('');
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  useEffect(() => {
    if (userService) {
      userService.refreshSelf();
    }
  }, [userService]);

  const isValidFin = Boolean(fin.match(FIN_REGEX));
  const isFinWpLike = Boolean(fin.match(WP_SERIAL_NUMBER_REGEX));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsTouched(true);
    if (isValidFin) {
      try {
        setApiErrorMessage('');
        await validateFin(fin);
        await userService?.refreshSelf();
      } catch (error) {
        setApiErrorMessage(
          // TODO assume the FIN is invalid until the backend learns better
          // error reporting.
          STRINGS[locale].VERIFY_FIN_INVALID_SN_MESSAGE
        );
      }
    }
  };

  const onFinChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    setFin(event.target.value);
  };

  let errorMessage;
  if (apiErrorMessage) {
    errorMessage = apiErrorMessage;
  } else if (!isTouched) {
    errorMessage = undefined;
  } else if (isFinWpLike) {
    errorMessage = STRINGS[locale].VERIFY_FIN_WP_LIKE_MESSAGE;
  } else if (!isValidFin) {
    errorMessage = STRINGS[locale].VERIFY_FIN_INVALID_SN_MESSAGE;
  } else {
    errorMessage = undefined;
  }

  return (
    <VerifyFinPresenter
      {...{
        onSubmit,
        onFinChanged,
        locale,
        fin,
        setFin,
        errorMessage,
      }}
    />
  );
}
