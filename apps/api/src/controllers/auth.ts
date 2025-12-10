import {
  TypedRequest,
  TypedResponse,
  ValidAuthResponse,
  POST_login,
  POST_register,
  GET_currentUser,
  POST_logout,
  POST_assumePlayer,
  POST_unassumePlayer,
  ExtractErrorCodesForStatuses,
} from '@darkthrone/interfaces';
import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';

export default {
  POST_login: async (
    req: TypedRequest<POST_login>,
    res: TypedResponse<POST_login>,
  ) => {
    const { password, rememberMe } = req.body;
    let { email } = req.body;

    if (!email) email = '';
    email = email.trim().toLowerCase();

    if (!email || !password) {
      res.status(400).send({ errors: ['auth.login.missingParams'] });
    }

    const user = await req.ctx.modelFactory.user.fetchByEmail(req.ctx, email);
    if (!user) {
      res.status(400).send({
        errors: ['auth.login.invalidParams'],
      });
      return;
    }

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) {
      res.status(400).send({
        errors: ['auth.login.invalidParams'],
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

  POST_register: async (
    req: TypedRequest<POST_register>,
    res: TypedResponse<POST_register>,
  ) => {
    let { email, password } = req.body;

    if (!email) email = '';
    email = email.trim().toLowerCase();

    const apiErrors: ExtractErrorCodesForStatuses<POST_register, 400>[] = [];
    if (!email) {
      apiErrors.push('auth.register.missingParams');
    }
    if (!password) password = '';

    if (
      password.length < 7 ||
      password.toUpperCase() === password ||
      password.toLowerCase() === password
    ) {
      apiErrors.push('auth.register.invalidPassword');
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
        errors: ['auth.register.emailInUse'],
      });
      return;
    }

    const newUser = await req.ctx.modelFactory.user.create(
      req.ctx,
      email,
      password,
    );
    if (!newUser) {
      req.ctx.logger.error('Failed to create new user during registration');
      res.status(500).send({
        errors: ['server.error'],
      });
      return;
    }

    const newSession = await req.ctx.modelFactory.userSession.create(
      req.ctx,
      newUser,
      false,
    );
    if (!newSession) {
      req.ctx.logger.error(
        'Failed to create session for new user during registration',
      );
      res.status(500).send({
        errors: ['server.error'],
      });
      return;
    }

    const authResponse: ValidAuthResponse = {
      session: await newSession.serialise(),
      token: newSession.token,
    };
    res.status(201).send(authResponse);
  },

  GET_currentUser: protectPrivateAPI(
    async (
      req: TypedRequest<GET_currentUser>,
      res: TypedResponse<GET_currentUser>,
    ) => {
      res.status(200).json({
        user: await req.ctx.authedUser.session.serialise(),
        player: req.ctx.authedPlayer
          ? await req.ctx.authedPlayer.serialiseAuthedPlayer()
          : undefined,
      });
    },
  ),

  POST_logout: protectPrivateAPI(
    async (req: TypedRequest<POST_logout>, res: TypedResponse<POST_logout>) => {
      const { session } = req.ctx.authedUser;
      await session.invalidate();
      res.status(204).send(null);
    },
  ),

  POST_assumePlayer: protectPrivateAPI(
    async (
      req: TypedRequest<POST_assumePlayer>,
      res: TypedResponse<POST_assumePlayer>,
    ) => {
      const { playerID } = req.body;

      if (!playerID) {
        res.status(400).json({ errors: ['auth.assumePlayer.missingParams'] });
        return;
      }

      const player = await req.ctx.modelFactory.player.fetchByID(
        req.ctx,
        playerID,
      );
      if (!player) {
        res.status(404).json({
          errors: ['auth.assumePlayer.notFound'],
        });
        return;
      }

      if (player.userID !== req.ctx.authedUser.model.id) {
        res.status(403).json({
          errors: ['auth.assumePlayer.notAllowed'],
        });
        return;
      }

      await req.ctx.authedUser.session.assumePlayer(player);
      req.ctx.authedPlayer = player;

      res.status(200).json({
        user: await req.ctx.authedUser.session.serialise(),
        player: await player.serialiseAuthedPlayer(),
      });
    },
  ),

  POST_unassumePlayer: protectPrivateAPI(
    async (
      req: TypedRequest<POST_unassumePlayer>,
      res: TypedResponse<POST_unassumePlayer>,
    ) => {
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
