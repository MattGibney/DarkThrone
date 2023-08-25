import { Request, Response } from 'express';

export default {
  GET_fetchAllPlayers: async (req: Request, res: Response) => {
    const players = await req.ctx.modelFactory.player.fetchAllForUser(req.ctx, req.ctx.authedUser.model);

    res.status(200).json(players.map((player) => player.serialise()));
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
    res.status(200).json(player.serialise());
  }
}
