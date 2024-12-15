import { Context } from '../app';
import PlayerModel from '../models/player';

export default async function overallRank(ctx: Context) {
  ctx.logger.info('[Overall Rank] Starting');
  const allPlayers = await ctx.modelFactory.player.fetchAll(ctx);

  const scores: { player: PlayerModel; score: number }[] = [];

  for (const player of allPlayers) {
    const offence = await player.calculateAttackStrength();
    const defense = await player.calculateDefenseStrength();
    const goldPerTurn = await player.calculateGoldPerTurn();

    const warHistory = await ctx.modelFactory.warHistory.fetchAllForPlayer(
      ctx,
      player,
    );

    const attacks = warHistory.filter((wh) => wh.attackerID === player.id);
    const attacksWon = attacks.filter((wh) => wh.isAttackerVictor);
    const defends = warHistory.filter((wh) => wh.defenderID === player.id);
    const defendsWon = defends.filter((wh) => !wh.isAttackerVictor);

    const attackWinLossRatio = attacks.length
      ? attacksWon.length / attacks.length
      : 0;
    const defendWinLossRatio = defends.length
      ? defendsWon.length / defends.length
      : 0;

    const winLossRatio = (attackWinLossRatio + defendWinLossRatio) / 2;

    const finalScore = Math.floor(
      offence + defense + goldPerTurn * winLossRatio,
    );

    ctx.logger.debug({
      player: player.id,
      offence,
      defense,
      goldPerTurn,
      attacks: attacks.length,
      attacksWon: attacksWon.length,
      defends: defends.length,
      defendsWon: defendsWon.length,
    });

    scores.push({ player, score: finalScore });
  }

  scores.sort((a, b) => b.score - a.score);

  let rank = 1;
  for (const { player, score } of scores) {
    ctx.logger.debug({ player: player.id, rank: rank, score: score });

    player.overallRank = rank;
    await player.save();

    rank++;
  }

  ctx.logger.info('[Overall Rank] Complete');
}
