import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
    <Routes>
      <Route path={PATHS.ADMIN} element={<AdminPage />} />
      <Route
        path={PATHS.CALLING}
        element={<CallingPage locale={locale} routePath={PATHS.CALLING} />}
      />
      <Route path={PATHS.TRANSACTIONS} element={<TransactionsPage />} />
      <Route
        path={PATHS.PROMO_CODE}
        element={<PromoCode locale={locale} routePath={PATHS.PROMO_CODE} />}
      />
      <Route
        path={PATHS.RECENT_CALLS}
        element={<RecentCallsPage locale={locale} />}
      />
      <Route
        path={PATHS.VERIFY}
        element={<Verify locale={locale} routePath={PATHS.VERIFY} />}
      />
      <Route
        path="/*"
        element={<Home locale={locale} routePath={PATHS.HOME} />}
      />
    </Routes>
  );
}
