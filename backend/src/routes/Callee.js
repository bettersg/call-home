const express = require('express');
const { requireAdmin } = require('./middlewares');
const {
  parseCalleeRequestBody,
  calleeToCalleeResponse,
} = require('./transformers');

// Reads a req and parses the body into a callee that can be saved.
function CalleeRoutes(calleeService) {
  const router = express.Router();

  router.get('/', requireAdmin, async (req, res) => {
    console.log('listing all callees');
    const allCallees = await calleeService.listCallees();
    res.status(200).json(allCallees);
  });

  router.post('/', parseCalleeRequestBody, async (req, res) => {
    const callee = req.body;
    try {
      const savedCallee = await calleeService.createCallee(callee);
      return res.status(200).json(calleeToCalleeResponse(savedCallee));
    } catch (e) {
      // TODO do this smarter
      if (e.message.startsWith('Validation Error:')) {
        return res.status(400).send(e.message);
      }
      return res.status(500);
    }
  });

  router.put(
    '/:calleeId',
    parseCalleeRequestBody,
    requireAdmin,
    async (req, res) => {
      const callee = req.body;
      const savedCallee = await calleeService.updateCallee(
        req.params.id,
        callee
      );
      res.status(200).json(calleeToCalleeResponse(savedCallee));
    }
  );

  router.delete('/:calleeId', requireAdmin, async (req, res) => {
    await calleeService.deleteCallee(req.params.calleeId);
    res.status(200).send();
  });
  return router;
}

module.exports = CalleeRoutes;
