import type { NextFunction, Request, Response } from 'express';

// TODO don't hardcode this
import { User as UserService } from '../services';
import { UserTypes } from '../models';
import transformers = require('./transformers');

const { userToUserResponse, userProfileToUserProfileResponse } = transformers;
const LOGIN_ROUTE = '/';

const AUTH0_ID_FOR_DEVELOPMENT = 'development|user';
const AUTH0_EMAIL_FOR_DEVELOPMENT = 'user@example.com';

export interface CallHomeRequest extends Request {
  // TODO unfortunately, this interface may have multiple shapes depending on the middleswares. This is more of a stopgap measure.
  user: any;
  session: any;
  logIn: { (user: any, callback: { (err: any): any }): any };
}

function sendForbiddenResponse(req: CallHomeRequest, res: Response) {
  res.format({
    json: () => {
      req.log.info('Encountered api call, sending 401');
      return res.status(401).json({ location: LOGIN_ROUTE });
    },
    html: () => {
      req.log.info('Encountered browser request, redirecting to ', LOGIN_ROUTE);
      req.session.returnTo = req.originalUrl;
      return res.redirect(LOGIN_ROUTE);
    },
    default: () => {
      req.session.returnTo = req.originalUrl;
      return res.redirect(LOGIN_ROUTE);
    },
  });
}

async function httpsRedirect(req: Request, res: Response, next: NextFunction) {
  // Detect the protocol of the user's request. Reading req.protocol does not work.
  // https://devcenter.heroku.com/articles/http-routing#heroku-headers
  if (req.headers['x-forwarded-proto'] !== 'https') {
    req.log.info('Detected http, redirecting');
    return res.redirect(`https://${req.host}${req.originalUrl}`);
  }
  return next();
}

async function injectDbUser(req: CallHomeRequest) {
  // This returns the OAuth user info
  const { _raw, _json, ...userProfile } = req.user;
  const { emails } = userProfile;
  req.log.info('Injecting for profile', userProfile);
  const userProfileResponse = userProfileToUserProfileResponse(userProfile);
  let auth0Id = userProfile.userId || userProfile.id;
  if (process.env.BYPASS_AUTH0_LOGIN === 'yes') {
    auth0Id = AUTH0_ID_FOR_DEVELOPMENT;
  }
  let user;
  if (emails) {
    user = await UserService.getUserByEmails(
      emails.map((emailValue: any) => emailValue.value)
    );
    if (user && !user.auth0Id) {
      user = await UserService.updateUser(user.id, {
        ...user,
        auth0Id,
      });
    }
  }

  if (!user) {
    if (auth0Id) {
      user = await UserService.getUserByAuth0Id(auth0Id);
    } else {
      req.user = userProfile;
      return;
    }
  }

  if (!user) {
    // TODO think about this more carefully
    req.log.error(
      '===================================no user found, what do i do???'
    );
    return;
  }
  const userResponse = userToUserResponse(user);
  req.user = {
    ...userProfileResponse,
    ...userResponse,
  };
}

async function requireAdmin(
  req: CallHomeRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).send('Unauthenticated');
  }
  if (req.user.role !== UserTypes.ADMIN) {
    return res.status(403).send('Need to be admin');
  }
  return next();
}

async function requireVerified(
  req: CallHomeRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !req.user.isVerified) {
    sendForbiddenResponse(req, res);
    return;
  }
  next();
}

async function requireSelf(
  req: CallHomeRequest,
  res: Response,
  next: NextFunction
) {
  const { userId: userIdString } = req.params;
  const userId = Number(userIdString);
  if (!req.user || !userId || req.user.id !== userId) {
    sendForbiddenResponse(req, res);
    return;
  }
  next();
}

function upsertUserForDevelopment(req: CallHomeRequest, res: Response) {
  const auth0Id = AUTH0_ID_FOR_DEVELOPMENT;
  const email = AUTH0_EMAIL_FOR_DEVELOPMENT;
  return new Promise((resolve) => {
    UserService.registerUserWithAuth0Id(auth0Id, {
      name: AUTH0_ID_FOR_DEVELOPMENT,
      email,
    })
      .then(() => {
        return UserService.getUserByAuth0Id(auth0Id);
      })
      .then(async (_user) => {
        const user = _user;
        if (user) {
          user.isPhoneNumberValidated = true;
          user.phoneNumber = process.env.DEV_USER_PHONE_NUMBER;
          user.destinationCountry = 'SG';
          user.role = UserTypes.ADMIN;
          await user.save();
          await user.reload();
        }
        const userResponse = userToUserResponse(user);
        req.logIn({ ...userResponse, emails: [{ value: email }] }, function () {
          res.redirect('/');
          resolve();
        });
      });
  });
}

async function secureRoutes(
  req: CallHomeRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user && process.env.BYPASS_AUTH0_LOGIN === 'yes') {
    await upsertUserForDevelopment(req, res);
  }
  if (req.user) {
    await injectDbUser(req);
    return next();
  }
  req.log.info('No user found');

  // We return a different result based on the Accept header of the request.
  // We redirect html requests to the login route
  // However, if the request is an xhr, a redirection does not work because the browser hides the intermediate HTTP redirects. Instead, we return a 403 and hint the caller to go to another location
  return sendForbiddenResponse(req, res);
}

export {
  httpsRedirect,
  secureRoutes,
  requireAdmin,
  requireVerified,
  requireSelf,
};
