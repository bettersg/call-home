import * as z from 'zod';
import type { Request, Response } from 'express';

// Using Partial<Request> only requires us to specify the parts we care about
type RequestSchema<Output, TD extends z.ZodTypeDef> = z.Schema<
  Output,
  TD,
  Partial<Request>
>;

function validateRequest<Output, TD extends z.ZodTypeDef, Input>(
  schema: RequestSchema<Output, TD>,
  handler: (parsedReq: Output, res: Response, rawReq: Request) => unknown
) {
  return async (req: Request, res: Response) => {
    try {
      const parsedReq = schema.parse(req as Partial<Request>);
      // Pass the raw request to the handler in case it is needed
      return handler(parsedReq, res, req);
    } catch (error) {
      res.status(400).send(error);
      return null;
    }
  };
}

export { validateRequest };
