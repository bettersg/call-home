import express, { Router } from 'express';
import * as z from 'zod';
import { requireAdmin } from './middlewares';
import { handleServiceError } from './transformers';
import type { AllowlistEntry } from '../services';
import { validateRequest } from './helpers/validation';

const POST_SCHEMA = z.object({
  body: z.object({
    phoneNumber: z.string(),
    destinationCountry: z.string(),
  }),
});

const DELETE_SCHEMA = z.object({
  params: z.object({
    id: z.string().transform(z.number(), Number),
  }),
});

function AllowlistEntryRoutes(allowlistService: typeof AllowlistEntry): Router {
  const router = express.Router();

  router.get('/', requireAdmin, async (req, res) => {
    try {
      const allowlistEntries = await allowlistService.listAllowlistEntries();
      res.status(200).json(allowlistEntries);
    } catch (e) {
      handleServiceError(e, res);
    }
  });

  router.post(
    '/',
    requireAdmin,
    validateRequest(POST_SCHEMA, async (req, res) => {
      try {
        const { phoneNumber, destinationCountry } = req.body;
        const allowlistEntry = await allowlistService.createAllowlistEntry({
          phoneNumber,
          destinationCountry,
        });
        return res.status(200).json(allowlistEntry);
      } catch (e) {
        return handleServiceError(e, res);
      }
    })
  );

  router.delete(
    '/:id',
    requireAdmin,
    validateRequest(DELETE_SCHEMA, async (req, res) => {
      const { id } = req.params;
      await allowlistService.deleteAllowlistEntry(id);
      return res.status(200).send();
    })
  );

  return router;
}

export default AllowlistEntryRoutes;
