const { sanitizeDbErrors } = require('./lib');
const { normalizePhoneNumber } = require('../util/country');

function ContactService(ContactModel, userService) {
  async function listContacts() {
    return ContactModel.findAll({
      order: ['name'],
    });
  }

  async function normalizeContact(user, contact) {
    return {
      ...contact,
      phoneNumber: await normalizePhoneNumber(
        contact.phoneNumber,
        user.destinationCountry
      ),
      UserId: user.id,
    };
  }

  async function validateContact(user, contact) {
    if (!contact.name) {
      throw new Error('Validation Error: CONTACT_NAME_BLANK');
    }

    const phoneNumber = await normalizePhoneNumber(
      contact.phoneNumber,
      user.destinationCountry
    );

    const duplicateContact = await ContactModel.findOne({
      where: {
        UserId: user.id,
        phoneNumber,
      },
    });

    if (duplicateContact) {
      throw new Error('Validation Error: DUPLICATE_CONTACT');
    }
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
    const user = await userService.getUser(UserId);
    await validateContact(user, contact);
    const contactToCreate = await normalizeContact(user, contact);
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
    const user = await userService.getUser(UserId);
    await validateContact(user, contact);
    const contactToUpdate = await normalizeContact(user, contact);
    await ContactModel.update(contactToUpdate, {
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
