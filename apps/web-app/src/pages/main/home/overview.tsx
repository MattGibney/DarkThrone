import SubNavigation from '../../../components/layout/subNavigation';
import DarkThroneClient from '@darkthrone/client-library';

interface OverviewPageProps {
  client: DarkThroneClient;
}
export default function OverviewPage(props: OverviewPageProps) {
  if (!props.client.authenticatedPlayer) return null;

  const population = props.client.authenticatedPlayer.units.reduce(
    (acc, unit) => acc + unit.quantity,
    0,
  );

  const stats = [
    {
      name: 'Population',
      value: new Intl.NumberFormat('en-GB').format(population),
    },
    {
      name: 'Army Size',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.armySize,
      ),
    },
    { name: 'Level', value: props.client.authenticatedPlayer.level },
    {
      name: 'Experience',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.experience,
      ),
    },

    {
      name: 'Attack Turns',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.attackTurns,
      ),
    },
    {
      name: 'Gold',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.gold,
      ),
    },
    {
      name: 'Attack Strength',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.attackStrength,
      ),
    },
    {
      name: 'Defence Strength',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.defenceStrength,
      ),
    },
  ];

  return (
    <div>
      <SubNavigation />

      <div className="my-12 flex flex-col gap-12">
        <h2 className="text-2xl font-semibold text-zinc-200 text-center">
          {props.client.authenticatedPlayer.name}{' '}
          <span className="text-yellow-600">is an</span>{' '}
          <span className="capitalize">
            {props.client.authenticatedPlayer.race}
          </span>{' '}
          <span className="capitalize">
            {props.client.authenticatedPlayer.class}
          </span>
        </h2>

        <div className="flex justify-around text-lg text-zinc-300">
          <div>
            Level:{' '}
            <span className="text-white font-bold">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.level,
              )}
            </span>
          </div>
          <div>
            Overall Rank:{' '}
            <span className="text-white font-bold">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.overallRank,
              )}
            </span>
          </div>
        </div>
      </div>

      {/* lg:grid-cols-4 */}
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-zinc-800 px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-zinc-400">
              {stat.name}
            </dt>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-200">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
