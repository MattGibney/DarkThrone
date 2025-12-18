import { unitItems } from '@darkthrone/game-data';
import {
  POST_armouryBuy,
  POST_armourySell,
  TypedRequest,
  TypedResponse,
} from '@darkthrone/interfaces';
import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';
import PlayerItemModel from '../models/playerItem';

const unitItemLookup: Record<string, (typeof unitItems)[number]> =
  unitItems.reduce(
    (acc, item) => {
      acc[item.key] = item;
      return acc;
    },
    {} as Record<string, (typeof unitItems)[number]>,
  );

function validateRequestedItems(
  items: POST_armouryBuy['RequestBody']['items'],
): ('noItemsRequested' | 'nonPositiveQuantity' | 'invalidItem')[] {
  const errors: ('noItemsRequested' | 'nonPositiveQuantity' | 'invalidItem')[] =
    [];

  if (!items || items.length === 0) {
    errors.push('noItemsRequested');
  }

  if (items.find(({ quantity }) => quantity <= 0)) {
    errors.push('nonPositiveQuantity');
  }

  if (items.find(({ itemKey }) => !unitItemLookup[itemKey])) {
    errors.push('invalidItem');
  }

  return errors;
}

export default {
  POST_buy: protectPrivateAPI(
    async (
      req: TypedRequest<POST_armouryBuy>,
      res: TypedResponse<POST_armouryBuy>,
    ) => {
      const validationErrors = validateRequestedItems(req.body.items);
      if (validationErrors.length > 0) {
        const errors = validationErrors.map(
          (error) =>
            `armoury.buy.${error}` as
              | 'armoury.buy.noItemsRequested'
              | 'armoury.buy.nonPositiveQuantity'
              | 'armoury.buy.invalidItem',
        );
        res.status(400).send({
          errors,
        });
        return;
      }

      const insufficientArmouryItem = req.body.items.find((item) => {
        const unitItem = unitItemLookup[item.itemKey];
        return (
          unitItem.requirements.armouryLevel >
          req.ctx.authedPlayer.structureUpgrades.armoury
        );
      });

      if (insufficientArmouryItem) {
        res.status(400).send({
          errors: ['armoury.buy.insufficientArmouryLevel'],
        });
        return;
      }

      const totalCost = req.body.items.reduce((acc, { itemKey, quantity }) => {
        const unitItem = unitItemLookup[itemKey];
        return acc + unitItem.buyCost * quantity;
      }, 0);

      if (totalCost > req.ctx.authedPlayer.gold) {
        res.status(400).send({
          errors: ['armoury.buy.insufficientGold'],
        });
        return;
      }

      for (const requested of req.body.items) {
        const existingItem = req.ctx.authedPlayer.items.find(
          (item) => item.itemKey === requested.itemKey,
        );
        if (existingItem) {
          existingItem.quantity += requested.quantity;
          await existingItem.save();
        } else {
          const createdItem = await PlayerItemModel.create(
            req.ctx,
            req.ctx.authedPlayer.id,
            requested.itemKey,
            requested.quantity,
          );
          req.ctx.authedPlayer.items.push(createdItem);
        }
      }

      req.ctx.authedPlayer.gold -= totalCost;
      await req.ctx.authedPlayer.save();

      res.status(200).json(await req.ctx.authedPlayer.serialiseAuthedPlayer());
    },
  ),

  POST_sell: protectPrivateAPI(
    async (
      req: TypedRequest<POST_armourySell>,
      res: TypedResponse<POST_armourySell>,
    ) => {
      const validationErrors = validateRequestedItems(req.body.items);
      if (validationErrors.length > 0) {
        const errors = validationErrors.map(
          (error) =>
            `armoury.sell.${error}` as
              | 'armoury.sell.noItemsRequested'
              | 'armoury.sell.nonPositiveQuantity'
              | 'armoury.sell.invalidItem',
        );
        res.status(400).send({
          errors,
        });
        return;
      }

      const notOwnedItem = req.body.items.find((requested) => {
        const existingItem = req.ctx.authedPlayer.items.find(
          (item) => item.itemKey === requested.itemKey,
        );
        return !existingItem || existingItem.quantity < requested.quantity;
      });

      if (notOwnedItem) {
        res.status(400).send({
          errors: ['armoury.sell.notEnoughItems'],
        });
        return;
      }

      const totalRefund = req.body.items.reduce(
        (acc, { itemKey, quantity }) =>
          acc + unitItemLookup[itemKey].sellCost * quantity,
        0,
      );

      for (const requested of req.body.items) {
        const existingItem = req.ctx.authedPlayer.items.find(
          (item) => item.itemKey === requested.itemKey,
        );
        existingItem.quantity -= requested.quantity;
        if (existingItem.quantity < 0) {
          existingItem.quantity = 0;
        }
        await existingItem.save();
      }

      req.ctx.authedPlayer.gold += totalRefund;
      await req.ctx.authedPlayer.save();

      res.status(200).json(await req.ctx.authedPlayer.serialiseAuthedPlayer());
    },
  ),
};
