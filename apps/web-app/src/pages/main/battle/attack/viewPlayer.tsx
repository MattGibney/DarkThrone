import DarkThroneClient from '@darkthrone/client-library';
import { Avatar } from '@darkthrone/react-components';
import { classNames } from '../../../../utils';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerObject } from '@darkthrone/interfaces';
import { attackableLevels } from '@darkthrone/game-data';
import { Trans } from 'react-i18next';

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

      const playerFetch = await props.client.players.fetchByID(playerID);

      if (playerFetch.status === 'fail') {
        setPlayer(null);
        return;
      }

      setPlayer(playerFetch.data);
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
  const items = [
    {
      name: 'Attack',
      navigate: `/attack/${player.id}`,
      isDisabled: isViewingSelf || !isAttackable,
    },
    // {
    //   name: 'Message Player',
    //   isDisabled: isViewingSelf,
    // },
    // {
    //   name: 'Report',
    //   isDisabled: isViewingSelf,
    // },
  ];

  const statistics = [
    {
      name: 'gold',
      value: new Intl.NumberFormat().format(player.gold),
    },
    {
      name: 'armySize',
      value: new Intl.NumberFormat().format(player.armySize),
    },
    {
      name: 'level',
      value: player.level,
    },
    {
      name: 'overallRank',
      value: player.overallRank,
    },
  ];

  return (
    <div className="my-12 mx-auto max-w-2xl flex gap-x-6">
      <div className="w-1/2 flex flex-col gap-y-6">
        <section>
          <div className="aspect-square">
            <Avatar
              url={player.avatarURL}
              race={player.race}
              size="fill"
              variant="square"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-semibold text-zinc-300">
              {player.name}
            </h2>
            <p className="text-sm text-zinc-400 capitalize">
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

        <hr className="border-zinc-700" />
      </div>

      <div className="w-1/2 flex flex-col gap-y-6">
        <nav className="bg-zinc-800 rounded-lg overflow-hidden">
          <ul className="flex flex-col divide-y divide-zinc-700">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  className={classNames(
                    'w-full text-sm text-zinc-300 hover:bg-zinc-700 px-4 py-3 flex justify-between items-center',
                    item.isDisabled ? 'opacity-50 cursor-not-allowed' : '',
                  )}
                  onClick={() => {
                    if (item.navigate) navigate(item.navigate);
                  }}
                  disabled={item.isDisabled}
                >
                  <div>
                    <Trans i18nKey={item.name} />
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-zinc-600"
                    height="1.3em"
                    viewBox="0 0 320 512"
                  >
                    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-bold mb-2 mx-2">Statistics</h3>
          <div className="bg-zinc-800 text-zinc-200 rounded-lg text-sm">
            <dl className="divide-y divide-white/10">
              {statistics.map((statistic, index) => (
                <div key={index} className="px-4 py-2">
                  <dt className="text-sm font-medium leading-6 text-white">
                    <Trans i18nKey={statistic.name} />
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-zinc-400 sm:col-span-2 sm:mt-0">
                    {statistic.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
