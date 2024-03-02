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
        errors: [
          {
            code: 'login_invalid_credentials',
            title: 'Invalid credentials',
          },
        ],
      });
      return;
    }

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) {
      res.status(401).send({
        errors: [
          {
            code: 'login_invalid_credentials',
            title: 'Invalid credentials',
          },
        ],
      });
      return;
    }

    const newSession = await req.ctx.modelFactory.userSession.create(
      req.ctx,
      user,
      rememberMe,
    );
    if (!newSession) {
      res.status(500).send({
        errors: [
          {
            code: 'login_failed',
            title: 'Login failed',
          },
        ],
      });
      return;
    }

    res.status(200).send({
      session: await newSession.serialise(),
      token: newSession.token,
    });
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
    if (password.length < 7) {
      apiErrors.push({
        code: 'register_password_too_short',
        title: 'The password length must be at least 7 characters long',
      });
    }
    if (password.toUpperCase() === password) {
      apiErrors.push({
        code: 'register_password_requires_lower_case',
        title: 'The password lacks a lower case character',
      });
    }
    if (password.toLowerCase() === password) {
      apiErrors.push({
        code: 'register_password_requires_upper_case',
        title: 'The password lacks an upper case character',
      });
    }

    if (apiErrors.length > 0) {
      res.status(400).send({ errors: apiErrors });
      return;
    }

    const existingUser = await req.ctx.modelFactory.user.fetchByEmail(
      req.ctx,
      email,
    );
    if (existingUser) {
      res.status(400).send({
        errors: [
          {
            code: 'register_email_taken',
            title: 'Email taken',
          },
        ],
      });
      return;
    }

    const newUser = await req.ctx.modelFactory.user.create(
      req.ctx,
      email,
      password,
    );
    if (!newUser) {
      res.status(500).send({
        errors: [
          {
            code: 'register_failed',
            title: 'Registration failed',
          },
        ],
      });
      return;
    }

    const newSession = await req.ctx.modelFactory.userSession.create(
      req.ctx,
      newUser,
      false,
    );
    if (!newSession) {
      res.status(500).send({
        errors: [
          {
            code: 'register_failed',
            title: 'Registration failed',
          },
        ],
      });
      return;
    }

    res.status(200).send({
      session: await newSession.serialise(),
      token: newSession.token,
    });
  },

  GET_currentUser: async (req: Request, res: Response) => {
    if (!req.ctx.authedUser) {
      res.status(401).send({
        errors: [
          {
            code: 'not_authenticated',
            title: 'Not authenticated',
          },
        ],
      });
      return;
    }
    res.status(200).json({
      user: await req.ctx.authedUser.session.serialise(),
      player: req.ctx.authedPlayer
        ? await req.ctx.authedPlayer.serialise()
        : undefined,
    });
  },

  POST_logout: async (req: Request, res: Response) => {
    if (!req.ctx.authedUser) {
      res.status(401).send({
        errors: [
          {
            code: 'not_authenticated',
            title: 'Not authenticated',
          },
        ],
      });
      return;
    }

    const { session } = req.ctx.authedUser;
    if (!session) {
      res.status(500).json({
        errors: [
          {
            code: 'logout_failed',
            title: 'Logout failed',
          },
        ],
      });
      return;
    }

    await session.invalidate();
    res.status(200).json({});
  },

  POST_assumePlayer: async (req: Request, res: Response) => {
    const { playerId } = req.body;

    const apiErrors: APIError[] = [];
    if (!playerId) {
      apiErrors.push({
        code: 'assume_player_player_id_required',
        title: 'Player ID required',
      });
    }

    if (apiErrors.length > 0) {
      res.status(400).json({ errors: apiErrors });
      return;
    }

    const player = await req.ctx.modelFactory.player.fetchByID(
      req.ctx,
      playerId,
    );
    if (!player) {
      res.status(404).json({
        errors: [
          {
            code: 'assume_player_player_not_found',
            title: 'Player not found',
          },
        ],
      });
      return;
    }

    await req.ctx.authedUser.session.assumePlayer(player);
    req.ctx.authedPlayer = player;

    res.status(200).json({
      user: await req.ctx.authedUser.session.serialise(),
      player: await player.serialise(),
    });
  },

  POST_unassumePlayer: async (req: Request, res: Response) => {
    req.ctx.logger.debug('POST_unassumePlayer');
    await req.ctx.authedUser.session.unassumePlayer();

    res.status(200).json({
      user: await req.ctx.authedUser.session.serialise(),
      player: undefined,
    });
    return;
  },
};
