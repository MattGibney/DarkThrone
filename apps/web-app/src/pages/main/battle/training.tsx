import DarkThroneClient from '@darkthrone/client-library';
import SubNavigation from '../../../components/layout/subNavigation';
import { Button, InputField } from '@darkthrone/react-components';
import { useState } from 'react';
import { UnitTypes } from '@darkthrone/game-data';

interface TrainingScreenProps {
  client: DarkThroneClient;
}
export default function TrainingScreen(props: TrainingScreenProps) {
  const [inpuValues, setInputValuess] = useState<{ [k: string]: number }>({});

  const renderUnitTypes = ['worker', 'soldier_1', 'guard_1'].map((unitID) => {
    const typeData = UnitTypes[unitID];
    const attributes: string[] = [];
    if (typeData.attack) {
      attributes.push(`+ ${typeData.attack} attack`);
    }
    if (typeData.defence) {
      attributes.push(`+ ${typeData.defence} defense`);
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
    <main>
      <SubNavigation />

      <div className="border border-zinc-700/50 bg-zinc-800/50 p-4 flex justify-center gap-x-12 text-zinc-400 text-sm">
        <div>
          Gold{' '}
          <span className="text-white font-bold text-md">
            {new Intl.NumberFormat().format(
              props.client.authenticatedPlayer?.gold || 0,
            )}
          </span>
        </div>
        <div>
          Citizens{' '}
          <span className="text-white font-bold text-md">
            {new Intl.NumberFormat().format(
              props.client.authenticatedPlayer?.units.find(
                (unit) => unit.unitType === 'citizen',
              )?.quantity || 0,
            )}
          </span>
        </div>
      </div>
      <form onSubmit={handleTrain}>
        <div className="sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full sm:py-2 align-middle">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500"
                      >
                        Unit Type
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500"
                      >
                        Attributes
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32"
                      >
                        You Have
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32"
                      >
                        Cost
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32"
                      >
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderUnitTypes.map((unit, unitIdx) => (
                      <tr
                        key={unitIdx}
                        className="even:bg-zinc-800 odd:bg-zinc-800/50"
                      >
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                          {unit.name}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                          {unit.attributes.join(', ')}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                          {new Intl.NumberFormat().format(
                            props.client.authenticatedPlayer?.units.find(
                              (playerUnit) => playerUnit.unitType === unit.id,
                            )?.quantity || 0,
                          )}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                          {new Intl.NumberFormat().format(unit.cost)}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                          <InputField
                            value={
                              inpuValues[unit.id]
                                ? inpuValues[unit.id].toString()
                                : ''
                            }
                            setValue={(val) => setInputValue(unit.id, val)}
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

        <div className="flex justify-end gap-x-4 mt-8">
          <div>
            <Button
              text={'Untrain'}
              type="button"
              onClick={handleUnTrain}
              variant="secondary"
            />
          </div>
          <div>
            <Button text={'Train'} type="submit" variant="primary" />
          </div>
        </div>
      </form>
    </main>
  );
}
