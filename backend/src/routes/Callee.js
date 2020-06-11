const express = require('express');
const {
  parseContactRequestBody,
  contactToContactResponse,
} = require('./transformers');

// Reads a req and parses the body into a contact that can be saved.
function ContactRoutes(contactService) {
  const router = express.Router();

  router.post('/', parseContactRequestBody, async (req, res) => {
    const contact = req.body;
    try {
      const savedContact = await contactService.createContact(contact);
      return res.status(200).json(contactToContactResponse(savedContact));
    } catch (e) {
      // TODO do this smarter
      if (e.message.startsWith('Validation Error:')) {
        return res.status(400).send(e.message);
      }
      return res.status(500);
    }
  });

  router.put('/:contactId', parseContactRequestBody, async (req, res) => {
    const contact = req.body;
    const savedContact = await contactService.updateContact(
      req.params.id,
      contact
    );
    res.status(200).json(contactToContactResponse(savedContact));
  });

  router.delete('/:contactId', async (req, res) => {
    await contactService.deleteContact(req.params.contactId);
    res.status(200).send();
  });
  return router;
}

module.exports = ContactRoutes;
