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

  router.get('/callback', async (req, res) => {
    // eslint-disable-next-line
    passport.authenticate('auth0', async (err, user, info) => {
      console.log('Received auth0 user', user);
      if (err) {
        return req.session.destroy(() => {
          console.error('Error when logging in user, redirecting to root', err);
          return res.redirect('/');
        });
      }
      if (!user) {
        return res.redirect('/login');
      }

      req.logIn(user, async (reqErr) => {
        if (reqErr) {
          console.error('Error when logging in user, redirecting to root', err);
          return res.redirect('/');
        }

        if (user.emails) {
          await UserService.registerUser(
            user.emails.map((email) => email.value),
            user.displayName
          );
        } else {
          const auth0Id = user.user_id || user.id;
          if (!auth0Id) {
            console.error('User did not give email, cannot save');
          } else {
            await UserService.registerUserWithAuth0Id(
              auth0Id,
              user.displayName
            );
          }
        }

        const { returnTo } = req.session;
        delete req.session.returnTo;
        console.log('Successfully logged in');
        res.redirect(returnTo || '/');
        return null;
      });
    })(req, res);
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

    return res.redirect(logoutURL);
  });

  return router;
}

module.exports = OAuthRoutes;
