import { useState } from 'react';
import { Link } from 'react-router-dom';
import DarkThroneClient from '@darkthrone/client-library';
import { unitItems } from '@darkthrone/game-data';
import { CombatUnitType, UnitItemType, UnitType } from '@darkthrone/interfaces';
import type { UnitItem } from '@darkthrone/interfaces';
import { Button } from '@darkthrone/shadcnui/button';
import { Card, CardContent } from '@darkthrone/shadcnui/card';
import { Input } from '@darkthrone/shadcnui/input';

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
  const itemTypeOrder: UnitItemType[] = [
    'weapon',
    'helm',
    'armor',
    'boots',
    'bracers',
    'shield',
  ];
  const columnWidths = ['28%', '16%', '12%', '14%', '14%', '16%'];
  const itemLookup: Record<string, UnitItem> = unitItems.reduce(
    (acc, item) => ({ ...acc, [item.key]: item }),
    {},
  );
  const ownedQuantity = (itemKey: string) =>
    props.client.authenticatedPlayer?.items.find(
      (owned) => owned.itemKey === itemKey,
    )?.quantity ?? 0;

  // TODO: Replace this approach with i18n.
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

  const summarizeSelection = (action: 'buy' | 'sell') => {
    let totalGold = 0;
    let totalItems = 0;

    Object.entries(quantities).forEach(([key, value]) => {
      const qty = Number(value);
      if (!value || Number.isNaN(qty) || qty <= 0) return;
      const item = itemLookup[key];
      if (!item) return;
      const unitCost = action === 'buy' ? item.buyCost : item.sellCost;
      totalGold += unitCost * qty;
      totalItems += qty;
    });

    return { totalGold, totalItems };
  };

  const confirmAction = (action: 'buy' | 'sell') => {
    const { totalGold, totalItems } = summarizeSelection(action);
    if (totalItems === 0) {
      window.alert(
        `Enter a quantity to ${action === 'buy' ? 'buy' : 'sell'} before proceeding.`,
      );
      return false;
    }

    const verb = action === 'buy' ? 'buying' : 'selling';
    const confirmText = `You are ${verb} ${totalItems} item${
      totalItems === 1 ? '' : 's'
    } for a total of ${new Intl.NumberFormat().format(
      totalGold,
    )} gold.\n\nThis action cannot be undone. Proceed?`;

    return window.confirm(confirmText);
  };

  async function handleBuy() {
    if (!confirmAction('buy')) return;
    const items = Object.entries(quantities)
      .map(([itemKey, value]) => ({ itemKey, quantity: Number(value) }))
      .filter(({ quantity }) => quantity > 0);

    await props.client.armoury.buy(items);
    setQuantities({});
  }

  async function handleSell() {
    if (!confirmAction('sell')) return;
    const items = Object.entries(quantities)
      .map(([itemKey, value]) => ({ itemKey, quantity: Number(value) }))
      .filter(({ quantity }) => quantity > 0);

    await props.client.armoury.sell(items);
    setQuantities({});
  }

  if (props.client.authenticatedPlayer.structureUpgrades.armoury === 0) {
    return (
      <main className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-y-8">
          <Card>
            <CardContent className="flex flex-col gap-y-4 text-card-foreground/70 text-sm">
              <p>
                You do not currently have an armoury. Visit the Upgrades page to
                build one.{' '}
                <Link to="/upgrades" className="text-primary font-semibold">
                  Go to Upgrades
                </Link>
              </p>
              <p>
                Once you have built an armoury, you will be able to research and
                upgrade various types of armour to improve your troops&apos;
                effectiveness in battle.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-y-8">
        <Card>
          <CardContent className="flex justify-center gap-x-12 text-card-foreground/70 text-sm">
            <div>
              Gold{' '}
              <span className="text-card-foreground font-bold text-md">
                {new Intl.NumberFormat().format(
                  props.client.authenticatedPlayer.gold,
                )}
              </span>
            </div>
            <div>
              Current Player Level{' '}
              <span className="text-card-foreground font-bold text-md">
                {new Intl.NumberFormat().format(
                  props.client.authenticatedPlayer.level,
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="flex flex-col gap-y-16">
            {(Object.keys(items) as CombatUnitType[]).map((combatType) => {
              const combatItems = items[combatType];
              const itemTypesWithItems = itemTypeOrder.filter(
                (type) => combatItems[type]?.length,
              );
              const hasItems = itemTypesWithItems.length > 0;
              return (
                <div key={combatType}>
                  <div>
                    {!hasItems ? (
                      <div className="text-sm text-card-foreground/60 px-2">
                        No equipment available yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-y-3">
                        <div className="flex flex-col gap-4">
                          {itemTypesWithItems.map((itemType, index) => {
                            const typeItems = combatItems[itemType];
                            const showHeader = index === 0;
                            return (
                              <div
                                key={itemType}
                                className="overflow-hidden rounded-lg border border-card-border bg-card"
                              >
                                <table className="w-full text-sm text-card-foreground table-fixed">
                                  <colgroup>
                                    {columnWidths.map((width, idx) => (
                                      <col key={idx} style={{ width }} />
                                    ))}
                                  </colgroup>
                                  {showHeader ? (
                                    <thead className="bg-card text-xs uppercase tracking-wide text-card-foreground/60">
                                      <tr>
                                        <th className="py-3 px-3 text-left font-semibold text-card-foreground">
                                          {combatTypeLabels[combatType]}
                                        </th>
                                        <th className="py-3 px-3 text-center font-semibold">
                                          Bonus
                                        </th>
                                        <th className="py-3 px-3 text-center font-semibold">
                                          You Have
                                        </th>
                                        <th className="py-3 px-3 text-center font-semibold">
                                          Cost
                                        </th>
                                        <th className="py-3 px-3 text-center font-semibold">
                                          Sell Value
                                        </th>
                                        <th className="py-3 px-3 text-center font-semibold">
                                          Quantity
                                        </th>
                                      </tr>
                                    </thead>
                                  ) : null}
                                  <tbody className="divide-y divide-card-border">
                                    <tr className="bg-muted/60 text-card-foreground">
                                      <td
                                        colSpan={6}
                                        className="py-3 px-3 text-xs font-semibold uppercase tracking-wide"
                                      >
                                        Item Type: {itemTypeLabels[itemType]}
                                      </td>
                                    </tr>
                                    {typeItems.map((item) => (
                                      <tr
                                        key={item.key}
                                        className="hover:bg-muted/40 transition-colors"
                                      >
                                        <td className="py-3 px-3 font-semibold text-card-foreground">
                                          {formatItemName(item.key)}
                                        </td>
                                        <td className="py-3 px-3 text-card-foreground/80">
                                          {formatBonuses(item.bonuses)}
                                        </td>
                                        <td className="py-3 px-3 text-card-foreground/80">
                                          {ownedQuantity(item.key)}
                                        </td>
                                        <td className="py-3 px-3 text-card-foreground/80">
                                          {new Intl.NumberFormat().format(
                                            item.buyCost,
                                          )}
                                        </td>
                                        <td className="py-3 px-3 text-card-foreground/80">
                                          {new Intl.NumberFormat().format(
                                            item.sellCost,
                                          )}
                                        </td>
                                        <td className="py-3 px-3">
                                          <div className="max-w-32">
                                            <Input
                                              type="number"
                                              value={quantities[item.key] ?? ''}
                                              onChange={(event) =>
                                                handleQuantityChange(
                                                  item.key,
                                                  event.target.value,
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-end gap-x-2">
                          <div>
                            <Button
                              variant="secondary"
                              size={'lg'}
                              onClick={handleSell}
                            >
                              Sell
                            </Button>
                          </div>
                          <div>
                            <Button
                              variant="default"
                              size={'lg'}
                              onClick={handleBuy}
                            >
                              Buy
                            </Button>
                          </div>
                        </div>
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
