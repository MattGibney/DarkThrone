import { Request, Response } from 'express';
import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';
import {
  GET_fetchAllPlayers,
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
      const pageNumber = Math.max(parseInt(page as string) || 1, 1);
      const pageSizeNumber = Math.max(
        1,
        Math.min(200, parseInt(pageSize as string) || 0),
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
    async (req: Request, res: Response) => {
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
    async (req: Request, res: Response) => {
      const player = await req.ctx.modelFactory.player.fetchByID(
        req.ctx,
        req.params.id,
      );

      if (!player) {
        res.status(404).json({
          errors: [
            {
              code: 'player_not_found',
              title: 'Player not found',
            },
          ],
        });
        return;
      }

      res.status(200).json(await player.serialise());
    },
  ),

  POST_fetchAllMatchingIDs: protectPrivateAPI(
    async (req: Request, res: Response) => {
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
    async (req: Request, res: Response) => {
      const { displayName } = req.body;

      const nameValidation =
        await req.ctx.modelFactory.player.validateDisplayName(
          req.ctx,
          displayName,
        );
      if (!nameValidation.isValid) {
        res.status(400).json({
          errors: nameValidation.issues.map((issue) => ({
            code: issue,
            title: issue,
          })),
        });
        return;
      }

      res.status(200).json({ valid: true });
    },
  ),

  POST_createPlayer: protectPrivateAPI(async (req: Request, res: Response) => {
    const { displayName, selectedRace, selectedClass } = req.body;

    const nameValidation =
      await req.ctx.modelFactory.player.validateDisplayName(
        req.ctx,
        displayName,
      );
    if (!nameValidation.isValid) {
      res.status(400).json({
        errors: nameValidation.issues.map((issue) => ({
          code: issue,
          title: issue,
        })),
      });
      return;
    }

    const player = await req.ctx.modelFactory.player.create(
      req.ctx,
      displayName,
      selectedRace,
      selectedClass,
    );
    res.status(200).json(await player.serialise());
  }),
};
