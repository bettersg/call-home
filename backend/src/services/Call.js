const { sanitizeDbErrors } = require('./lib');
const { UserTypes } = require('../models');

// TODO The DI is a mess
function CallService(CallModel, userService, calleeService) {
  async function validateCall(userEmail, calleeId) {
    const user = await userService.getUser(userEmail);
    console.log('Call for callee', calleeId);
    console.log('Creating call for user', userEmail);
    console.dir(user);
    if (user.userType === UserTypes.ADMIN) {
      return true;
    }
    console.log("User's callees", user.callees);
    console.log(
      'User has callee',
      user.callees.findIndex((callee) => callee.id === calleeId) < 0
    );

    if (user.callees.findIndex((callee) => callee.id === calleeId) < 0) {
      throw new Error(`Authorization error for user ${userEmail}`);
    }
    return true;
  }

  async function createCall({ userEmail, calleeId }) {
    validateCall(userEmail, calleeId);
    const callee = await calleeService.getCallee(calleeId);
    const call = {
      phoneNumber: callee.phoneNumber,
      userEmail,
    };
    return sanitizeDbErrors(() => CallModel.create(call));
  }
  return {
    createCall,
  };
}

module.exports = CallService;
