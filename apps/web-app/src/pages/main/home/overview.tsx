import SubNavigation from '../../../components/layout/subNavigation';
import DarkThroneClient from '@darkthrone/client-library';

interface OverviewPageProps {
  client: DarkThroneClient;
}
export default function OverviewPage(props: OverviewPageProps) {
  if (!props.client.authenticatedPlayer) return null;

  const stats = [
    { name: 'Attack Turns', value: new Intl.NumberFormat('en-GB').format(props.client.authenticatedPlayer.attackTurns) },
    { name: 'Gold', value: new Intl.NumberFormat('en-GB').format(props.client.authenticatedPlayer.gold) },
    { name: 'Attack Strength', value: new Intl.NumberFormat('en-GB').format(props.client.authenticatedPlayer.attackStrength) },
    { name: 'Defence Strength', value: new Intl.NumberFormat('en-GB').format(props.client.authenticatedPlayer.defenceStrength) },
  ]

  return (
    <div>
      <SubNavigation />

      {/* lg:grid-cols-4 */}
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-zinc-800 px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-zinc-400">{stat.name}</dt>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-200">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

    </div>
  );
}
