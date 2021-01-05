import type { DormResponse } from '@call-home/shared/types/Dorm';
import { Response, Router } from 'express';
import * as z from 'zod';
import { requireAdmin } from './middlewares';
import {
  validateRequest,
  stringToNumberTransformer,
} from './helpers/validation';
import type { Dorm as DormService } from '../services';
import { Dorm as DormEntity } from '../models';

const DORM_SCHEMA = z.object({
  name: z.string(),
});

const POST_SCHEMA = z.object({
  body: DORM_SCHEMA,
});

const PUT_SCHEMA = z.object({
  params: z.object({
    dormId: stringToNumberTransformer,
  }),
  body: DORM_SCHEMA.partial(),
});

const DELETE_SCHEMA = z.object({
  params: z.object({
    dormId: stringToNumberTransformer,
  }),
});

function dormToDormResponse(dorm: DormEntity) {
  const { id, name } = dorm;
  return {
    id,
    name,
  };
}

function DormRoutes(dormService: typeof DormService) {
  const router = Router();
  router.get('/', async (_req, res: Response<DormResponse[]>) => {
    const dorms = await dormService.getDorms();
    return res.json(dorms.map(dormToDormResponse));
  });

  router.post(
    '/',
    requireAdmin,
    validateRequest(
      POST_SCHEMA,
      async (parsedReq, res: Response<DormResponse>) => {
        const { name } = parsedReq.body;
        const createdDorm = await dormService.createDorm({ name });
        return res.json(dormToDormResponse(createdDorm));
      }
    )
  );

  router.put(
    '/:dormId',
    requireAdmin,
    validateRequest(
      PUT_SCHEMA,
      async (parsedReq, res: Response<DormResponse>) => {
        const { dormId } = parsedReq.params;
        const dorm = parsedReq.body;
        const updatedDorm = await dormService.updateDorm(dormId, dorm);
        return res.json(dormToDormResponse(updatedDorm as DormEntity));
      }
    )
  );

  router.delete(
    '/:dormId',
    requireAdmin,
    validateRequest(
      DELETE_SCHEMA,
      async (parsedReq, res: Response<DormResponse>) => {
        const { dormId } = parsedReq.params;
        await dormService.deleteDorm(dormId);
        return res.send();
      }
    )
  );

  return router;
}

export default DormRoutes;
