import {
  EndpointDefinition,
  AuthenticatedEndpointDefinition,
  TypedRequest,
  TypedResponse,
} from '@darkthrone/interfaces';
import { Request, Response, NextFunction } from 'express';

// TODO: Remove the use of Express Request and Response in favor of TypedRequest and TypedResponse
type Middleware = (
  req: TypedRequest<EndpointDefinition> | Request,
  res: TypedResponse<EndpointDefinition> | Response,
  next: NextFunction,
) => void;

export function protectPrivateAPI(handler: Middleware) {
  return (
    req: TypedRequest<AuthenticatedEndpointDefinition>,
    res: TypedResponse<AuthenticatedEndpointDefinition>,
    next: NextFunction,
  ) => {
    if (req.ctx.authedUser) {
      return handler(req, res, next);
    }
    return res.status(401).json({ errors: ['auth.unauthorized'] });
  };
}
