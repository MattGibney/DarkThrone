import { useState } from 'react';
import DarkThroneClient from '@darkthrone/client-library';
import { UnitTypes } from '@darkthrone/game-data';
import {
  ExtractErrorCodesForStatuses,
  PlayerUnits,
  POST_trainUnits,
  POST_unTrainUnits,
} from '@darkthrone/interfaces';
import { Card, CardContent } from '@darkthrone/shadcnui/card';
import { Input } from '@darkthrone/shadcnui/input';
import { Button } from '@darkthrone/shadcnui/button';
import { InlineErrorAlert } from '../../../components/inlineErrorAlert';
import { getApiErrorMessages } from '../../../libs/apiErrors';

interface TrainingScreenProps {
  client: DarkThroneClient;
}

type TrainErrorCode = ExtractErrorCodesForStatuses<POST_trainUnits, 400 | 500>;
type UnTrainErrorCode = ExtractErrorCodesForStatuses<
  POST_unTrainUnits,
  400 | 500
>;
type PossibleErrorCode = TrainErrorCode | UnTrainErrorCode;

export default function TrainingScreen(props: TrainingScreenProps) {
  if (!props.client.authenticatedPlayer) return null;
  const authenticatedPlayer = props.client.authenticatedPlayer;

  const errorTranslations: Record<PossibleErrorCode, string> = {
    'training.train.noUnitsRequested':
      'Enter at least one unit quantity before training.',
    'training.train.nonPositiveUnitsRequested':
      'Training quantities must be greater than zero.',
    'training.train.notEnoughCitizens':
      'You do not have enough citizens available to train that many units.',
    'training.train.notEnoughGold':
      'You do not have enough gold to train those units.',
    'training.untrain.noUnitsRequested':
      'Enter at least one trained unit quantity before un-training.',
    'training.untrain.nonPositiveUnitsRequested':
      'Un-training quantities must be greater than zero.',
    'training.untrain.notEnoughUnitsTrained':
      'You do not own enough of one or more selected unit types to un-train that quantity.',
    'training.untrain.insufficientGold':
      'You do not have enough gold to un-train those units.',
    'server.error': 'An unexpected server error occurred. Please try again.',
  };

  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const [errorMessages, setErrorMessages] = useState<PossibleErrorCode[]>([]);

  const availableCitizens =
    authenticatedPlayer.units.find((unit) => unit.unitType === 'citizen')
      ?.quantity ?? 0;
  const runningTotal = Object.entries(inputValues).reduce(
    (total, [unitID, quantity]) => total + quantity * UnitTypes[unitID].cost,
    0,
  );
  const hasEnoughGold = runningTotal <= authenticatedPlayer.gold;

  const buildSelectedUnits = (): PlayerUnits[] =>
    Object.entries(inputValues)
      .map(([unitType, quantity]) => ({
        unitType: unitType as keyof typeof UnitTypes,
        quantity,
      }))
      .filter(({ quantity }) => quantity > 0);

  const ownedUnitQuantity = (unitID: string | number) =>
    authenticatedPlayer.units.find(
      (playerUnit) => playerUnit.unitType === String(unitID),
    )?.quantity ?? 0;

  const validateTrainSelection = (desiredUnits: PlayerUnits[]) => {
    const validationErrors: TrainErrorCode[] = [];
    const totalUnitsRequested = desiredUnits.reduce(
      (total, unit) => total + unit.quantity,
      0,
    );
    const totalCost = desiredUnits.reduce(
      (total, unit) => total + unit.quantity * UnitTypes[unit.unitType].cost,
      0,
    );

    if (desiredUnits.length === 0) {
      validationErrors.push('training.train.noUnitsRequested');
    }
    if (totalUnitsRequested > availableCitizens) {
      validationErrors.push('training.train.notEnoughCitizens');
    }
    if (totalCost > authenticatedPlayer.gold) {
      validationErrors.push('training.train.notEnoughGold');
    }

    return validationErrors;
  };

  const validateUnTrainSelection = (unitsToUnTrain: PlayerUnits[]) => {
    const validationErrors: UnTrainErrorCode[] = [];
    const totalCost = unitsToUnTrain.reduce(
      (total, unit) => total + unit.quantity * UnitTypes[unit.unitType].cost,
      0,
    );

    if (unitsToUnTrain.length === 0) {
      validationErrors.push('training.untrain.noUnitsRequested');
    }
    if (
      unitsToUnTrain.some(
        ({ unitType, quantity }) => quantity > ownedUnitQuantity(unitType),
      )
    ) {
      validationErrors.push('training.untrain.notEnoughUnitsTrained');
    }
    if (totalCost > authenticatedPlayer.gold) {
      validationErrors.push('training.untrain.insufficientGold');
    }

    return validationErrors;
  };

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
    setErrorMessages([]);

    if (value === '') {
      setInputValues((currentValues) => {
        const nextValues = { ...currentValues };
        delete nextValues[inputID];
        return nextValues;
      });
      return;
    }

    const sanitisedValue = Number(value);
    if (Number.isNaN(sanitisedValue) || sanitisedValue <= 0) {
      setInputValues((currentValues) => {
        const nextValues = { ...currentValues };
        delete nextValues[inputID];
        return nextValues;
      });
      return;
    }

    setInputValues((currentValues) => ({
      ...currentValues,
      [inputID]: sanitisedValue,
    }));
  }

  async function handleTrain(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const desiredUnits = buildSelectedUnits();
    const validationErrors = validateTrainSelection(desiredUnits);

    if (validationErrors.length > 0) {
      setErrorMessages(validationErrors);
      return;
    }

    try {
      setErrorMessages([]);
      await props.client.training.trainUnits(desiredUnits);
      setInputValues({});
    } catch (error) {
      setErrorMessages(
        getApiErrorMessages<PossibleErrorCode>(error, 'server.error'),
      );
    }
  }

  async function handleUnTrain() {
    const unitsToUnTrain = buildSelectedUnits();
    const validationErrors = validateUnTrainSelection(unitsToUnTrain);

    if (validationErrors.length > 0) {
      setErrorMessages(validationErrors);
      return;
    }

    try {
      setErrorMessages([]);
      await props.client.training.unTrainUnits(unitsToUnTrain);
      setInputValues({});
    } catch (error) {
      setErrorMessages(
        getApiErrorMessages<PossibleErrorCode>(error, 'server.error'),
      );
    }
  }

  return (
    <main className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="flex justify-center gap-x-12 text-card-foreground/70 text-sm">
          <div>
            Gold{' '}
            <span className="text-card-foreground font-bold text-md">
              {new Intl.NumberFormat().format(authenticatedPlayer.gold)}
            </span>
          </div>
          <div>
            Citizens{' '}
            <span className="text-card-foreground font-bold text-md">
              {new Intl.NumberFormat().format(
                authenticatedPlayer.units.find(
                  (unit) => unit.unitType === 'citizen',
                )?.quantity ?? 0,
              )}
            </span>
          </div>
        </CardContent>
      </Card>
      <form onSubmit={handleTrain}>
        <div className="sm:px-6 lg:px-8">
          <div className="mt-6">
            <InlineErrorAlert
              errors={errorMessages}
              errorTranslations={errorTranslations}
            />
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full sm:py-2 align-middle">
                <table className="min-w-full border border-card-border border-separate border-spacing-0 rounded-lg overflow-hidden">
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
                    {renderUnitTypes.map((unit) => (
                      <tr key={unit.id}>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground">
                          {unit.name}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                          {unit.attributes.join(', ')}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                          {new Intl.NumberFormat().format(
                            authenticatedPlayer.units.find(
                              (playerUnit) => playerUnit.unitType === unit.id,
                            )?.quantity ?? 0,
                          )}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                          {new Intl.NumberFormat().format(unit.cost)}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                          <Input
                            value={
                              inputValues[unit.id]
                                ? inputValues[unit.id].toString()
                                : ''
                            }
                            onChange={(e) =>
                              setInputValue(unit.id, e.target.value)
                            }
                            onFocus={() => setErrorMessages([])}
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
            <div
              className={hasEnoughGold ? 'text-white/75' : 'text-red-500/75'}
            >
              This will cost {new Intl.NumberFormat().format(runningTotal)} gold
            </div>
          ) : null}
          <div>
            <Button
              type="button"
              onClick={handleUnTrain}
              variant="secondary"
              size={'lg'}
            >
              Un-Train
            </Button>
          </div>
          <div>
            <Button type="submit" variant="default" size={'lg'}>
              Train
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
