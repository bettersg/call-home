import * as z from 'zod';
import type { Request, Response } from 'express';
import { CallHomeRequest } from '../middlewares';

// Using Partial<Request> only requires us to specify the parts we care about
type RequestSchema<Output, TD extends z.ZodTypeDef> = z.Schema<
  Output,
  TD,
  Partial<Request>
>;

function validateRequest<Output, TD extends z.ZodTypeDef, Input>(
  schema: RequestSchema<Output, TD>,
  handler: (
    parsedReq: Output,
    res: Response,
    rawReq: CallHomeRequest
  ) => unknown
) {
  return async (req: CallHomeRequest, res: Response) => {
    try {
      const parsedReq = schema.parse(req as Partial<CallHomeRequest>);
      // Pass the raw request to the handler in case it is needed
      return handler(parsedReq, res, req);
    } catch (error) {
      res.status(400).send(error);
      return null;
    }
  };
}

const stringToNumberTransformer = z
  .string()
  .transform(z.number(), Number)
  .refine((num) => !Number.isNaN(num));

export { validateRequest, stringToNumberTransformer };
