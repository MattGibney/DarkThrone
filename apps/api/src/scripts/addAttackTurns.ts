import { Context } from '../app';

export default async function addAttackTurns(ctx: Context) {
  ctx.logger.info('[Process Attack Turns] Starting');
  const allPlayers = await ctx.modelFactory.player.fetchAll(ctx);

  for (const player of allPlayers) {
    player.attackTurns += 1;
    await player.save();
  }

  ctx.logger.info('[Process Attack Turns] Complete');
}
