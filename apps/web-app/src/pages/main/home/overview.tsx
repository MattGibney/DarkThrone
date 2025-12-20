import { useEffect, useState } from 'react';
import DarkThroneClient from '@darkthrone/client-library';
import { levelXPArray, UnitTypes } from '@darkthrone/game-data';
import { UnitType } from '@darkthrone/interfaces';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@darkthrone/shadcnui/card';
import { Avatar } from '../../../components/avatar';
import Stat from '../../../components/home/Stat';

interface OverviewPageProps {
  client: DarkThroneClient;
}
export default function OverviewPage(props: OverviewPageProps) {
  const player = props.client.authenticatedPlayer;
  if (!player) return null;

  const formatNumber = new Intl.NumberFormat('en-GB');
  const population = player.units.reduce((acc, unit) => acc + unit.quantity, 0);
  const citizens =
    player.units.find((unit) => unit.unitType === 'citizen')?.quantity ?? 0;
  const workers =
    player.units.find((unit) => unit.unitType === 'worker')?.quantity ?? 0;
  const unitsByType = player.units.reduce(
    (acc, unit) => {
      const unitData = UnitTypes[unit.unitType];
      if (!unitData) return acc;
      acc[unitData.type] += unit.quantity;
      return acc;
    },
    {
      [UnitType.SUPPORT]: 0,
      [UnitType.OFFENCE]: 0,
      [UnitType.DEFENCE]: 0,
    },
  );

  const maxDepositsPerDay = 3;
  const depositsMade = player.depositHistory.filter(
    (history) => history.type === 'deposit',
  ).length;
  const depositsRemaining = Math.max(0, maxDepositsPerDay - depositsMade);
  const latestTransaction = [...player.depositHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];

  const currentLevelIndex = Math.max(0, player.level - 1);
  const nextLevelXP =
    levelXPArray[currentLevelIndex] ?? levelXPArray[levelXPArray.length - 1];
  const xpRemaining = Math.max(0, nextLevelXP - player.experience);
  const xpProgress = nextLevelXP
    ? Math.min(100, (player.experience / nextLevelXP) * 100)
    : 0;

  const [currentTime, setCurrentTime] = useState(
    props.client.serverTime ? new Date(props.client.serverTime) : undefined,
  );
  const [timeRemaining, setTimeRemaining] = useState(
    currentTime ? calculateTimeRemaining(currentTime) : undefined,
  );

  useEffect(() => {
    if (!currentTime) return;
    const intervalId = setInterval(() => {
      const newTime = new Date(currentTime.getTime() + 1000);
      setCurrentTime(newTime);
      setTimeRemaining(calculateTimeRemaining(newTime));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentTime]);

  function calculateTimeRemaining(serverTime: Date) {
    const minutes = serverTime.getMinutes();
    const seconds = serverTime.getSeconds();
    const halfHourInSeconds = 60 * 30;
    const timeInSeconds = minutes * 60 + seconds;
    const timeSinceHourOrHalfHourInSeconds = timeInSeconds % halfHourInSeconds;
    const timeToHourOrHalfHourInSeconds =
      halfHourInSeconds - timeSinceHourOrHalfHourInSeconds;
    const minutesRemaining = Math.floor(timeToHourOrHalfHourInSeconds / 60);
    const remainingSeconds = timeToHourOrHalfHourInSeconds % 60;

    return `${String(minutesRemaining).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  const stats = [
    {
      name: 'Army Size',
      value: formatNumber.format(player.armySize),
    },
    {
      name: 'Citizens Per Day',
      value: formatNumber.format(player.citizensPerDay),
    },
    {
      name: 'Attack Strength',
      value: formatNumber.format(player.attackStrength),
    },
    {
      name: 'Defence Strength',
      value: formatNumber.format(player.defenceStrength),
    },
  ];

  return (
    <main className="grid gap-6 max-w-7xl mx-auto">
      <section>
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <Avatar
                  url={player.avatarURL}
                  race={player.race}
                  variant="square"
                  className="h-14 w-14"
                />
                <div>
                  <p className="text-xs uppercase tracking-wide text-card-foreground/60">
                    Welcome back
                  </p>
                  <h2 className="text-3xl font-semibold text-card-foreground">
                    {player.name}
                  </h2>
                  <p className="text-sm text-card-foreground/60 capitalize">
                    {player.race} {player.class}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-card-foreground/70">
                <div>
                  <div className="text-card-foreground/40">Level</div>
                  <div className="text-lg font-semibold text-white">
                    {formatNumber.format(player.level)}
                  </div>
                </div>
                <div>
                  <div className="text-card-foreground/40">Overall Rank</div>
                  <div className="text-lg font-semibold text-white">
                    {formatNumber.format(player.overallRank)}
                  </div>
                </div>
                <div>
                  <div className="text-card-foreground/40">Attack Turns</div>
                  <div className="text-lg font-semibold text-white">
                    {formatNumber.format(player.attackTurns)}
                  </div>
                </div>
                <div>
                  <div className="text-card-foreground/40">Next Turn</div>
                  <div className="text-lg font-semibold text-white">
                    {timeRemaining ?? '—'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-card border border-card-border lg:grid-cols-4">
          {stats.map((stat) => (
            <Stat key={stat.name} {...stat} />
          ))}
        </dl>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Experience to next level.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-card-foreground/60">
              <span>Experience</span>
              <span>
                {formatNumber.format(player.experience)} /{' '}
                {formatNumber.format(nextLevelXP)}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-card-foreground/10">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-card-foreground/40">
              {formatNumber.format(xpRemaining)} XP needed for next level.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Economy</CardTitle>
            <CardDescription>Gold flow and banking status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-card-foreground/60">
            <div className="flex justify-between text-card-foreground/70">
              <span>Gold on Hand</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(player.gold)}
              </span>
            </div>
            <div className="flex justify-between text-card-foreground/70">
              <span>Gold in Bank</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(player.goldInBank)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Gold per Turn</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(player.goldPerTurn)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Deposits Remaining</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(depositsRemaining)}
              </span>
            </div>
            <div className="text-xs text-card-foreground/40">
              {latestTransaction
                ? `Last ${latestTransaction.type} of ${formatNumber.format(
                    latestTransaction.amount,
                  )} on ${new Date(latestTransaction.date).toLocaleString()}`
                : 'No recent bank activity.'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forces</CardTitle>
            <CardDescription>Population and unit breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-card-foreground/60">
            <div className="flex justify-between text-card-foreground/70">
              <span>Population</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(population)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Citizens</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(citizens)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Workers</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(workers)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Offence Units</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(unitsByType[UnitType.OFFENCE])}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Defence Units</span>
              <span className="font-semibold text-card-foreground">
                {formatNumber.format(unitsByType[UnitType.DEFENCE])}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
