const express = require('express');
const {
  parseContactRequestBody,
  contactToContactResponse,
} = require('./transformers');

function ContactRoutes(contactService) {
  const router = express.Router();

  router.get('/:userId/contacts/', async (req, res) => {
    const { userId } = req.params;
    const contacts = await contactService.listContactsByUserId(Number(userId));
    return res.status(200).json(contacts.map(contactToContactResponse));
  });

  router.post(
    '/:userId/contacts/',
    parseContactRequestBody,
    async (req, res) => {
      const { userId } = req.params;
      const contact = req.body;
      try {
        console.log('CREATING', userId, contact);
        const savedContact = await contactService.createContact(
          Number(userId),
          contact
        );
        return res.status(200).json(contactToContactResponse(savedContact));
      } catch (e) {
        // TODO do this smarter
        if (e.message.startsWith('Validation Error:')) {
          return res.status(400).send(e.message);
        }
        if (e.message.startsWith('Invalid country code')) {
          return res.status(400).send(e.message);
        }
        return res.status(500);
      }
    }
  );

  router.put(
    '/:userId/contacts/:contactId',
    parseContactRequestBody,
    async (req, res) => {
      const { userId, contactId } = req.params;
      const contact = req.body;
      const savedContact = await contactService.updateContact(
        userId,
        contactId,
        contact
      );
      res.status(200).json(contactToContactResponse(savedContact));
    }
  );

  router.delete('/:userId/contacts/:contactId', async (req, res) => {
    const { userId, contactId } = req.params;
    await contactService.deleteContact(Number(userId), contactId);
    res.status(200).send();
  });
  return router;
}

module.exports = ContactRoutes;
