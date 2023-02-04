import express, { Router } from 'express';
import * as z from 'zod';
import type { User, PhoneLogin, PhoneNumberValidation } from '../services';
import { normalizePhoneNumber } from '../util/country';
import { validateRequest } from './helpers/validation';

const PHONE_NUMBER_REQUEST_INTERVAL_MILLIS = 1000 * 60 * 2;

const BEGIN_SCHEMA = z.object({
  body: z.object({
    phoneNumber: z.string(),
  }),
});

const LOGIN_SCHEMA = z.object({
  body: z.object({
    phoneNumber: z.string(),
    code: z.string(),
  }),
});

function PhoneNumberValidationRoutes(
  userService: typeof User,
  phoneLoginService: typeof PhoneLogin,
  phoneNumberValidationService: typeof PhoneNumberValidation
): Router {
  const router = express.Router();

  router.post(
    '/begin',
    validateRequest(BEGIN_SCHEMA, async (parsedReq, res, req) => {
      const { id } = req.user;
      if (!id) {
        req.log.error('wtf something is going wrong');
      }
      const phoneNumberValidation =
        await phoneNumberValidationService.getPhoneNumberValidationForUser(id);
      if (
        phoneNumberValidation?.lastRequestTime &&
        Number(new Date()) - Number(phoneNumberValidation.lastRequestTime) <=
          PHONE_NUMBER_REQUEST_INTERVAL_MILLIS
      ) {
        return res.status(403).json({
          message: 'PHONE_NUMBER_RATE_LIMITED',
          body: new Date(
            phoneNumberValidation.lastRequestTime.getTime() +
              PHONE_NUMBER_REQUEST_INTERVAL_MILLIS
          ),
        });
      }

      const { phoneNumber } = parsedReq.body;
      req.log.info('Beginning phone number validation for', phoneNumber);
      try {
        const formattedPhoneNumber = await normalizePhoneNumber(
          phoneNumber,
          'SG'
        );
        req.log.info('Phone number is: ', formattedPhoneNumber);
        await phoneLoginService.sendSms(formattedPhoneNumber);
        await phoneNumberValidationService.updatePhoneNumberValidationRequestTime(
          id
        );
      } catch (e) {
        req.log.error(e);
      }
      return res.redirect('/');
    })
  );

  router.post(
    '/login',
    validateRequest(LOGIN_SCHEMA, async (parsedReq, res, req) => {
      const { phoneNumber: rawPhoneNumber, code } = parsedReq.body;
      const phoneNumber = await normalizePhoneNumber(rawPhoneNumber, 'SG');

      const { id: userId } = req.user;
      if (!phoneNumber) {
        return res.status(400).send();
      }
      try {
        req.log.info('Received login attempt');
        await phoneLoginService.signIn(phoneNumber, code);
        await userService.verifyUserPhoneNumber(userId, phoneNumber);
        const phoneNumberValidation =
          await phoneNumberValidationService.getPhoneNumberValidationForUser(
            userId
          );
        if (!phoneNumberValidation?.isPhoneNumberValidated) {
          return res.status(403).json({ message: 'NOT_WHITELISTED' });
        }
        return res.redirect('/');
      } catch (e) {
        if (e.message === 'BAD_OTP') {
          return res.status(403).json({ message: 'BAD_OTP' });
        }
        return res.status(403).send();
      }
    })
  );

  return router;
}

export default PhoneNumberValidationRoutes;
