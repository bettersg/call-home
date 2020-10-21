// const { sendSms } = require('./TwilioClient');
const { UserTypes } = require('../models');
const { sanitizeDbErrors } = require('./lib');

function AllowlistEntryService(AllowlistEntryModel) {
  async function getAllowlistEntryByPhoneNumber(phoneNumber) {
    return AllowlistEntryModel.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  async function listAllowlistEntries() {
    return AllowlistEntryModel.findAll();
  }

  async function createAllowlistEntry({ phoneNumber, destinationCountry }) {
    const dbResponse = await sanitizeDbErrors(() =>
      AllowlistEntryModel.create({
        role: UserTypes.USER,
        phoneNumber,
        destinationCountry,
      })
    );
    // await sendSms('Welcome to Call Home. Your account is ready!', phoneNumber);
    return dbResponse;
  }

  async function deleteAllowlistEntry(id) {
    const allowlistEntry = await AllowlistEntryModel.findOne({
      where: {
        id,
      },
    });
    await allowlistEntry.destroy();
  }

  return {
    getAllowlistEntryByPhoneNumber,
    listAllowlistEntries,
    createAllowlistEntry,
    deleteAllowlistEntry,
  };
}

module.exports = AllowlistEntryService;
