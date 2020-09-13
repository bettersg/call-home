import type { Request, Response, NextFunction } from 'express';

async function subdomainRedirect(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.host !== 'app.callhome.sg') {
    return res.redirect(`https://app.callhome.sg`);
  }
  return next();
}

export default subdomainRedirect;
