import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PATHS from './paths';
import {
  Login,
  CallingPage,
  ContactsPage,
  VerifyPhoneNumber,
  VerifyPhoneNumberCode,
} from './index';

export default function SceneRouter() {
  // TODO make this switchable and also en is not a locale
  const locale = 'en';

  return (
    <Switch>
      <Route path={PATHS.VERIFY_PHONE_NUMBER_CODE}>
        <VerifyPhoneNumberCode locale={locale} />
      </Route>
      <Route path={PATHS.VERIFY_PHONE_NUMBER}>
        <VerifyPhoneNumber locale={locale} />
      </Route>
      <Route path={PATHS.CALLING}>
        <CallingPage locale={locale} />
      </Route>
      <Route path={PATHS.CONTACTS}>
        <ContactsPage locale={locale} />
      </Route>
      <Route path={PATHS.LOGIN}>
        <Login locale={locale} />
      </Route>
    </Switch>
  );
}
