import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Locale } from './types';
import { useUserService } from '../contexts';
import Container from '../components/shared/Container';
import { PrimaryButton } from '../components/shared/RoundedButton';
import { useRouting } from './paths';
import { validateWorkpass } from '../services/WorkpassValidation';

const EN_STRINGS = {
  VERIFY_WORKPASS_TITLE: 'Enter your work pass serial number',
  VERIFY_WORKPASS_WORKPASS_SN_LABEL: 'Work pass serial number',
  SUBMIT: 'Submit',
};
const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

const WP_SERIAL_NUMBER_REGEX = /[A-Z][0-9]+/;

export default function VerifyWorkpass({
  locale,
  routePath,
}: {
  locale: Locale;
  routePath: string;
}) {
  const routeResult = useRouting(routePath);
  const [, userService] = useUserService();

  const [wpSerialNumber, setWpSerialNumber] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  if (routeResult.shouldRender) {
    return routeResult.renderElement;
  }

  const validateSerialNumber = () =>
    Boolean(wpSerialNumber.match(WP_SERIAL_NUMBER_REGEX));
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsTouched(true);
    if (validateSerialNumber()) {
      await validateWorkpass(wpSerialNumber);
      await userService?.refreshSelf();
    }
  };

  return (
    <Container>
<<<<<<< HEAD
      <form onSubmit={onSubmit} style={{ height: '100%' }}>
=======
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton onClick={navToContacts}>
          <CloseIcon />
        </IconButton>
      </div>
      <form
        onSubmit={onSubmit}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
>>>>>>> upstream/master
        <Typography
          variant="h5"
          component="h1"
          style={{ marginBottom: '12px' }}
        >
          {STRINGS[locale].VERIFY_WORKPASS_TITLE}
        </Typography>
        <TextField
          fullWidth
          autoFocus
          error={isTouched && !validateSerialNumber()}
          label={STRINGS[locale].VERIFY_WORKPASS_WORKPASS_SN_LABEL}
          value={wpSerialNumber}
          variant="outlined"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setIsTouched(true);
            setWpSerialNumber(event.target.value);
          }}
        />
        <PrimaryButton
          disableFocusRipple
          color="primary"
          type="submit"
          value="submit"
        >
          {STRINGS[locale].SUBMIT}
        </PrimaryButton>
      </form>
    </Container>
  );
}
<<<<<<< HEAD
=======

export default function VerifyWorkpass({ locale, routePath }: SceneProps) {
  const routeResult = useRouting(routePath);
  const [, userService] = useUserService();

  const [wpSerialNumber, setWpSerialNumber] = useState('');
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const isValidSerialNumber = Boolean(
    wpSerialNumber.match(WP_SERIAL_NUMBER_REGEX)
  );
  const isSerialNumberFINLike = Boolean(wpSerialNumber.match(FIN_REGEX));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsTouched(true);
    if (isValidSerialNumber) {
      try {
        setApiErrorMessage(' ');
        await validateWorkpass(wpSerialNumber);
        await userService?.refreshSelf();
      } catch (error) {
        if (!error.data) {
          setApiErrorMessage(
            STRINGS[locale].VERIFY_WORKPASS_UNKNOWN_SN_MESSAGE
          );
        } else if (error.data.reason?.code === 'conflict') {
          setApiErrorMessage(
            STRINGS[locale].VERIFY_WORKPASS_CONFLICTING_SN_MESSAGE
          );
        } else if (error.data.reason?.code === 'expired') {
          setApiErrorMessage(
            STRINGS[locale].VERIFY_WORKPASS_EXPIRED_SN_MESSAGE
          );
        } else if (error.data.reason?.code === 'error') {
          setApiErrorMessage(
            STRINGS[locale].VERIFY_WORKPASS_INVALID_API_SN_MESSAGE
          );
        } else {
          setApiErrorMessage(
            STRINGS[locale].VERIFY_WORKPASS_UNKNOWN_SN_MESSAGE
          );
        }
      }
    }
  };

  const onWpSerialNumberChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsTouched(true);
    setWpSerialNumber(event.target.value);
  };

  const navToContacts = () => userService?.setShouldDismissWorkpasssModal(true);

  if (routeResult.shouldRender) {
    return routeResult.renderElement;
  }

  let errorMessage;
  if (apiErrorMessage) {
    errorMessage = apiErrorMessage;
  } else if (!isTouched) {
    errorMessage = undefined;
  } else if (isSerialNumberFINLike) {
    errorMessage = STRINGS[locale].VERIFY_WORKPASS_FINLIKE_SN_MESSAGE;
  } else if (!isValidSerialNumber) {
    errorMessage = STRINGS[locale].VERIFY_WORKPASS_INVALID_SN_MESSAGE;
  } else {
    errorMessage = undefined;
  }

  return (
    <VerifyWorkpassPresenter
      {...{
        onSubmit,
        onWpSerialNumberChanged,
        locale,
        wpSerialNumber,
        setWpSerialNumber,
        errorMessage,
        navToContacts,
      }}
    />
  );
}
>>>>>>> upstream/master
