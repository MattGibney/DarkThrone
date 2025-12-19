import { fortificationUpgrades } from '@darkthrone/game-data';
import DarkThroneClient from '@darkthrone/client-library';
import Stat from '../../../components/home/Stat';

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
      name: 'Fortification',
      value:
        fortificationUpgrades[
          props.client.authenticatedPlayer.structureUpgrades.fortification
        ].name,
    },
    {
      name: 'Citizens Per Day',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.citizensPerDay,
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
      additional:
        'Gold per turn: ' +
        new Intl.NumberFormat('en-GB').format(
          props.client.authenticatedPlayer.goldPerTurn,
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
      <dl className="mx-auto grid grid-cols-1 gap-px bg-zinc-900/5 sm:grid-cols-2 md:grid-cols-5 rounded-xl overflow-hidden">
        {stats.map((stat) => (
          <Stat key={stat.name} {...stat} />
        ))}
      </dl>
    </div>
  );
}
