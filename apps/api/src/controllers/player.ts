import { Request, Response } from 'express';

export default {
  GET_fetchAllPlayers: async (req: Request, res: Response) => {
    const players = await req.ctx.modelFactory.player.fetchAllForUser(req.ctx, req.ctx.authedUser.model);

    res.status(200).json(players.map((player) => player.serialise()));
  },
}
