import DarkThroneClient from '@darkthrone/client-library';
import {
  fortificationUpgrades,
  housingUpgrades,
  armouryUpgrades,
} from '@darkthrone/game-data';
import { Button } from '@darkthrone/react-components';
import { StructureUpgradeType } from '@darkthrone/interfaces';
import { useEffect, useState } from 'react';

interface UpgradesScreenProps {
  client: DarkThroneClient;
}
export default function UpgradesScreen(props: UpgradesScreenProps) {
  if (!props.client.authenticatedPlayer) return null;

  const [currentLevels, setCurrentLevels] = useState({
    fortification: 0,
    housing: 0,
    armoury: 0,
  });

  const upgrades = {
    fortification: {
      current: fortificationUpgrades[currentLevels.fortification],
      next: fortificationUpgrades[currentLevels.fortification + 1],
    },
    housing: {
      current: housingUpgrades[currentLevels.housing],
      next: housingUpgrades[currentLevels.housing + 1],
    },
    armoury: {
      current: armouryUpgrades[currentLevels.armoury],
      next: armouryUpgrades[currentLevels.armoury + 1],
    },
  };

  useEffect(() => {
    if (!props.client.authenticatedPlayer) return;

    setCurrentLevels({
      fortification:
        props.client.authenticatedPlayer.structureUpgrades.fortification,
      housing: props.client.authenticatedPlayer.structureUpgrades.housing,
      armoury: props.client.authenticatedPlayer.structureUpgrades.armoury,
    });
  }, [props.client.authenticatedPlayer.structureUpgrades]);

  async function handleUpgrade(type: StructureUpgradeType) {
    await props.client.structures.upgrade(type);
  }

  return (
    <main className="max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto flex flex-col gap-y-8">
        <div className="bg-zinc-800/50 rounded-lg p-4 flex justify-center gap-x-12 text-zinc-400 text-sm">
          <div>
            Gold{' '}
            <span className="text-white font-bold text-md">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.gold,
              )}
            </span>
          </div>
          <div>
            Current Player Level{' '}
            <span className="text-white font-bold text-md">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.level,
              )}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden text-center text-zinc-200">
          <div className="bg-zinc-800 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg">Current Fortification</h3>
            <div>
              <p className="text-white font-bold">
                {upgrades.fortification.current.name}
              </p>
              <p>
                Gold Per Turn:{' '}
                {new Intl.NumberFormat().format(
                  upgrades.fortification.current.goldPerTurn,
                )}
              </p>
              <p>
                Defence Bonus:{' '}
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
                    {upgrades.fortification.next.name}
                  </p>
                  <p>
                    Gold Per Turn:{' '}
                    {new Intl.NumberFormat().format(
                      upgrades.fortification.next.goldPerTurn,
                    )}
                  </p>
                  <p>
                    Defence Bonus:{' '}
                    {upgrades.fortification.next.defenceBonusPercentage}%
                  </p>
                </div>

                {props.client.authenticatedPlayer.level <
                upgrades.fortification.next.levelRequirement ? (
                  <>
                    <p>
                      Cost:{' '}
                      {new Intl.NumberFormat().format(
                        upgrades.fortification.next.cost,
                      )}{' '}
                      <span className="text-gold">Gold</span>
                    </p>
                    <p className="bg-cyan-800/40 border border-cyan-900/80 text-sm font-medium text-cyan-40 p-2 rounded-md">
                      You need to be level{' '}
                      {upgrades.fortification.next.levelRequirement} to upgrade
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
                    Upgrade for{' '}
                    {new Intl.NumberFormat().format(
                      upgrades.fortification.next.cost,
                    )}{' '}
                    Gold
                  </Button>
                )}
              </>
            ) : (
              <p className="text-zinc-200">
                There are currently no more available fortification upgrades
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden text-center text-zinc-200">
          <div className="bg-zinc-800 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg">Current Housing</h3>
            <div>
              <p className="text-white font-bold">
                {upgrades.housing.current.name}
              </p>
              <p>
                Daily Citizens:{' '}
                {new Intl.NumberFormat().format(
                  upgrades.housing.current.citizensPerDay,
                )}
              </p>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg">Next Housing</h3>
            {upgrades.housing.next ? (
              <>
                <div>
                  <p className="text-white font-bold">
                    {upgrades.housing.next.name}
                  </p>
                  <p>
                    Daily Citizens:{' '}
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
                      Cost:{' '}
                      {new Intl.NumberFormat().format(
                        upgrades.housing.next.cost,
                      )}{' '}
                      <span className="text-gold">Gold</span>
                    </p>
                    <p className="bg-cyan-800/40 border border-cyan-900/80 text-sm font-medium text-cyan-40 p-2 rounded-md">
                      Your fortification must be at least{' '}
                      {
                        fortificationUpgrades[
                          upgrades.housing.next.requiredFortificationLevel
                        ].name
                      }{' '}
                      to upgrade
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
                    Upgrade for{' '}
                    {new Intl.NumberFormat().format(upgrades.housing.next.cost)}{' '}
                    Gold
                  </Button>
                )}
              </>
            ) : (
              <p className="text-zinc-200">
                There are currently no more available fortification upgrades
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden text-center text-zinc-200">
          <div className="bg-zinc-800 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg">Current Armoury</h3>
            <div>
              <p className="text-white font-bold">
                {upgrades.armoury.current.name}
              </p>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-8 flex flex-col gap-y-4 text-sm">
            <h3 className="font-semibold text-lg">Next Armoury</h3>
            {upgrades.armoury.next ? (
              <>
                <div>
                  <p className="text-white font-bold">
                    {upgrades.armoury.next.name}
                  </p>
                </div>

                {props.client.authenticatedPlayer.structureUpgrades
                  .fortification <
                upgrades.armoury.next.requiredFortificationLevel ? (
                  <>
                    <p>
                      Cost:{' '}
                      {new Intl.NumberFormat().format(
                        upgrades.armoury.next.cost,
                      )}{' '}
                      <span className="text-gold">Gold</span>
                    </p>
                    <p className="bg-cyan-800/40 border border-cyan-900/80 text-sm font-medium text-cyan-40 p-2 rounded-md">
                      Your fortification must be at least{' '}
                      {
                        fortificationUpgrades[
                          upgrades.armoury.next.requiredFortificationLevel
                        ].name
                      }{' '}
                      to upgrade
                    </p>
                  </>
                ) : (
                  <Button
                    variant="primary-outline"
                    onClick={() => handleUpgrade('armoury')}
                    type="button"
                    isDisabled={
                      props.client.authenticatedPlayer.gold <
                      upgrades.armoury.next.cost
                    }
                  >
                    Upgrade for{' '}
                    {new Intl.NumberFormat().format(upgrades.armoury.next.cost)}{' '}
                    Gold
                  </Button>
                )}
              </>
            ) : (
              <p className="text-zinc-200">
                There are currently no more available armoury upgrades
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
