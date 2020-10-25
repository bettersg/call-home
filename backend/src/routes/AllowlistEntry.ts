import express from 'express';
import { requireAdmin } from './middlewares';
import { handleServiceError } from './transformers';
import type { AllowlistEntry } from '../services';

function AllowlistEntryRoutes(allowlistService: typeof AllowlistEntry) {
  const router = express.Router();

  router.get('/', requireAdmin, async (req, res) => {
    try {
      const allowlistEntries = await allowlistService.listAllowlistEntries();
      res.status(200).json(allowlistEntries);
    } catch (e) {
      handleServiceError(e, res);
    }
  });

  router.post('/', requireAdmin, async (req, res) => {
    try {
      const { phoneNumber, destinationCountry } = req.body;
      const allowlistEntry = await allowlistService.createAllowlistEntry({
        phoneNumber,
        destinationCountry,
      });
      res.status(200).json(allowlistEntry);
    } catch (e) {
      handleServiceError(e, res);
    }
  });

  router.delete('/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    await allowlistService.deleteAllowlistEntry(Number(id));
    res.status(200).send();
  });

  return router;
}

export default AllowlistEntryRoutes;
