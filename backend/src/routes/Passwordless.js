const express = require('express');
const { normalizePhoneNumber } = require('../util/country');

const PASSWORDLESS_REQUEST_INTERVAL_MILLIS = 1000 * 60 * 2;
function PasswordlessRoutes(
  userService,
  auth0Service,
  passwordlessRequestService
) {
  const router = express.Router();

  router.post('/begin', async (req, res) => {
    const { id } = req.user;
    if (!id) {
      // TODO remove
      console.error('wtf something is going wrong');
    }
    const passwordlessRequests = await passwordlessRequestService.getPasswordlessRequestsByUserId(
      id
    );
    const lastRequest = passwordlessRequests[passwordlessRequests.length - 1];
    if (
      lastRequest &&
      new Date() - lastRequest.requestTime <=
        PASSWORDLESS_REQUEST_INTERVAL_MILLIS
    ) {
      return res.status(403).json({
        message: 'PASSWORDLESS_RATE_LIMITED',
        body: new Date(
          lastRequest.requestTime.getTime() +
            PASSWORDLESS_REQUEST_INTERVAL_MILLIS
        ),
      });
    }

    const { phoneNumber } = req.body;
    console.log('Beginning passwordless for', phoneNumber);
    try {
      const formattedPhoneNumber = await normalizePhoneNumber(
        phoneNumber,
        'SG'
      );
      console.log('Phone number is: ', formattedPhoneNumber);
      await auth0Service.sendSms(formattedPhoneNumber);
      await passwordlessRequestService.createPasswordlessRequest(id);
    } catch (e) {
      console.error(e);
    }
    return res.redirect('/');
  });

  router.post('/login', async (req, res) => {
    const { phoneNumber: rawPhoneNumber, code } = req.body;
    const phoneNumber = await normalizePhoneNumber(rawPhoneNumber, 'SG');

    const { id: userId } = req.user;
    if (!phoneNumber || !code) {
      return res.status(400).send();
    }
    try {
      console.log('Received login attempt');
      const token = await auth0Service.signIn(phoneNumber, code);
      console.log('Received a token', token);
      const user = await userService.verifyUserPhoneNumber(userId, phoneNumber);
      if (!user.isPhoneNumberValidated) {
        return res.status(403).json({ message: 'NOT_WHITELISTED' });
      }
      return res.redirect('/');
    } catch (e) {
      console.error(e);
      console.dir(e);
      const { response } = e;
      if (response && response.data && response.data.error) {
        if (response.data.error === 'invalid_grant') {
          res.status(403).json({ message: 'BAD_OTP' });
        }
      }
      return res.status(403).send();
    }
  });

  return router;
}

module.exports = PasswordlessRoutes;
