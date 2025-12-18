import DarkThroneClient from '@darkthrone/client-library';
import SubNavigation from '../../../../components/layout/subNavigation';
import { Link } from 'react-router-dom';
import { unitItems } from '@darkthrone/game-data';
import { CombatUnitType, UnitItemType, UnitType } from '@darkthrone/interfaces';
import { InputField } from '@darkthrone/react-components';
import { useState } from 'react';
import type { UnitItem } from '@darkthrone/interfaces';

interface ArmouryScreenProps {
  client: DarkThroneClient;
}
export default function ArmouryScreen(props: ArmouryScreenProps) {
  if (!props.client.authenticatedPlayer) return null;

  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const items: Record<CombatUnitType, Record<UnitItemType, UnitItem[]>> = {
    [UnitType.OFFENCE]: {
      weapon: [],
      helm: [],
      armor: [],
      boots: [],
      bracers: [],
      shield: [],
    },
    [UnitType.DEFENCE]: {
      weapon: [],
      helm: [],
      armor: [],
      boots: [],
      bracers: [],
      shield: [],
    },
  };

  unitItems.forEach((item) => {
    const combatType = item.unitType as CombatUnitType;
    items[combatType][item.itemType].push(item);
  });

  const combatTypeLabels: Record<CombatUnitType, string> = {
    [UnitType.OFFENCE]: 'Offence',
    [UnitType.DEFENCE]: 'Defence',
  };

  const itemTypeLabels: Record<UnitItemType, string> = {
    weapon: 'Weapons',
    helm: 'Helms',
    armor: 'Armor',
    boots: 'Boots',
    bracers: 'Bracers',
    shield: 'Shields',
  };

  const formatItemName = (key: string) => {
    const [, rawName] = key.split(':');
    if (!rawName) return key;
    return rawName
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const formatBonuses = (bonus: UnitItem['bonuses']) => {
    const bonuses: string[] = [];
    if (bonus.offence) bonuses.push(`+${bonus.offence} Offence`);
    if (bonus.defence) bonuses.push(`+${bonus.defence} Defence`);
    return bonuses.length ? bonuses.join(' / ') : 'None';
  };

  const handleQuantityChange = (itemKey: string, value: string) => {
    if (value === '') {
      setQuantities({ ...quantities, [itemKey]: '' });
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) {
      setQuantities({ ...quantities, [itemKey]: '' });
      return;
    }
    setQuantities({ ...quantities, [itemKey]: parsed.toString() });
  };

  if (props.client.authenticatedPlayer.structureUpgrades.armoury === 0) {
    return (
      <main className="max-w-7xl mx-auto">
        <SubNavigation />

        <div className="max-w-3xl mx-auto flex flex-col gap-y-8">
          <div className="bg-zinc-800/50 rounded-lg p-4 flex flex-col gap-y-4 text-zinc-400 text-sm">
            <p>
              You do not currently have an armoury. Visit the Upgrades page to
              build one.{' '}
              <Link to="/upgrades" className="text-yellow-500">
                Go to Upgrades
              </Link>
            </p>
            <p>
              Once you have built an armoury, you will be able to research and
              upgrade various types of armour to improve your troops&apos;
              effectiveness in battle.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto">
      <SubNavigation />

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

        <div className="bg-zinc-800/50 rounded-lg p-4 flex flex-col gap-y-4 text-zinc-400 text-sm">
          <p className="text-lg font-semibold text-white">Armoury</p>
          <p className="text-sm text-zinc-400">
            Purchase equipment for your units. Choose a combat type, then pick
            the gear you want and specify quantities.
          </p>
          <div className="flex flex-col gap-y-8">
            {(Object.keys(items) as CombatUnitType[]).map((combatType) => {
              const combatItems = items[combatType];
              const flatItems = (
                Object.keys(combatItems) as UnitItemType[]
              ).flatMap((itemType) => combatItems[itemType]);
              return (
                <div
                  key={combatType}
                  className="border border-zinc-700/70 rounded-lg overflow-hidden"
                >
                  <div className="bg-zinc-900/70 px-4 py-3 border-b border-zinc-700/70">
                    <h3 className="text-white font-semibold text-lg">
                      {combatTypeLabels[combatType]} Equipment
                    </h3>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                    {flatItems.length === 0 ? (
                      <div className="text-sm text-zinc-400 px-2">
                        No equipment available yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {flatItems.map((item) => (
                          <div
                            key={item.key}
                            className="rounded-lg border border-zinc-700/70 bg-zinc-900/40 p-3 md:p-4 grid grid-cols-2 gap-3 md:grid-cols-[1.4fr,1fr,0.9fr,0.9fr,0.9fr,1fr] md:items-center"
                          >
                            <div className="col-span-2 md:col-span-1 flex items-start justify-between gap-3 md:block">
                              <div className="flex flex-col">
                                <p className="text-white font-semibold">
                                  {formatItemName(item.key)}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {itemTypeLabels[item.itemType]}
                                </p>
                              </div>
                            </div>
                            <div className="md:col-span-1">
                              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                Bonuses
                              </p>
                              <p className="text-sm text-zinc-200">
                                {formatBonuses(item.bonuses)}
                              </p>
                            </div>
                            <div className="md:col-span-1">
                              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                You Have
                              </p>
                              <p className="text-sm text-zinc-200">0</p>
                            </div>
                            <div className="md:col-span-1">
                              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                Cost
                              </p>
                              <p className="text-sm text-zinc-200">
                                {new Intl.NumberFormat().format(item.buyCost)}
                              </p>
                            </div>
                            <div className="md:col-span-1">
                              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                Sell Value
                              </p>
                              <p className="text-sm text-zinc-200">
                                {new Intl.NumberFormat().format(item.sellCost)}
                              </p>
                            </div>
                            <div className="md:col-span-1">
                              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                Quantity
                              </p>
                              <InputField
                                type="number"
                                value={quantities[item.key] ?? ''}
                                setValue={(val) =>
                                  handleQuantityChange(item.key, val)
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
