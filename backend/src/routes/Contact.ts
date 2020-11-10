import express, { Router } from 'express';
import * as z from 'zod';
import {
  parseContactRequestBody,
  contactToContactResponse,
  handleServiceError,
} from './transformers';
import { requireSelf } from './middlewares';

import type { Contact } from '../services';
import {
  stringToNumberTransformer,
  validateRequest,
} from './helpers/validation';

const GET_SCHEMA = z.object({
  params: z.object({
    userId: stringToNumberTransformer,
  }),
});

const POST_SCHEMA = z.object({
  params: z.object({
    userId: stringToNumberTransformer,
  }),
  body: z.object({
    name: z.string(),
    phoneNumber: z.string(),
    avatar: z.string(),
  }),
});

const PUT_SCHEMA = z.object({
  params: z.object({
    userId: stringToNumberTransformer,
    contactId: stringToNumberTransformer,
  }),
  body: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

const DELETE_SCHEMA = z.object({
  params: z.object({
    userId: stringToNumberTransformer,
    contactId: stringToNumberTransformer,
  }),
});

function ContactRoutes(contactService: typeof Contact): Router {
  const router = express.Router();

  router.get(
    '/:userId/contacts/',
    requireSelf,
    validateRequest(GET_SCHEMA, async (parsedReq, res) => {
      const { userId } = parsedReq.params;
      const contacts = await contactService.listContactsByUserId(userId);
      return res.status(200).json(contacts.map(contactToContactResponse));
    })
  );

  router.post(
    '/:userId/contacts/',
    requireSelf,
    parseContactRequestBody,
    validateRequest(POST_SCHEMA, async (parsedReq, res, req) => {
      const { userId } = parsedReq.params;
      const contact = parsedReq.body;
      try {
        req.log.info('CREATING', userId, contact);
        const savedContact = await contactService.createContact(
          userId,
          contact
        );
        res.status(200).json(contactToContactResponse(savedContact));
      } catch (e) {
        handleServiceError(e, res);
      }
    })
  );

  router.put(
    '/:userId/contacts/:contactId',
    requireSelf,
    parseContactRequestBody,
    validateRequest(PUT_SCHEMA, async (parsedReq, res) => {
      const { userId, contactId } = parsedReq.params;
      const contact = parsedReq.body;
      try {
        const savedContact = await contactService.updateContact(
          userId,
          contactId,
          contact
        );
        res.status(200).json(contactToContactResponse(savedContact));
      } catch (e) {
        handleServiceError(e, res);
      }
    })
  );

  router.delete(
    '/:userId/contacts/:contactId',
    requireSelf,
    validateRequest(DELETE_SCHEMA, async (parsedReq, res) => {
      const { userId, contactId } = parsedReq.params;
      await contactService.deleteContact(Number(userId), contactId);
      res.status(200).send();
    })
  );
  return router;
}

export default ContactRoutes;
