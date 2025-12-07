import { Request, Response } from 'express';
import { APIError } from '@darkthrone/client-library';
import {
  POST_login,
  TypedRequest,
  TypedResponse,
  ValidAuthResponse,
} from '@darkthrone/interfaces';
import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';

export default {
  POST_login: async (
    req: TypedRequest<POST_login>,
    res: TypedResponse<POST_login, 200 | 400 | 401 | 500>,
  ) => {
    const { password, rememberMe } = req.body;
    let { email } = req.body;

    if (!email) email = '';
    email = email.trim().toLowerCase();

    if (!email || !password) {
      res.status(400).send({ errors: ['auth.missingParams'] });
    }

    const user = await req.ctx.modelFactory.user.fetchByEmail(req.ctx, email);
    if (!user) {
      res.status(401).send({
        errors: ['auth.invalidParams'],
      });
      return;
    }

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) {
      res.status(401).send({
        errors: ['auth.invalidParams'],
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
        errors: ['server.error'],
      });
      return;
    }

    const authResponse: ValidAuthResponse = {
      session: await newSession.serialise(),
      token: newSession.token,
    };
    res.status(200).send(authResponse);
  },

  POST_register: async (req: Request, res: Response) => {
    let { email, password } = req.body;

    if (!email) email = '';
    email = email.trim().toLowerCase();

    const apiErrors: APIError[] = [];
    if (!email) {
      apiErrors.push({
        code: 'register_email_required',
        title: 'Email required',
      });
    }
    if (!password) password = '';

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

    const authResponse: ValidAuthResponse = {
      session: await newSession.serialise(),
      token: newSession.token,
    };
    res.status(200).send(authResponse);
  },

  GET_currentUser: protectPrivateAPI(async (req: Request, res: Response) => {
    res.status(200).json({
      user: await req.ctx.authedUser.session.serialise(),
      player: req.ctx.authedPlayer
        ? await req.ctx.authedPlayer.serialise()
        : undefined,
    });
  }),

  POST_logout: protectPrivateAPI(async (req: Request, res: Response) => {
    const { session } = req.ctx.authedUser;
    await session.invalidate();
    res.status(200).json({});
  }),

  POST_assumePlayer: protectPrivateAPI(async (req: Request, res: Response) => {
    const { playerID } = req.body;

    const apiErrors: APIError[] = [];
    if (!playerID) {
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
      playerID,
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

    if (player.userID !== req.ctx.authedUser.model.id) {
      res.status(403).json({
        errors: [
          {
            code: 'assume_player_not_your_player',
            // eslint-disable-next-line quotes
            title: "You can't assume another player's account",
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
  }),

  POST_unassumePlayer: protectPrivateAPI(
    async (req: Request, res: Response) => {
      req.ctx.logger.debug('POST_unassumePlayer');
      await req.ctx.authedUser.session.unassumePlayer();

      res.status(200).json({
        user: await req.ctx.authedUser.session.serialise(),
        player: undefined,
      });
      return;
    },
  ),
};
