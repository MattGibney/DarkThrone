import DarkThroneClient from '@darkthrone/client-library';
import { Avatar } from '../../../../components/avatar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerObject } from '@darkthrone/interfaces';
import { attackableLevels } from '@darkthrone/game-data';
import { Button } from '@darkthrone/shadcnui/button';
import { Card, CardContent } from '@darkthrone/shadcnui/card';

interface AttackViewPlayerPageProps {
  client: DarkThroneClient;
}
export default function AttackViewPlayerPage(props: AttackViewPlayerPageProps) {
  const navigate = useNavigate();

  const { playerID } = useParams<{ playerID: string }>();

  const [player, setPlayer] = useState<PlayerObject | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchPlayer = async () => {
      if (playerID === undefined) {
        setPlayer(null);
        return;
      }

      try {
        const playerFetch = await props.client.players.fetchByID(playerID);
        setPlayer(playerFetch);
      } catch {
        setPlayer(null);
      }
    };
    fetchPlayer();
  }, [playerID, props.client.players]);

  if (player === undefined) return;

  if (player === null) return <div>Player not found</div>;

  const isViewingSelf = player.id === props.client.authenticatedPlayer?.id;
  const isAttackable = attackableLevels(
    player.level,
    props.client.authenticatedPlayer?.level || 0,
  );
  const attackDisabledReason = isViewingSelf
    ? 'You cannot attack yourself.'
    : !isAttackable
      ? 'This player is outside your attackable level range.'
      : null;

  const statistics = [
    {
      name: 'Gold',
      value: new Intl.NumberFormat().format(player.gold),
    },
    {
      name: 'Army Size',
      value: new Intl.NumberFormat().format(player.armySize),
    },
    {
      name: 'Level',
      value: player.level,
    },
    {
      name: 'Overall Rank',
      value: player.overallRank,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6 lg:flex-row lg:gap-x-6">
      <div className="w-full lg:w-1/2 flex flex-col gap-y-6">
        <section>
          <div className="aspect-square w-full max-w-xs lg:mx-0 mx-auto">
            <Avatar
              url={player.avatarURL}
              race={player.race}
              size="fill"
              variant="square"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-semibold text-foreground">
              {player.name}
            </h2>
            <p className="text-sm text-foreground/50 capitalize">
              {player.race} {player.class}
            </p>
          </div>
        </section>

        {/* <section>
          <p className='text-sm text-zinc-300'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi temporibus optio deleniti, natus eum tempora sed soluta nisi fugit alias ea, quo autem inventore quae porro voluptatem tempore molestiae aliquid!
          </p>
        </section>

        <section>
          <p className='text-sm text-zinc-400 flex gap-x-2'>
            <span><span className='font-semibold text-zinc-200'>10</span> Friends</span>
            &middot;
            <span><span className='font-semibold text-zinc-200'>5</span> Enemies</span>
          </p>
        </section> */}

        {/* <Separator /> */}
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-y-6">
        <div>
          <Button
            className="w-full py-6"
            variant="default"
            size={'lg'}
            disabled={isViewingSelf || !isAttackable}
            onClick={() => navigate(`/attack/${player.id}`)}
          >
            Attack Player
          </Button>
          {attackDisabledReason ? (
            <p className="mt-2 text-xs text-foreground/60">
              {attackDisabledReason}
            </p>
          ) : null}
        </div>

        <div>
          <h3 className="font-semibold mb-2 mx-2">Statistics</h3>
          <Card>
            <CardContent>
              <dl className="grid gap-y-4">
                {statistics.map((statistic, index) => (
                  <div key={index}>
                    <dt className="text-sm font-medium leading-6 text-card-foreground/50">
                      {statistic.name}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:mt-0">
                      {statistic.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
