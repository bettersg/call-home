// TODO this doesn't do the DI correctly
const { User: UserService } = require('../services');
const { UserTypes } = require('../models');

const { getUserByEmail } = UserService;
// TODO don't hardcode this
const LOGIN_ROUTE = '/oauth/login';

async function httpsRedirect(req, res, next) {
  // Detect the protocol of the user's request. Reading req.protocol does not work.
  // https://devcenter.heroku.com/articles/http-routing#heroku-headers
  if (req.headers['x-forwarded-proto'] !== 'https') {
    console.log('Detected http, redirecting');
    return res.redirect(`https://${req.host}${req.originalUrl}`);
  }
  return next();
}

async function findUserRole(userProfile) {
  const emails = userProfile.emails.map(({ value }) => value);
  // TODO this is ugly but it works
  console.log('Searching for role for profile:', userProfile);
  const dbUsersForEmails = await Promise.all(
    emails.map((email) => getUserByEmail(email))
  );
  console.log('Found potential users:', dbUsersForEmails);
  const validDbUsers = dbUsersForEmails.filter((user) => user);

  return validDbUsers.reduce((bestRole, curr) => {
    // TODO this only works for two user types
    if (curr.userType === UserTypes.ADMIN || bestRole === UserTypes.ADMIN) {
      return UserTypes.ADMIN;
    }
    return curr.userType;
  }, null);
}

async function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).send('Unauthenticated');
  }
  if (req.user.role !== UserTypes.ADMIN) {
    return res.status(403).send('Need to be admin');
  }
  return next();
}

async function secureRoutes(req, res, next) {
  console.log('Securing route: ', req.originalUrl);
  console.log('Sessions', req.session);
  if (req.user) {
    console.log('Found user: ', req.user);
    const userRole = await findUserRole(req.user);
    if (!userRole) {
      console.log('Unable to find a role for', req.user);
      return res
        .status(403)
        .send(
          'Sorry, you are not a registered user. If you think this is an error, please reach out to an admin.'
        );
    }
    req.user.role = userRole;
    return next();
  }
  console.log('No user found');

  // We return a different result based on the Accept header of the request.
  // We redirect html requests to the login route
  // However, if the request is an xhr, a redirection does not work because the browser hides the intermediate HTTP redirects. Instead, we return a 403 and hint the caller to go to another location
  return res.format({
    json: () => {
      console.log('Encountered api call, sending 401');
      res.status(401).json({ location: LOGIN_ROUTE });
    },
    html: () => {
      console.log('Encountered browser request, redirecting to ', LOGIN_ROUTE);
      req.session.returnTo = req.originalUrl;
      return res.redirect(LOGIN_ROUTE);
    },
    default: () => {
      req.session.returnTo = req.originalUrl;
      return res.redirect(LOGIN_ROUTE);
    },
  });
}

module.exports = {
  httpsRedirect,
  secureRoutes,
  requireAdmin,
};
