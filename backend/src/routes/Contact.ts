import express, { Router } from 'express';
import * as z from 'zod';
import {
  parseContactRequestBody,
  contactToContactResponse,
  handleServiceError,
} from './transformers';
import { requireSelf } from './middlewares';

import type { Contact } from '../services';
import { logger } from '../config';
import { stringToNumberTransformer } from './helpers/validation';

function ContactRoutes(contactService: typeof Contact): Router {
  const router = express.Router();

  router.get('/:userId/contacts/', requireSelf, async (req, res) => {
    let validatedReq;
    try {
      const paramsSchema = z.object({
        userId: stringToNumberTransformer,
      });
      const params = paramsSchema.parse(req.params);
      validatedReq = { params };
    } catch (error) {
      logger.error(error);
      return res.status(400).send(error);
    }

    const { userId } = validatedReq.params;
    const contacts = await contactService.listContactsByUserId(userId);
    return res.status(200).json(contacts.map(contactToContactResponse));
  });

  router.post(
    '/:userId/contacts/',
    requireSelf,
    parseContactRequestBody,
    async (req, res) => {
      let validatedReq;
      try {
        const paramsSchema = z.object({
          userId: stringToNumberTransformer,
        });
        const bodySchema = z.object({
          name: z.string(),
          phoneNumber: z.string(),
          avatar: z.string(),
        });
        const params = paramsSchema.parse(req.params);
        const body = bodySchema.parse(req.body);
        validatedReq = { params, body };
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }

      const { userId } = validatedReq.params;
      const contact = validatedReq.body;
      try {
        req.log.info('CREATING', userId, contact);
        const savedContact = await contactService.createContact(
          userId,
          contact
        );
        return res.status(200).json(contactToContactResponse(savedContact));
      } catch (e) {
        return handleServiceError(e, res);
      }
    }
  );

  router.put(
    '/:userId/contacts/:contactId',
    requireSelf,
    parseContactRequestBody,
    async (req, res) => {
      let validatedReq;
      try {
        const paramsSchema = z.object({
          userId: stringToNumberTransformer,
          contactId: stringToNumberTransformer,
        });
        const bodySchema = z.object({
          name: z.string().optional(),
          phoneNumber: z.string().optional(),
          avatar: z.string().optional(),
        });
        const params = paramsSchema.parse(req.params);
        const body = bodySchema.parse(req.body);
        validatedReq = { params, body };
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }

      const { userId, contactId } = validatedReq.params;
      const contact = validatedReq.body;
      try {
        const savedContact = await contactService.updateContact(
          userId,
          contactId,
          contact
        );
        return res.status(200).json(contactToContactResponse(savedContact));
      } catch (e) {
        return handleServiceError(e, res);
      }
    }
  );

  router.delete(
    '/:userId/contacts/:contactId',
    requireSelf,
    async (req, res) => {
      let validatedReq;
      try {
        const paramsSchema = z.object({
          userId: stringToNumberTransformer,
          contactId: stringToNumberTransformer,
        });
        const params = paramsSchema.parse(req.params);
        validatedReq = { params };
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }

      const { userId, contactId } = validatedReq.params;
      await contactService.deleteContact(userId, contactId);
      return res.status(200).send();
    }
  );
  return router;
}

export default ContactRoutes;
