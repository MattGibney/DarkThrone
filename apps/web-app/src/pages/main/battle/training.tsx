import { useEffect, useState } from 'react';
import DarkThroneClient from '@darkthrone/client-library';
import { UnitTypes } from '@darkthrone/game-data';
import { Card, CardContent } from '@darkthrone/shadcnui/card';
import { Input } from '@darkthrone/shadcnui/input';
import { Button } from '@darkthrone/shadcnui/button';

interface TrainingScreenProps {
  client: DarkThroneClient;
}
export default function TrainingScreen(props: TrainingScreenProps) {
  const [inpuValues, setInputValuess] = useState<{ [k: string]: number }>({});
  const [runningTotal, setRunningTotal] = useState(0);
  const [isValidInput, setIsValidInput] = useState(false);

  useEffect(() => {
    if (!props.client.authenticatedPlayer) return;

    let total = 0;
    Object.keys(inpuValues).forEach((unitID) => {
      const unitData = UnitTypes[unitID];
      total += inpuValues[unitID] * unitData.cost;
    });

    setIsValidInput(true);
    if (total > props.client.authenticatedPlayer.gold) {
      setIsValidInput(false);
    }
    setRunningTotal(total);
  }, [inpuValues, props.client.authenticatedPlayer]);

  const renderUnitTypes = ['worker', 'soldier_1', 'guard_1'].map((unitID) => {
    const typeData = UnitTypes[unitID];
    const attributes: string[] = [];
    if (typeData.attack) {
      attributes.push(`+ ${typeData.attack} attack`);
    }
    if (typeData.defence) {
      attributes.push(`+ ${typeData.defence} defence`);
    }
    if (typeData.goldPerTurn) {
      attributes.push(`+ ${typeData.goldPerTurn} gold per turn`);
    }
    return {
      id: unitID,
      name: typeData.name,
      type: typeData.type,
      attributes: attributes,
      cost: typeData.cost,
    };
  });

  function setInputValue(inputID: string, value: string) {
    let sanitisedValue = Number(value);
    if (sanitisedValue < 0) {
      sanitisedValue = 0;
    }
    setInputValuess({ ...inpuValues, [inputID]: sanitisedValue });
  }

  async function handleTrain(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const desiredUnits = Object.keys(inpuValues).map((unitID) => ({
      unitType: unitID,
      quantity: inpuValues[unitID],
    }));
    await props.client.training.trainUnits(desiredUnits);
    setInputValuess({});
  }

  async function handleUnTrain() {
    const unwantedUnits = Object.keys(inpuValues).map((unitID) => ({
      unitType: unitID,
      quantity: inpuValues[unitID],
    }));
    await props.client.training.unTrainUnits(unwantedUnits);
    setInputValuess({});
  }

  return (
    <main className="max-w-5xl mx-auto">
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
      <form onSubmit={handleTrain}>
        <div className="sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full sm:py-2 align-middle">
                <table className="min-w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border"
                      >
                        Unit Type
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border"
                      >
                        Attributes
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border w-32"
                      >
                        You Have
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border w-32"
                      >
                        Cost
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border w-32"
                      >
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderUnitTypes.map((unit, unitIdx) => (
                      <tr key={unitIdx}>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground">
                          {unit.name}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                          {unit.attributes.join(', ')}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                          {new Intl.NumberFormat().format(
                            props.client.authenticatedPlayer?.units.find(
                              (playerUnit) => playerUnit.unitType === unit.id,
                            )?.quantity || 0,
                          )}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                          {new Intl.NumberFormat().format(unit.cost)}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                          <Input
                            value={
                              inpuValues[unit.id]
                                ? inpuValues[unit.id].toString()
                                : ''
                            }
                            onChange={(e) =>
                              setInputValue(unit.id, e.target.value)
                            }
                            type="number"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-x-4 mt-6">
          {runningTotal > 0 ? (
            <div className={isValidInput ? 'text-white/75' : 'text-red-500/75'}>
              This will cost {new Intl.NumberFormat().format(runningTotal)} gold
            </div>
          ) : null}
          <div>
            <Button
              type="button"
              onClick={handleUnTrain}
              variant="secondary"
              size={'lg'}
              disabled={!isValidInput}
            >
              Un-Train
            </Button>
          </div>
          <div>
            <Button
              type="submit"
              variant="default"
              size={'lg'}
              disabled={!isValidInput}
            >
              Train
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
