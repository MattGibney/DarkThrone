import DarkThroneClient from '@darkthrone/client-library';
import SubNavigation from '../../../../components/layout/subNavigation';
import { fortificationUpgrades, housingUpgrades } from '@darkthrone/game-data';
import { Button } from '@darkthrone/react-components';
import { structureUpgrades } from '@darkthrone/game-data';
import { Trans } from 'react-i18next';
import { t } from 'i18next';

interface UpgradesScreenProps {
  client: DarkThroneClient;
}
export default function UpgradesScreen(props: UpgradesScreenProps) {
  if (!props.client.authenticatedPlayer) return null;

  const currentFortificationLevel =
    props.client.authenticatedPlayer.structureUpgrades.fortification;
  const currentHousingLevel =
    props.client.authenticatedPlayer.structureUpgrades.housing;
  const upgrades = {
    fortification: {
      current: fortificationUpgrades[currentFortificationLevel],
      next: fortificationUpgrades[currentFortificationLevel + 1],
    },
    housing: {
      current: housingUpgrades[currentHousingLevel],
      next: housingUpgrades[currentHousingLevel + 1],
    },
  };

  async function handleUpgrade(type: keyof typeof structureUpgrades) {
    await props.client.structures.upgrade(type);
  }

  return (
    <main className="max-w-7xl mx-auto">
      <SubNavigation />

      <div className="max-w-3xl mx-auto flex flex-col gap-y-8">
        <div className="bg-zinc-800/50 rounded-lg p-4 flex justify-center gap-x-12 text-zinc-400 text-sm">
          <div>
            <Trans i18nKey="gold" />{' '}
            <span className="text-white font-bold text-md">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.gold,
              )}
            </span>
          </div>
          <div>
            <Trans i18nKey="playerLevel" ns="upgrades" />{' '}
            <span className="text-white font-bold text-md">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.level,
              )}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden text-center text-zinc-200">
          <div className="bg-zinc-800 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg"><Trans i18nKey="currentFortification" ns="upgrades" /></h3>
            <div>
              <p className="text-white font-bold">
                {t(upgrades.fortification.current.name, { ns: 'structures' })}
              </p>
              <p>
              <Trans i18nKey="goldPerTurn" />:{' '}
                {new Intl.NumberFormat().format(
                  upgrades.fortification.current.goldPerTurn,
                )}
              </p>
              <p>
                <Trans i18nKey="defenceBonus" ns="upgrades"/>:{' '}
                {upgrades.fortification.current.defenceBonusPercentage}%
              </p>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg">Next Upgrade</h3>
            {upgrades.fortification.next ? (
              <>
                <div>
                  <p className="text-white font-bold">
                    {t(upgrades.fortification.next.name, { ns: 'structures' })}
                  </p>
                  <p>
                    <Trans i18nKey="goldPerTurn" />:{' '}
                    {new Intl.NumberFormat().format(
                      upgrades.fortification.next.goldPerTurn,
                    )}
                  </p>
                  <p>
                    <Trans i18nKey="defenceBonus" ns="upgrades"/>:{' '}
                    {upgrades.fortification.next.defenceBonusPercentage}%
                  </p>
                </div>

                {props.client.authenticatedPlayer.level <
                upgrades.fortification.next.levelRequirement ? (
                  <>
                    <p>
                      <Trans i18nKey="cost" />:{' '}
                      {new Intl.NumberFormat().format(
                        upgrades.fortification.next.cost,
                      )}{' '}
                      <span className="text-gold"><Trans i18nKey="gold" /></span>
                    </p>
                    <p className="bg-cyan-800/40 border border-cyan-900/80 text-sm font-medium text-cyan-40 p-2 rounded-md">
                      <Trans i18nKey="levelRequirement" ns="upgrades" values={{level:upgrades.fortification.next.levelRequirement}} />
                    </p>
                  </>
                ) : (
                  <Button
                    variant="primary-outline"
                    onClick={() => handleUpgrade('fortification')}
                    type="button"
                    isDisabled={
                      props.client.authenticatedPlayer.gold <
                      upgrades.fortification.next.cost
                    }
                  >
                    <Trans i18nKey="upgradeFor" ns="upgrades" values={{gold: new Intl.NumberFormat().format(upgrades.fortification.next.cost)}} />
                  </Button>
                )}
              </>
            ) : (
              <p className="text-zinc-200">
                <Trans i18nKey="noMoreFortificationUpgrades" ns="upgrades" />
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden text-center text-zinc-200">
          <div className="bg-zinc-800 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg"><Trans i18nKey="currentHousing" ns="upgrades" /></h3>
            <div>
              <p className="text-white font-bold">
                {t(upgrades.housing.current.name, { ns: 'structures' })}
              </p>
              <p>
                <Trans i18nKey="dailyCitizens" ns="upgrades" />:{' '}
                {new Intl.NumberFormat().format(
                  upgrades.housing.current.citizensPerDay,
                )}
              </p>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg"><Trans i18nKey="nextHousing" ns="upgrades" /></h3>
            {upgrades.housing.next ? (
              <>
                <div>
                  <p className="text-white font-bold">
                    {t(upgrades.housing.next.name, { ns: 'structures' })}
                  </p>
                  <p>
                    <Trans i18nKey="dailyCitizens" ns="upgrades" />:{' '}
                    {new Intl.NumberFormat().format(
                      upgrades.housing.next.citizensPerDay,
                    )}
                  </p>
                </div>

                {props.client.authenticatedPlayer.structureUpgrades
                  .fortification <
                upgrades.housing.next.requiredFortificationLevel ? (
                  <>
                    <p>
                      <Trans i18nKey="cost" />:{' '}
                      {new Intl.NumberFormat().format(
                        upgrades.housing.next.cost,
                      )}{' '}
                      <span className="text-gold"><Trans i18nKey="gold" /></span>
                    </p>
                    <p className="bg-cyan-800/40 border border-cyan-900/80 text-sm font-medium text-cyan-40 p-2 rounded-md">
                      <Trans i18nKey="fortificationRequirement" ns="upgrades" values={{name: structureUpgrades.fortification[upgrades.housing.next.requiredFortificationLevel].name}} />
                    </p>
                  </>
                ) : (
                  <Button
                    variant="primary-outline"
                    onClick={() => handleUpgrade('housing')}
                    type="button"
                    isDisabled={
                      props.client.authenticatedPlayer.gold <
                      upgrades.housing.next.cost
                    }
                  >
                    <Trans i18nKey="upgradeFor" ns="upgrades" values={{gold: new Intl.NumberFormat().format(upgrades.housing.next.cost)}} />
                  </Button>
                )}
              </>
            ) : (
              <p className="text-zinc-200">
                <Trans i18nKey="noMoreHousingUpgrades" ns="upgrades" />
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
