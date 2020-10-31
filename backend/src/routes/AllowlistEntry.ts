import express, { Router } from 'express';
import * as z from 'zod';
import { requireAdmin } from './middlewares';
import { handleServiceError } from './transformers';
import type { AllowlistEntry } from '../services';
import { logger } from '../config';
import { stringToNumberTransformer } from './helpers/validation';

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

  router.post('/', requireAdmin, async (req, res) => {
    try {
      let validatedReq;
      try {
        const bodySchema = z.object({
          phoneNumber: z.string(),
          destinationCountry: z.string(),
        });
        const body = bodySchema.parse(req.body);
        validatedReq = { body };
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }

      const { phoneNumber, destinationCountry } = validatedReq.body;
      const allowlistEntry = await allowlistService.createAllowlistEntry({
        phoneNumber,
        destinationCountry,
      });
      return res.status(200).json(allowlistEntry);
    } catch (e) {
      return handleServiceError(e, res);
    }
  });

  router.delete('/:id', requireAdmin, async (req, res) => {
    let validatedReq;
    try {
      const paramsSchema = z.object({
        id: stringToNumberTransformer,
      });
      const params = paramsSchema.parse(req.params);
      validatedReq = { params };
    } catch (error) {
      logger.error(error);
      return res.status(400).send(error);
    }

    const { id } = validatedReq.params;
    await allowlistService.deleteAllowlistEntry(id);
    return res.status(200).send();
  });

  return router;
}

export default AllowlistEntryRoutes;
