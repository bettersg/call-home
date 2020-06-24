const express = require('express');
const { requireAdmin } = require('./middlewares');

function AllowlistEntryRoutes(allowlistService) {
  const router = express.Router();

  router.get('/', requireAdmin, async (req, res) => {
    const allowlistEntries = await allowlistService.listAllowlistEntries();
    res.status(200).json(allowlistEntries);
  });

  router.post('/', requireAdmin, async (req, res) => {
    const { phoneNumber, destinationCountry } = req.body;
    const allowlistEntry = await allowlistService.createAllowlistEntry({
      phoneNumber,
      destinationCountry,
    });
    res.status(200).json(allowlistEntry);
  });

  router.delete('/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    await allowlistService.deleteAllowlistEntry(id);
    res.status(200).send();
  });

  return router;
}

module.exports = AllowlistEntryRoutes;
