// Adds additional params to default express.Request type
declare namespace Express {
  export interface Request {
    // In unauthenticated cases, user is not appended to req.
    // However it is troublesome to check for presence of user object,
    // hence type is added as a required
    user: {
      id: number;
    };
  }
}
