const url = require('url');
const querystring = require('querystring');
const express = require('express');
const passport = require('passport');

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = process.env;

function OAuthRoutes() {
  const router = express.Router();

  router.get(
    '/login',
    passport.authenticate('auth0', {
      scope: `openid email profile`,
      connection: 'google-oauth2',
    }),
    (req, res) => {
      console.log('Received login');
      return res.redirect('/');
    }
  );

  router.get('/callback', (req, res, next) => {
    // eslint-disable-next-line
    passport.authenticate('auth0', (err, user, info) => {
      if (err) {
        return req.session.destroy(() => {
          return next(err);
        });
      }
      if (!user) {
        return res.redirect('/login');
      }
      if (user.emails == null) {
        user.emails = [
          { value: `${user.nickname.replace('+', '')}@openid.com` },
        ]; //TODO: Hack, should add openid column
      }
      req.logIn(user, (reqErr) => {
        if (reqErr) {
          return next(reqErr);
        }
        const { returnTo } = req.session;
        delete req.session.returnTo;
        console.log('Successfully logged in');
        res.redirect(returnTo || '/');
        return null;
      });
    })(req, res, next);
  });

  // Perform session logout and redirect to homepage
  router.get('/logout', (req, res) => {
    req.logout();

    let returnTo = `${req.protocol}://${req.hostname}`;
    const port = req.connection.localPort;
    // Nice
    if (port !== undefined && port !== 80 && port !== 443) {
      returnTo += `:${port}`;
    }
    const logoutURL = new url.URL(`https://${AUTH0_DOMAIN}/v2/logout`);

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
