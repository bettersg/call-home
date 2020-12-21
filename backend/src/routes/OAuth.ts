import url from 'url';
import querystring from 'querystring';
import { Router } from 'express';
import passport from 'passport';
import type { User as UserService } from '../services';

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = process.env;

function OAuthRoutes(userService: typeof UserService): Router {
  const router = Router();

  router.get(
    '/login/facebook',
    passport.authenticate('auth0', {
      scope: `openid email profile`,
      connection: 'facebook',
    } as any),
    (req, res) => {
      req.log.info('Received login');
      return res.redirect('/');
    }
  );

  router.get(
    '/login/google',
    passport.authenticate('auth0', {
      scope: `openid email profile`,
      connection: 'google-oauth2',
    } as any),
    (req, res) => {
      req.log.info('Received login');
      return res.redirect('/');
    }
  );

  router.get('/callback', async (req, res) => {
    // eslint-disable-next-line
    passport.authenticate('auth0', async (err, user, info) => {
      req.log.info('Received auth0 user', user);
      if (err) {
        return req.session.destroy(() => {
          req.log.error('Error when logging in user, redirecting to root', err);
          return res.redirect('/');
        });
      }
      if (!user) {
        return res.redirect('/login');
      }

      req.logIn(user, async (reqErr) => {
        if (reqErr) {
          req.log.error('Error when logging in user, redirecting to root', err);
          return res.redirect('/');
        }

        const { returnTo } = (req as any).session;
        delete (req as any).session.returnTo;

        const auth0Id = user.user_id || user.id;
        if (!auth0Id) {
          req.log.error('Auth0Id was missing, cannot save');
          res.redirect(returnTo || '/');
          return null;
        }

        const emails = (user.emails || []).map((email: any) => email.value);
        const dbUser = await userService.getUserByEmails(emails);

        if (dbUser) {
          await userService.updateUser(dbUser.id, {
            ...dbUser,
            auth0Id,
          });
        } else {
          await userService.registerUserWithAuth0Id(auth0Id, {
            name: user.displayName,
            email: emails[0], // this is intentionally undefined sometimes
          });
        }

        req.log.info('Successfully logged in');
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

    return res.redirect(String(logoutURL));
  });

  return router;
}

export default OAuthRoutes;
