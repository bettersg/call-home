function WhitelistEntryService(WhitelistEntryModel) {
  async function getWhitelistEntryByPhoneNumber(phoneNumber) {
    return WhitelistEntryModel.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  return {
    getWhitelistEntryByPhoneNumber,
  };
}

module.exports = WhitelistEntryService;
