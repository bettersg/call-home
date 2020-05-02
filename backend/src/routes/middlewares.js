// TODO this doesn't do the DI correctly
const { User: UserService } = require('../services');
const { UserTypes } = require('../models');

const { getUser } = UserService;

async function findUserRole(userProfile) {
  const emails = userProfile.emails.map(({ value }) => value);
  // TODO this is ugly but it works
  console.log('Searching for role for profile:', userProfile);
  const dbUsersForEmails = await Promise.all(
    emails.map((email) => getUser(email))
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
  console.log('securing route', req.user);
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
  console.log('No user found, redirecting');
  req.session.returnTo = req.originalUrl;
  // TODO don't hardcode this
  return res.redirect('/oauth/login');
}

module.exports = {
  secureRoutes,
  requireAdmin,
};
