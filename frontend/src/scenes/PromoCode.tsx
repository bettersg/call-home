import React, { useState, useEffect, FormEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useRedeemableCodeService } from 'contexts';
import useQuery from '../util/useQuery';
import Container from '../components/shared/Container';

import { PrimaryButton } from '../components/shared/RoundedButton';
import { useAuthRouting } from './paths';
import { SceneProps } from './types';

// TODO figure out where to put these later
const EN_STRINGS = {
  PROMO_CODE_TITLE: 'Enter your promo code here!',
  SUBMIT: 'Submit',
};
const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

export default function PromoCode({ locale, routePath }: SceneProps) {
  const [, redeemableCodeService] = useRedeemableCodeService();
  const routeResult = useAuthRouting(routePath);
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

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    redeemableCodeService?.redeemCode(code);
  };

  return (
    <Container>
      <Typography variant="h5" component="h1" style={{ marginBottom: '12px' }}>
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
      </form>
    </Container>
  );
}
