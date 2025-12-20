import DarkThroneClient from '@darkthrone/client-library';
import {
  fortificationUpgrades,
  housingUpgrades,
  armouryUpgrades,
} from '@darkthrone/game-data';
import { Button } from '@darkthrone/shadcnui/button';
import { StructureUpgradeType } from '@darkthrone/interfaces';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@darkthrone/shadcnui/card';

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
    <main className="grid gap-6 mx-auto max-w-4xl">
      <Card>
        <CardContent className="flex justify-center gap-x-12 text-card-foreground/70 text-sm">
          <div>
            Gold{' '}
            <span className="text-card-foreground font-bold text-md">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer?.gold || 0,
              )}
            </span>
          </div>
          <div>
            Citizens{' '}
            <span className="text-card-foreground font-bold text-md">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer?.units.find(
                  (unit) => unit.unitType === 'citizen',
                )?.quantity || 0,
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted border border-card-border grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden text-center text-foreground">
        <div className="p-8 flex flex-col gap-y-4 text-sm">
          <h3 className="font-semibold text-lg">Current Fortification</h3>
          <div>
            <p className="text-foreground font-bold">
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
        <div className="bg-card p-8 flex flex-col gap-y-4 text-sm">
          <h3 className="font-semibold text-lg">Next Upgrade</h3>
          {upgrades.fortification.next ? (
            <>
              <div>
                <p className="text-foreground font-bold">
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
                    Gold
                  </p>
                  <p className="bg-accent/40 border border-accent/80 text-sm font-medium text-accent-foreground p-2 rounded-md">
                    You need to be level{' '}
                    {upgrades.fortification.next.levelRequirement} to upgrade
                  </p>
                </>
              ) : (
                <Button
                  variant="default"
                  size={'lg'}
                  onClick={() => handleUpgrade('fortification')}
                  type="button"
                  disabled={
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
            <p className="text-foreground">
              There are currently no more available fortification upgrades
            </p>
          )}
        </div>
      </div>

      <div className="bg-muted border border-card-border grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden text-center text-foreground">
        <div className="p-8 flex flex-col gap-y-4 text-sm">
          <h3 className="font-semibold text-lg">Current Housing</h3>
          <div>
            <p className="text-foreground font-bold">
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
        <div className="bg-card p-8 flex flex-col gap-y-4 text-sm">
          <h3 className="font-semibold text-lg">Next Housing</h3>
          {upgrades.housing.next ? (
            <>
              <div>
                <p className="text-foreground font-bold">
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
                    {new Intl.NumberFormat().format(upgrades.housing.next.cost)}{' '}
                    <span className="text-gold">Gold</span>
                  </p>
                  <p className="bg-accent/40 border border-accent/80 text-sm font-medium text-accent-foreground p-2 rounded-md">
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
                  variant="default"
                  size={'lg'}
                  onClick={() => handleUpgrade('housing')}
                  type="button"
                  disabled={
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
            <p className="text-foreground">
              There are currently no more available fortification upgrades
            </p>
          )}
        </div>
      </div>

      <div className="bg-muted border border-card-border grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden text-center text-foreground">
        <div className="p-8 flex flex-col gap-y-4 text-sm">
          <h3 className="font-semibold text-lg">Current Armoury</h3>
          <div>
            <p className="text-foreground font-bold">
              {upgrades.armoury.current.name}
            </p>
          </div>
        </div>
        <div className="bg-card p-8 flex flex-col gap-y-4 text-sm">
          <h3 className="font-semibold text-lg">Next Armoury</h3>
          {upgrades.armoury.next ? (
            <>
              <div>
                <p className="text-foreground font-bold">
                  {upgrades.armoury.next.name}
                </p>
              </div>

              {props.client.authenticatedPlayer.structureUpgrades
                .fortification <
              upgrades.armoury.next.requiredFortificationLevel ? (
                <>
                  <p>
                    Cost:{' '}
                    {new Intl.NumberFormat().format(upgrades.armoury.next.cost)}{' '}
                    <span className="text-gold">Gold</span>
                  </p>
                  <p className="bg-accent/40 border border-accent/80 text-sm font-medium text-accent-foreground p-2 rounded-md">
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
                  variant="default"
                  size={'lg'}
                  onClick={() => handleUpgrade('armoury')}
                  type="button"
                  disabled={
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
            <p className="text-foreground">
              There are currently no more available armoury upgrades
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
