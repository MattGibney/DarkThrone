import { Request, Response } from 'express';
import { APIError } from '@darkthrone/client-library';

export default {
  POST_login: async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;

    const apiErrors: APIError[] = [];
    if (!email) {
      apiErrors.push({
        code: 'login_email_required',
        title: 'Email required',
      });
    }
    if (!password) {
      apiErrors.push({
        code: 'login_password_required',
        title: 'Password required',
      });
    }

    if (apiErrors.length > 0) {
      res.status(400).send({ errors: apiErrors });
      return;
    }

    const user = await req.ctx.modelFactory.user.fetchByEmail(req.ctx, email);
    if (!user) {
      res.status(401).send({
        errors: [{
          code: 'login_invalid_credentials',
          title: 'Invalid credentials',
        }],
      });
      return;
    }

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) {
      res.status(401).send({
        errors: [{
          code: 'login_invalid_credentials',
          title: 'Invalid credentials',
        }],
      });
      return;
    }

    const newSession = await req.ctx.modelFactory.userSession.create(req.ctx, user, rememberMe);
    if (!newSession) {
      res.status(500).send({
        errors: [{
          code: 'login_failed',
          title: 'Login failed',
        }],
      });
      return;
    }

    res.cookie('DTAC', newSession.token, {
      httpOnly: true,
      secure: true,
      expires: newSession.expiresAt,
    });

    res.status(200).send(user.serialise());
  },

  POST_register: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const apiErrors: APIError[] = [];
    if (!email) {
      apiErrors.push({
        code: 'register_email_required',
        title: 'Email required',
      });
    }
    if (!password) {
      apiErrors.push({
        code: 'register_password_required',
        title: 'Password required',
      });
    }

    if (apiErrors.length > 0) {
      res.status(400).send({ errors: apiErrors });
      return;
    }

    const existingUser = await req.ctx.modelFactory.user.fetchByEmail(req.ctx, email);
    if (existingUser) {
      res.status(400).send({
        errors: [{
          code: 'register_email_taken',
          title: 'Email taken',
        }],
      });
      return;
    }

    const newUser = await req.ctx.modelFactory.user.create(req.ctx, email, password);
    if (!newUser) {
      res.status(500).send({
        errors: [{
          code: 'register_failed',
          title: 'Registration failed',
        }],
      });
      return;
    }

    const newSession = await req.ctx.modelFactory.userSession.create(req.ctx, newUser, false);
    if (!newSession) {
      res.status(500).send({
        errors: [{
          code: 'register_failed',
          title: 'Registration failed',
        }],
      });
      return;
    }

    res.cookie('DTAC', newSession.token, {
      httpOnly: true,
      secure: true,
      expires: newSession.expiresAt,
    });

    res.status(200).send(newUser.serialise());
  }
}
