import DarkThroneClient from '@darkthrone/client-library';
import { useState, useEffect } from 'react';

interface ProficiencyPointsProps {
  client: DarkThroneClient;
}

type ProficiencyKey =
  | 'strength'
  | 'constitution'
  | 'wealth'
  | 'dexterity'
  | 'charisma';

export default function ProficiencyPage(props: ProficiencyPointsProps) {
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [points, setPoints] = useState(() => {
    return (
      props.client.authenticatedPlayer?.proficiencyPoints || {
        strength: 0,
        constitution: 0,
        wealth: 0,
        dexterity: 0,
        charisma: 0,
      }
    );
  });
  const [remainingPoints, setRemainingPoints] = useState(
    props.client.authenticatedPlayer?.remainingProficiencyPoints || 0,
  );

  const handleIncrement = (key: ProficiencyKey) => {
    if (!props.client.authenticatedPlayer || remainingPoints === 0) return;
    setPoints((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
    setRemainingPoints((prev) => prev - 1);
    setIsChanged(true);
  };

  const handleDecrement = (key: ProficiencyKey) => {
    if (!props.client.authenticatedPlayer) return;
    if (
      points[key] <=
      (props.client.authenticatedPlayer?.proficiencyPoints[key] || 0)
    ) {
      return;
    }
    setPoints((prev) => ({
      ...prev,
      [key]: prev[key] - 1,
    }));
    setRemainingPoints((prev) => prev + 1);
    setIsChanged(true);
  };

  const handleReset = () => {
    if (!props.client.authenticatedPlayer) return;
    setPoints(props.client.authenticatedPlayer.proficiencyPoints);
    setRemainingPoints(
      props.client.authenticatedPlayer.remainingProficiencyPoints,
    );
    setIsChanged(false);
  };

  const handleSave = async () => {
    if (!props.client.authenticatedPlayer) return;
    setIsSaving(true);
    try {
      // await props.client.updateProficiencyPoints(props.client.authenticatedPlayer.id, points);
      await props.client.http.post('/proficiency-points', {
        playerID: props.client.authenticatedPlayer.id,
        points: points,
      });
      setIsChanged(false);
      if (props.client.authenticatedPlayer) {
        props.client.authenticatedPlayer.proficiencyPoints = points;
      }
    } catch (error) {
      console.error('Failed to save proficiency points:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    function setPoint() {
      if (!props.client.authenticatedPlayer) return null;
      setPoints(props.client.authenticatedPlayer.proficiencyPoints);
    }
    if (!points) setPoint();
  });

  if (!props.client.authenticatedPlayer) return null;

  return (
    <div>
      <div className="my-12 flex flex-col gap-12">
        <h2 className="text-2xl font-semibold text-zinc-200 text-center">
          Proficiency Points <br />
          <span className="text-xl">Remaining Points: {remainingPoints}</span>
        </h2>
        <dl className="mx-auto grid grid-cols-1 gap-px bg-zinc-900/5 sm:grid-cols-2 md:grid-cols-5 rounded-xl overflow-hidden">
          {Object.entries(points).map(([key, value]) => {
            const originalValue =
              props.client.authenticatedPlayer?.proficiencyPoints[
                key as ProficiencyKey
              ] || 0;
            const hasChanged = value !== originalValue;
            return (
              <div
                key={key}
                className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-zinc-800 px-4 py-8 sm:px-6 xl:px-8 ${
                  hasChanged ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                <dt className="text-lg font-medium leading-6 text-zinc-300 capitalize">
                  {key}
                </dt>
                <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-200 flex justify-between items-center">
                  {value}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecrement(key as ProficiencyKey)}
                      disabled={value <= originalValue}
                      className="px-3 py-1 text-sm bg-zinc-700 rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleIncrement(key as ProficiencyKey)}
                      disabled={remainingPoints === 0}
                      className="px-3 py-1 text-sm bg-zinc-700 rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +1
                    </button>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
        {isChanged && (
          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-500"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
