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
      <form onSubmit={onSubmit} style={{ height: '100%' }}>
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
