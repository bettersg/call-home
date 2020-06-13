const express = require('express');

function sgfyPhoneNumber(phoneNumber) {
  if (phoneNumber.startsWith('+') && !phoneNumber.startsWith('+65')) {
    throw new Error('Invalid country code');
  }
  const noSgCode = phoneNumber.replace('+65', '');
  return `+65${noSgCode.replace(/\D/g, '')}`;
}

function PasswordlessRoutes(userService, auth0Service) {
  const router = express.Router();

  router.post('/begin', async (req, res) => {
    const { phoneNumber } = req.body;
    try {
      console.log(await auth0Service.sendSms(sgfyPhoneNumber(phoneNumber)));
    } catch (e) {
      console.error(e);
    }
    return res.redirect('/');
  });

  router.post('/login', async (req, res) => {
    console.log('LOGGING IN');
    const { phoneNumber, code } = req.body;
    const { id: userId } = req.user;
    console.log('LOGGGING INGINNNNNN', phoneNumber, code, userId);
    if (!phoneNumber || !code) {
      return res.status(400);
    }
    try {
      const token = await auth0Service.signIn(
        sgfyPhoneNumber(phoneNumber),
        code
      );
      console.log('GOT ZE TOKEN', token);
      await userService.verifyUserPhoneNumber(userId, JSON.stringify(token));
      return res.redirect('/');
    } catch (e) {
      console.error(e);
      return res.status(403);
    }
  });

  return router;
}

module.exports = PasswordlessRoutes;
