const { sanitizeDbErrors } = require('./lib');

// TODO The DI is a mess
function CallService(CallModel, userService, contactService) {
  async function validateCall(userId, contactId) {
    const userContacts = await contactService.listContactsByUserId(userId);

    console.log('validating call for', userId, contactId);
    console.log(userContacts);
    if (userContacts.findIndex((contact) => contact.id === contactId) < 0) {
      throw new Error(`Authorization error for user ${userId}`);
    }
    return true;
  }

  async function createCall({ userId, contactId, incomingTwilioCallSid }) {
    validateCall(userId, contactId);
    const contact = await contactService.getContact(userId, contactId);
    const call = {
      phoneNumber: contact.phoneNumber,
      contactId,
      userId,
      incomingTwilioCallSid,
    };
    return sanitizeDbErrors(() => CallModel.create(call));
  }
  return {
    createCall,
  };
}

module.exports = CallService;
