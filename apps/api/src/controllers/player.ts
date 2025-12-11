import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';
import {
  GET_fetchAllPlayers,
  GET_fetchPlayerByID,
  GET_fetchPlayersForUser,
  POST_createPlayer,
  POST_fetchAllMatchingIDs,
  POST_validatePlayerName,
  TypedRequest,
  TypedResponse,
} from '@darkthrone/interfaces';

export default {
  GET_fetchAllPlayers: protectPrivateAPI(
    async (
      req: TypedRequest<GET_fetchAllPlayers>,
      res: TypedResponse<GET_fetchAllPlayers>,
    ) => {
      const { page, pageSize } = req.query;
      const pageNumber = Math.max(parseInt(page) || 1, 1);
      const pageSizeNumber = Math.max(
        1,
        Math.min(200, parseInt(pageSize) || 0),
      );

      const paginator = await req.ctx.modelFactory.player.fetchAllPaginated(
        req.ctx,
        pageNumber,
        pageSizeNumber,
      );

      res.status(200).json(await paginator.serialise());
    },
  ),

  GET_fetchPlayersForUser: protectPrivateAPI(
    async (
      req: TypedRequest<GET_fetchPlayersForUser>,
      res: TypedResponse<GET_fetchPlayersForUser>,
    ) => {
      const players = await req.ctx.modelFactory.player.fetchAllForUser(
        req.ctx,
        req.ctx.authedUser.model,
      );

      res
        .status(200)
        .json(
          await Promise.all(
            players.map(async (player) => await player.serialise()),
          ),
        );
    },
  ),

  GET_fetchPlayerByID: protectPrivateAPI(
    async (
      req: TypedRequest<GET_fetchPlayerByID>,
      res: TypedResponse<GET_fetchPlayerByID>,
    ) => {
      const player = await req.ctx.modelFactory.player.fetchByID(
        req.ctx,
        req.params.id,
      );

      if (!player) {
        res.status(404).json({
          errors: ['player.fetchByID.notFound'],
        });
        return;
      }

      res.status(200).json(await player.serialise());
    },
  ),

  POST_fetchAllMatchingIDs: protectPrivateAPI(
    async (
      req: TypedRequest<POST_fetchAllMatchingIDs>,
      res: TypedResponse<POST_fetchAllMatchingIDs>,
    ) => {
      const { playerIDs } = req.body;

      const players = await req.ctx.modelFactory.player.fetchAllMatchingIDs(
        req.ctx,
        playerIDs,
      );
      res
        .status(200)
        .json(
          await Promise.all(
            players.map(async (player) => await player.serialise()),
          ),
        );
    },
  ),

  POST_validatePlayerName: protectPrivateAPI(
    async (
      req: TypedRequest<POST_validatePlayerName>,
      res: TypedResponse<POST_validatePlayerName>,
    ) => {
      const { displayName } = req.body;

      const nameValidation =
        await req.ctx.modelFactory.player.validateDisplayName(
          req.ctx,
          displayName,
        );
      if (!nameValidation.isValid) {
        res.status(400).json({
          errors: nameValidation.issues,
        });
        return;
      }

      res.status(200).json(nameValidation);
    },
  ),

  POST_createPlayer: protectPrivateAPI(
    async (
      req: TypedRequest<POST_createPlayer>,
      res: TypedResponse<POST_createPlayer>,
    ) => {
      const { displayName, selectedRace, selectedClass } = req.body;

      const nameValidation =
        await req.ctx.modelFactory.player.validateDisplayName(
          req.ctx,
          displayName,
        );
      if (!nameValidation.isValid) {
        res.status(400).json({
          errors: nameValidation.issues,
        });
        return;
      }

      const player = await req.ctx.modelFactory.player.create(
        req.ctx,
        displayName,
        selectedRace,
        selectedClass,
      );
      res.status(201).json(await player.serialise());
    },
  ),
};
