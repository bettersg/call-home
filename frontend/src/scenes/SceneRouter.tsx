import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PATHS from './paths';
import {
  AdminPage,
  CallingPage,
  PromoCode,
  Home,
  RecentCallsPage,
  TransactionsPage,
  Verify,
} from '.';
import { Locale } from './types';

export default function SceneRouter() {
  // TODO replace this with a proper switching logic
  const queryLang = window.location.search.startsWith('?lang=')
    ? window.location.search.substr(6, 2)
    : null;
  const localStorageLang = localStorage.getItem('lang');
  if (queryLang) {
    localStorage.setItem('lang', queryLang);
  }
  const locale: Locale =
    (queryLang as Locale) || (localStorageLang as Locale) || 'bn';

  return (
    <Switch>
      <Route path={PATHS.ADMIN}>
        <AdminPage locale={locale} routePath={PATHS.ADMIN} />
      </Route>
      <Route path={PATHS.CALLING}>
        <CallingPage locale={locale} routePath={PATHS.CALLING} />
      </Route>
      <Route path={PATHS.TRANSACTIONS}>
        <TransactionsPage />
      </Route>
      <Route path={PATHS.PROMO_CODE}>
        <PromoCode locale={locale} routePath={PATHS.PROMO_CODE} />
      </Route>
      <Route path={PATHS.RECENT_CALLS}>
        <RecentCallsPage locale={locale} />
      </Route>
      <Route path={PATHS.VERIFY}>
        <Verify locale={locale} routePath={PATHS.VERIFY} />
      </Route>
      <Route path={PATHS.HOME}>
        <Home locale={locale} routePath={PATHS.HOME} />
      </Route>
    </Switch>
  );
}
