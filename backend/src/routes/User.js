const express = require('express');

// Reads a req and parses the body into a user that can be saved.

function UserRoutes() {
  const router = express.Router();

  router.get('/me', async (req, res) => {
    return res.status(200).json(req.user);
  });

  return router;
}

module.exports = UserRoutes;
