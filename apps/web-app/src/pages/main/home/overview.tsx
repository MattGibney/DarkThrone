import { fortificationUpgrades } from '@darkthrone/game-data';
import SubNavigation from '../../../components/layout/subNavigation';
import DarkThroneClient from '@darkthrone/client-library';
import Stat from '../../../components/home/Stat';
import { Trans } from 'react-i18next';
import { t } from 'i18next';

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
      stat: 'population',
      value: new Intl.NumberFormat('en-GB').format(population),
    },
    {
      stat: 'armySize',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.armySize,
      ),
    },
    {
      stat: 'level',
      value: props.client.authenticatedPlayer.level,
    },
    {
      stat: 'experience',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.experience,
      ),
    },
    {
      stat: 'fortification',
      value:
        fortificationUpgrades[
          props.client.authenticatedPlayer.structureUpgrades.fortification
        ].name,
    },
    {
      stat: 'citizensPerDay',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.citizensPerDay,
      ),
    },
    {
      stat: 'attackTurns',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.attackTurns,
      ),
    },
    {
      stat: 'gold',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.gold,
      ),
      additional: {
        translation: {
          values: {
            gold: new Intl.NumberFormat('en-GB').format(
              props.client.authenticatedPlayer.goldPerTurn,
            ),
          },
          key: 'goldPerTurn',
          context: 'amount',
        },
      },
    },
    {
      stat: 'attackStrength',
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.attackStrength,
      ),
    },
    {
      stat: 'defenceStrength',
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
          <Trans
            i18nKey="whoAmI"
            values={{
              playerName: props.client.authenticatedPlayer.name,
              race: t(props.client.authenticatedPlayer.race),
              class: t(props.client.authenticatedPlayer.class),
            }}
          >
            <span></span>
            <span className="text-yellow-600"></span>
            <span className="capitalize"></span>
            <span className="capitalize"></span>
          </Trans>
        </h2>

        <div className="flex justify-around text-lg text-zinc-300">
          <div>
            <Trans i18nKey="level" />:{' '}
            <span className="text-white font-bold">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.level,
              )}
            </span>
          </div>
          <div>
            <Trans i18nKey="overallRank" />:{' '}
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
          <Stat key={stat.stat} {...stat} />
        ))}
      </dl>
    </div>
  );
}
