const express = require('express');
const passport = require('passport');

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = process.env;

const GOOGLE_SHEETS_SCOPE =
  'https://www.googleapis.com/auth/spreadsheets.readonly';

function OAuthRoutes() {
  const router = express.Router();

  router.get(
    '/login',
    passport.authenticate('auth0', {
      scope: `openid email profile`,
      connection: 'google-oauth2',
    }),
    (req, res) => {
      res.redirect('/');
    }
  );

  router.get('/callback', (req, res, next) => {
    passport.authenticate('auth0', (err, user, info) => {
      if (err) {
        return req.session.destroy(() => {
          return next(err);
        });
      }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        const { returnTo } = req.session;
        delete req.session.returnTo;
        console.log('Successfully logged in');
        res.redirect(returnTo || '/');
      });
    })(req, res, next);
  });

  // Perform session logout and redirect to homepage
  router.get('/logout', (req, res) => {
    req.logout();

    const returnTo = `${req.protocol}://${req.hostname}`;
    const port = req.connection.localPort;
    // Nice
    if (port !== undefined && port !== 80 && port !== 443) {
      returnTo += `:${port}`;
    }
    const logoutURL = new url.URL(
      util.format('https://%s/v2/logout', AUTH0_DOMAIN)
    );

    const searchString = querystring.stringify({
      client_id: AUTH0_CLIENT_ID,
      returnTo,
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL);
  });

  return router;
}

module.exports = OAuthRoutes;
