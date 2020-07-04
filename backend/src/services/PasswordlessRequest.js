const { sanitizeDbErrors } = require('./lib');

function PasswordlessRequestService(PasswordlessRequestModel) {
  async function createPasswordlessRequest(UserId) {
    const createdPasswordlessRequest = await sanitizeDbErrors(() =>
      PasswordlessRequestModel.create({
        UserId,
        requestTime: new Date(),
      })
    );
    return createdPasswordlessRequest;
  }

  async function getPasswordlessRequestsByUserId(UserId) {
    return PasswordlessRequestModel.findAll({
      order: ['requestTime'],
      where: {
        UserId,
      },
    });
  }

  return {
    createPasswordlessRequest,
    getPasswordlessRequestsByUserId,
  };
}

module.exports = PasswordlessRequestService;
