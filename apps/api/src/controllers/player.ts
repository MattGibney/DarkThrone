import { Request, Response } from 'express';

export default {
  GET_fetchAllPlayers: async (req: Request, res: Response) => {
    const players = await req.ctx.modelFactory.player.fetchAllForUser(req.ctx, req.ctx.authedUser.model);

    res.status(200).json(await Promise.all(players.map(async (player) => await player.serialise())));
  },

  GET_fetchPlayerByID: async (req: Request, res: Response) => {
    const player = await req.ctx.modelFactory.player.fetchByID(req.ctx, req.params.id);
    if (!player) {
      res.status(404).json({
        errors: [{
          code: 'player_not_found',
          title: 'Player not found',
        }]
      });
      return;
    }

    res.status(200).json(await player.serialise());
  },

  POST_fetchAllMatchingIDs: async (req: Request, res: Response) => {
    const { playerIDs } = req.body;

    const players = await req.ctx.modelFactory.player.fetchAllMatchingIDs(req.ctx, playerIDs);
    res.status(200).json(await Promise.all(players.map(async (player) => await player.serialise())));
  },

  POST_validatePlayerName: async (req: Request, res: Response) => {
    const { displayName } = req.body;

    const player = await req.ctx.modelFactory.player.fetchByDisplayName(req.ctx, displayName);
    if (player) {
      res.status(400).json({
        errors: [{
          code: 'player_name_taken',
          title: 'Player name taken',
        }]
       });
      return;
    }

    res.status(200).json({ valid: player === null });
  },

  POST_createPlayer: async (req: Request, res: Response) => {
    const { displayName, selectedRace, selectedClass } = req.body;

    const player = await req.ctx.modelFactory.player.create(req.ctx, displayName, selectedRace, selectedClass);
    res.status(200).json(await player.serialise());
  }
}
