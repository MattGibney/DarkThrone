import { Request, Response } from 'express'
import { APIError } from '@darkthrone/client-library'

export default {
  GET_fetchByID: async (req: Request, res: Response) => {
    const { id } = req.params

    const apiErrors: APIError[] = []

    if (!id) {
      apiErrors.push({
        code: 'war_history_id_required',
        title: 'War history ID required',
      })
    }

    if (apiErrors.length > 0) {
      res.status(400).send({ errors: apiErrors })
      return
    }

    const warHistory = await req.ctx.modelFactory.warHistory.fetchByID(
      req.ctx,
      id
    );
    if (!warHistory) {
      res.status(404).send({
        errors: [{
          code: 'war_history_not_found',
          title: 'War history not found',
        }],
      })
      return;
    }

    res.status(200).send(warHistory.serialise());
  },

  GET_fetchAll: async (req: Request, res: Response) => {
    const warHistory = await req.ctx.modelFactory.warHistory.fetchAllForPlayer(
      req.ctx,
      req.ctx.authedPlayer
    );

    res.status(200).send(warHistory.map(warHistory => warHistory.serialise()));
  }
}
