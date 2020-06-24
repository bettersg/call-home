const url = require('url');
const querystring = require('querystring');
const express = require('express');
const passport = require('passport');
const { User: UserService } = require('../services');

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = process.env;

function OAuthRoutes() {
  const router = express.Router();

  router.get(
    '/login',
    passport.authenticate('auth0', {
      scope: `openid email profile`,
      connection: 'facebook',
    }),
    (req, res) => {
      console.log('Received login');
      return res.redirect('/');
    }
  );

  router.get('/callback', async (req, res, next) => {
    // eslint-disable-next-line
    passport.authenticate('auth0', async (err, user, info) => {
      if (err) {
        return req.session.destroy(() => {
          return next(err);
        });
      }
      if (!user) {
        return res.redirect('/login');
      }

      await UserService.registerUser(
        user.emails.map((email) => email.value),
        user.displayName
      );

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

    const returnTo = `https://${req.hostname}`;
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
