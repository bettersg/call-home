import express from 'express';
import {
  parseContactRequestBody,
  contactToContactResponse,
  handleServiceError,
} from './transformers';
import { requireSelf } from './middlewares';

import type { Contact } from '../services';

function ContactRoutes(contactService: typeof Contact) {
  const router = express.Router();

  router.get('/:userId/contacts/', requireSelf, async (req, res) => {
    const { userId } = req.params;
    const contacts = await contactService.listContactsByUserId(Number(userId));
    return res.status(200).json(contacts.map(contactToContactResponse));
  });

  router.post(
    '/:userId/contacts/',
    requireSelf,
    parseContactRequestBody,
    async (req, res) => {
      const { userId } = req.params;
      const contact = req.body;
      try {
        req.log.info('CREATING', userId, contact);
        const savedContact = await contactService.createContact(
          Number(userId),
          contact
        );
        res.status(200).json(contactToContactResponse(savedContact));
      } catch (e) {
        handleServiceError(e, res);
      }
    }
  );

  router.put(
    '/:userId/contacts/:contactId',
    requireSelf,
    parseContactRequestBody,
    async (req, res) => {
      const { userId, contactId } = req.params;
      const contact = req.body;
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
    }
  );

  router.delete(
    '/:userId/contacts/:contactId',
    requireSelf,
    async (req, res) => {
      const { userId, contactId } = req.params;
      await contactService.deleteContact(Number(userId), contactId);
      res.status(200).send();
    }
  );
  return router;
}

export default ContactRoutes;
