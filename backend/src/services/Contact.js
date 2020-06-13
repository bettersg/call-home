const { sanitizeDbErrors } = require('./lib');

function ContactService(ContactModel) {
  async function listContacts() {
    return ContactModel.findAll({
      order: ['name'],
    });
  }

  async function listContactsByUserId(UserId) {
    return ContactModel.findAll({
      order: ['name'],
      where: {
        UserId,
      },
    });
  }

  async function createContact(UserId, contact) {
    const contactToCreate = {
      ...contact,
      UserId,
    };
    return sanitizeDbErrors(() => ContactModel.create(contactToCreate));
  }

  // TODO revisit the assumption of using the user id
  async function getContact(UserId, contactId) {
    return ContactModel.findOne({
      where: {
        id: contactId,
        UserId,
      },
    });
  }

  async function updateContact(UserId, contactId, contact) {
    await ContactModel.update(contact, {
      where: {
        id: contactId,
        UserId,
      },
    });
    return getContact(UserId, contactId);
  }

  async function deleteContact(UserId, contactId) {
    const contact = await getContact(UserId, contactId);
    await contact.destroy();
  }

  return {
    listContacts,
    listContactsByUserId,
    createContact,
    getContact,
    updateContact,
    deleteContact,
  };
}

module.exports = ContactService;
