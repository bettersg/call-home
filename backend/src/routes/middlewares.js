// TODO don't hardcode this
const LOGIN_ROUTE = '/';

async function httpsRedirect(req, res, next) {
  // Detect the protocol of the user's request. Reading req.protocol does not work.
  // https://devcenter.heroku.com/articles/http-routing#heroku-headers
  if (req.headers['x-forwarded-proto'] !== 'https') {
    console.log('Detected http, redirecting');
    return res.redirect(`https://${req.host}${req.originalUrl}`);
  }
  return next();
}

async function secureRoutes(req, res, next) {
  console.log('Securing route: ', req.originalUrl);
  console.log('Sessions', req.session);
  if (req.user) {
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
};
