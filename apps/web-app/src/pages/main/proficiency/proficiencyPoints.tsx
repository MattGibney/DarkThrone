import DarkThroneClient from '@darkthrone/client-library';
import { Alert, Button } from '@darkthrone/react-components';
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
const proficiencyMap: Record<ProficiencyKey, string> = {
  strength: 'Offense',
  constitution: 'Defense',
  wealth: 'Income',
  dexterity: 'Spy & Sentry',
  charisma: 'Reduced Prices',
};
export default function ProficiencyPage(props: ProficiencyPointsProps) {
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pointsPending, setPointsPending] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState(
    props.client.authenticatedPlayer?.remainingProficiencyPoints || 0,
  );
  const [invalidMessages, setInvalidMessages] = useState<string[]>([]);
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

  const handleIncrement = (key: ProficiencyKey) => {
    if (!props.client.authenticatedPlayer || remainingPoints === 0) return;
    setPoints((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
    setRemainingPoints((prev) => prev - 1);
    setPointsPending((prev) => prev + 1);
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
    setPointsPending((prev) => prev - 1);
    // Have to subtract 1 from pointsPending, as it seems the setPointsPending function doesn't change the value immediately
    if (pointsPending - 1 === 0) {
      setIsChanged(false);
    }
  };

  const handleReset = () => {
    if (!props.client.authenticatedPlayer) return;
    setPoints(props.client.authenticatedPlayer.proficiencyPoints);
    setRemainingPoints(
      props.client.authenticatedPlayer.remainingProficiencyPoints,
    );
    setIsChanged(false);
    setPointsPending(0);
    setIsSaving(false);
  };

  const handleSave = async () => {
    if (!props.client.authenticatedPlayer) return;
    setIsSaving(true);
    const pointsToAdd = Object.keys(points).reduce(
      (acc, key) => {
        acc[key as ProficiencyKey] =
          points[key as ProficiencyKey] -
          (props.client.authenticatedPlayer?.proficiencyPoints[
            key as ProficiencyKey
          ] || 0);
        return acc;
      },
      {} as Record<ProficiencyKey, number>,
    );
    if (Object.values(pointsToAdd).every((value) => value <= 0)) {
      setInvalidMessages(['No points to save.']);
      setIsSaving(false);
      return;
    }
    if (Object.values(pointsToAdd).some((value) => value > remainingPoints)) {
      setInvalidMessages(['You do not have enough remaining points to save.']);
      setIsSaving(false);
      return;
    }
    await props.client.http
      .post('/proficiency-points', {
        points: pointsToAdd,
      })
      .then(() => {
        setIsChanged(false);
        setIsSaving(false);
        setPointsPending(0);
        if (props.client.authenticatedPlayer) {
          props.client.authenticatedPlayer.proficiencyPoints = points;
          setPoints(props.client.authenticatedPlayer.proficiencyPoints);
        }
      })
      .catch((res) => {
        const errorTitles = res.response.data.errors.map(
          (error: { title: string }) => error.title,
        );
        setInvalidMessages(errorTitles);
        handleReset();
      });
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
    <main>
      <div className="my-12 w-full max-w-6xl mx-auto rounded-md overflow-hidden">
        {invalidMessages.length > 0 ? (
          <Alert messages={invalidMessages} type={'error'} />
        ) : null}
        <div className="bg-zinc-800/50 p-8 flex justify-around text-zinc-300">
          <div className="flex flex-col items-center">
            <div className="text-yellow-500 text-2xl font-bold">
              {new Intl.NumberFormat().format(remainingPoints)}
            </div>
            <p>Remaining Points</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-yellow-500 text-2xl font-bold">
              {new Intl.NumberFormat().format(pointsPending)}
            </div>
            <p>Points Pending</p>
          </div>
        </div>
        <dl className="mx-auto grid grid-cols-1 gap-px bg-zinc-900/5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-xl overflow-hidden">
          {Object.entries(points).map(([key, value]) => {
            const originalValue =
              props.client.authenticatedPlayer?.proficiencyPoints[
                key as ProficiencyKey
              ];
            const hasChanged = originalValue !== value;
            return (
              <div
                key={key}
                className={`flex flex-col gap-y-6 bg-zinc-800 px-4 py-8 sm:px-6 xl:px-8 ${
                  hasChanged ? 'ring-1 ring-inset ring-yellow-600' : ''
                }`}
              >
                <dt className="flex flex-col font-medium text-zinc-300 items-center text-center w-full">
                  <span className="flex flex-row text-lg capitalize">
                    {key}
                  </span>
                  <span className="flex flex-row text-sm capitalize">
                    ({proficiencyMap[key as ProficiencyKey]})
                  </span>
                </dt>
                <dd className="flex flex-col gap-y-4 w-full items-center">
                  <div className="flex flex-row text-lg gap-y-4 text-center">
                    Bonus
                  </div>
                  <div className="flex flex-row text-2xl gap-y-4 text-center">
                    {value} %
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button
                      text={'-1'}
                      onClick={() => handleDecrement(key as ProficiencyKey)}
                      isDisabled={!hasChanged}
                      variant={hasChanged ? 'primary-outline' : 'secondary'}
                    />
                    <Button
                      text={'+1'}
                      onClick={() => handleIncrement(key as ProficiencyKey)}
                      isDisabled={remainingPoints === 0}
                    />
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
        {isChanged && (
          <div className="flex justify-end items-center gap-x-4 mt-8">
            <Button
              text={'Reset'}
              type="reset"
              onClick={handleReset}
              variant="secondary"
            />
            <Button
              text={isSaving ? 'Saving...' : 'Save Changes'}
              type="button"
              onClick={handleSave}
              variant={isSaving ? 'primary-outline' : 'primary'}
              isDisabled={isSaving}
            />
          </div>
        )}
      </div>
    </main>
  );
}
