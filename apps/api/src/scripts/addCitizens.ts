import { Context } from '../app';

// This assumes that the player has an existing citizen row. This should be created when the player is created.
export default async function addCitizens(ctx: Context) {
  ctx.logger.info('[Process Citizens] Starting');
  const allPlayers = await ctx.modelFactory.player.fetchAll(ctx);

  for (const player of allPlayers) {
    const playerCitizens =
      await ctx.modelFactory.playerUnits.fetchUnitsForPlayerByType(
        ctx,
        player.id,
        'citizen',
      );

    const newCitizens = await player.calculateNewCitizens();

    playerCitizens.quantity += newCitizens;
    await playerCitizens.save();
  }

  ctx.logger.info('[Process Citizens] Complete');
}
