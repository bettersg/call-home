import React, { useState, useEffect, FormEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import { useRedeemableCodeService } from 'contexts';
import useQuery from '../util/useQuery';
import Container from '../components/shared/Container';

import { PrimaryButton } from '../components/shared/RoundedButton';
import { useRouting } from './paths';
import { SceneProps } from './types';

// TODO figure out where to put these later
const EN_STRINGS = {};
const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

export default function ClaimRedeemableCode({ locale, routePath }: SceneProps) {
  const [, redeemableCodeService] = useRedeemableCodeService();
  const routeResult = useRouting(routePath);
  const [code, setCode] = useState('');
  const query = useQuery();

  useEffect(() => {
    const queryCode = query.get('code');
    if (queryCode) {
      setCode(queryCode);
    }
  }, [query]);

  if (routeResult.shouldRender) {
    return routeResult.renderElement;
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    redeemableCodeService?.redeemCode(code);
  };

  return (
    <Container>
      <form onSubmit={onSubmit}>
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
        >
          {(STRINGS as any)[locale].VERIFY_PHONE_NUMBER_NEXT}
        </PrimaryButton>
      </form>
    </Container>
  );
}
