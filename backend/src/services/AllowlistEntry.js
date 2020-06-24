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
    return sanitizeDbErrors(() =>
      AllowlistEntryModel.create({
        role: UserTypes.USER,
        phoneNumber,
        destinationCountry,
      })
    );
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
