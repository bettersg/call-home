const { sanitizeDbErrors } = require('./lib');
const { UserTypes } = require('../models');

// TODO The DI is a mess
function CallService(CallModel, userService, calleeService) {
  async function validateCall(userId, calleeId) {
    const user = await userService.getUser(userId);
    console.log('Call for callee', calleeId);
    console.log('Creating call for user', userId);
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
      throw new Error(`Authorization error for user ${userId}`);
    }
    return true;
  }

  async function createCall({
    userId,
    calleeId,
    twilioCallId,
    twilioCallStatus,
  }) {
    validateCall(userId, calleeId);
    const callee = await calleeService.getCallee(calleeId);
    const call = {
      phoneNumber: callee.phoneNumber,
      userId,
      twilioCallId,
      twilioCallStatus,
    };
    return sanitizeDbErrors(() => CallModel.create(call));
  }
  return {
    createCall,
  };
}

module.exports = CallService;
