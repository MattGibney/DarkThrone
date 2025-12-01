import { fortificationUpgrades } from '@darkthrone/game-data';
import { useTranslation } from 'react-i18next';
import SubNavigation from '../../../components/layout/subNavigation';
import DarkThroneClient from '@darkthrone/client-library';
import Stat from '../../../components/home/Stat';

interface OverviewPageProps {
  client: DarkThroneClient;
}

export default function OverviewPage(props: OverviewPageProps) {
  const { t } = useTranslation('home');
  if (!props.client.authenticatedPlayer) return null;

  const population = props.client.authenticatedPlayer.units.reduce(
    (acc, unit) => acc + unit.quantity,
    0,
  );

  const stats = [
    {
      name: t('overview.population'),
      value: new Intl.NumberFormat('en-GB').format(population),
    },
    {
      name: t('overview.armySize'),
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.armySize,
      ),
    },
    {
      name: t('overview.level'),
      value: props.client.authenticatedPlayer.level,
    },
    {
      name: t('overview.experience'),
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.experience,
      ),
    },
    {
      name: t('overview.fortification'),
      value:
        fortificationUpgrades[
          props.client.authenticatedPlayer.structureUpgrades.fortification
        ].name,
    },
    {
      name: t('overview.citizensPerDay'),
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.citizensPerDay,
      ),
    },
    {
      name: t('overview.attackTurns'),
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.attackTurns,
      ),
    },
    {
      name: t('overview.gold'),
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.gold,
      ),
      additional:
        `${t('overview.goldPerTurn')}: ${new Intl.NumberFormat('en-GB').format(
          props.client.authenticatedPlayer.goldPerTurn,
        )}`,
    },
    {
      name: t('overview.attackStrength'),
      value: new Intl.NumberFormat('en-GB').format(
        props.client.authenticatedPlayer.attackStrength,
      ),
    },
    {
      name: t('overview.defenceStrength'),
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
          <span className="text-yellow-600">{t('overview.isAn')}</span>{' '}
          <span className="capitalize">
            {props.client.authenticatedPlayer.race}
          </span>{' '}
          <span className="capitalize">
            {props.client.authenticatedPlayer.class}
          </span>
        </h2>

        <div className="flex justify-around text-lg text-zinc-300">
          <div>
            {t('overview.labels.level')}{' '}
            <span className="text-white font-bold">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.level,
              )}
            </span>
          </div>
          <div>
            {t('overview.labels.overallRank')}{' '}
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
