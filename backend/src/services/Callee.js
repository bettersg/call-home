const { sanitizeDbErrors } = require('./lib');

function CalleeService(CalleeModel) {
  async function listCallees() {
    return CalleeModel.findAll({
      order: ['name'],
    });
  }

  async function createCallee(callee) {
    return await sanitizeDbErrors(() => CalleeModel.create(callee));
  }

  async function getCallee(calleeId) {
    return CalleeModel.findOne({
      where: {
        id: calleeId,
      },
    });
  }

  async function updateCallee(calleeId, callee) {
    await CalleeModel.update(callee, {
      where: {
        id: calleeId,
      },
    });
    return getCallee(calleeId);
  }

  async function deleteCallee(calleeId) {
    const callee = await getCallee(calleeId);
    await callee.destroy();
  }

  return {
    listCallees,
    createCallee,
    getCallee,
    updateCallee,
    deleteCallee,
  };
}

module.exports = CalleeService;
