import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';
import {
  GET_fetchAllWarHistory,
  GET_fetchWarHistoryByID,
  TypedRequest,
  TypedResponse,
} from '@darkthrone/interfaces';

export default {
  GET_fetchWarHistoryByID: protectPrivateAPI(
    async (
      req: TypedRequest<GET_fetchWarHistoryByID>,
      res: TypedResponse<GET_fetchWarHistoryByID>,
    ) => {
      const { id } = req.params;

      if (!id) {
        res.status(400).send({ errors: ['warHistory.fetchByID.invalidID'] });
        return;
      }

      const warHistory = await req.ctx.modelFactory.warHistory.fetchByID(
        req.ctx,
        id,
      );
      if (!warHistory) {
        res.status(404).send({
          errors: ['warHistory.fetchByID.notFound'],
        });
        return;
      }

      res.status(200).send(warHistory.serialise());
    },
  ),

  GET_fetchAllWarHistory: protectPrivateAPI(
    async (
      req: TypedRequest<GET_fetchAllWarHistory>,
      res: TypedResponse<GET_fetchAllWarHistory>,
    ) => {
      const warHistory =
        await req.ctx.modelFactory.warHistory.fetchAllForPlayer(
          req.ctx,
          req.ctx.authedPlayer,
        );

      res
        .status(200)
        .send(warHistory.map((warHistory) => warHistory.serialise()));
    },
  ),
};
