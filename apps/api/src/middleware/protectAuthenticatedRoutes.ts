import { NextFunction, Request, Response } from 'express';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export function protectPrivateAPI(handler: Middleware) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.ctx.authedUser) {
      return handler(req, res, next);
    }
    return res.status(401).json({ message: 'Unauthorized' });
  };
}
