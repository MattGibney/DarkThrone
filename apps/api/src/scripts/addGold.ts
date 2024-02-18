import { Context } from '../app';

export default async function addGold(ctx: Context) {
  ctx.logger.info('[Process Gold Production] Starting');
  const allPlayers = await ctx.modelFactory.player.fetchAll(ctx);

  let goldAddedtoEconomy = 0;

  for (const player of allPlayers) {
    const goldProduction = await player.calculateGoldPerTurn();
    goldAddedtoEconomy += goldProduction;
    player.gold += goldProduction;
    await player.save();
  }

  ctx.logger.info({ goldAddedtoEconomy }, '[Process Gold Production] Complete');
}
