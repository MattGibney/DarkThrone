import DarkThroneClient from '@darkthrone/client-library';
import { Logo } from '@darkthrone/react-components';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@darkthrone/shadcnui/alert';
import { Input } from '@darkthrone/shadcnui/input';
import { Button } from '@darkthrone/shadcnui/button';
import { useState } from 'react';
import RaceCard, { RaceCardProps } from './components/raceCard';
import ClassCard, { ClassCardProps } from './components/classCard';
import { useNavigate } from 'react-router-dom';
import {
  ExtractErrorCodesForStatuses,
  PlayerClass,
  PlayerNameValidation,
  PlayerRace,
  POST_createPlayer,
  POST_validatePlayerName,
} from '@darkthrone/interfaces';
import { Field, FieldError, FieldLabel } from '@darkthrone/shadcnui/field';
import { Label } from '@darkthrone/shadcnui/label';
import { AlertCircleIcon, ArrowLeft } from 'lucide-react';

type PlayerNameValidationErrorCode = ExtractErrorCodesForStatuses<
  POST_validatePlayerName,
  400
>;
type PossibleErrorCodes =
  | ExtractErrorCodesForStatuses<POST_validatePlayerName, 400 | 500>
  | ExtractErrorCodesForStatuses<POST_createPlayer, 400 | 500>;

interface PlayerNameStatus extends PlayerNameValidation {
  validatedName: string;
}

function isAPIError(error: unknown): error is { errors: PossibleErrorCodes[] } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as { errors?: unknown }).errors)
  );
}

function isPlayerNameValidationError(
  errorCode: PossibleErrorCodes,
): errorCode is PlayerNameValidationErrorCode {
  return errorCode.startsWith('player.name.validation.');
}

interface CreatePlayerPageProps {
  client: DarkThroneClient;
}
export default function CreatePlayerPage(props: CreatePlayerPageProps) {
  const navigate = useNavigate();

  const errorTranslations: Record<PossibleErrorCodes, string> = {
    'player.name.validation.empty': 'Player name cannot be empty',
    'player.name.validation.taken': 'This name is already taken.',
    'player.name.validation.invalidCharacters':
      'Player name must only contain letters, numbers and underscores',
    'player.name.validation.tooShort':
      'Player name must be at least 3 characters long',
    'player.name.validation.tooLong':
      'Player name cannot be longer than 20 characters',
    'server.error': 'An unexpected server error occurred. Please try again.',
  };

  const [playerName, setPlayerName] = useState<string>('');
  const [playerNameStatus, setPlayerNameStatus] = useState<
    PlayerNameStatus | undefined
  >();
  const [formErrorMessages, setFormErrorMessages] = useState<
    PossibleErrorCodes[]
  >([]);

  const [selectedRace, setSelectedRace] = useState<PlayerRace | undefined>(
    undefined,
  );
  const [selectedClass, setSelectedClass] = useState<PlayerClass | undefined>(
    undefined,
  );

  const currentPlayerNameStatus =
    playerNameStatus?.validatedName === playerName
      ? playerNameStatus
      : undefined;
  const isFormValid =
    currentPlayerNameStatus?.isValid === true &&
    selectedRace !== undefined &&
    selectedClass !== undefined;

  async function validatePlayerName(nameToValidate: string) {
    setFormErrorMessages([]);

    if (nameToValidate.length === 0) {
      setPlayerNameStatus({
        validatedName: nameToValidate,
        isValid: false,
        issues: ['player.name.validation.empty'],
      });
      return;
    }

    try {
      const response =
        await props.client.players.validatePlayerName(nameToValidate);

      setPlayerNameStatus({
        validatedName: nameToValidate,
        isValid: response.isValid,
        issues: response.issues,
      });
    } catch (error) {
      const errorMessages: PossibleErrorCodes[] = isAPIError(error)
        ? error.errors
        : ['server.error'];

      setPlayerNameStatus({
        validatedName: nameToValidate,
        isValid: false,
        issues: errorMessages.filter(isPlayerNameValidationError),
      });

      setFormErrorMessages(
        errorMessages.filter(
          (message) => !isPlayerNameValidationError(message),
        ),
      );
    }
  }

  const raceOptions: RaceCardProps[] = [
    {
      name: 'Human',
      bonusText: '+5% Offence bonus',
      icon: () => (
        <svg
          className="fill-sky-400"
          xmlns="http://www.w3.org/2000/svg"
          height="3rem"
          viewBox="0 0 512 512"
        >
          <path d="M237.5 508.32A48 48 0 0 0 256 512V224H25.63C55.11 370.52 148.77 471.34 237.5 508.32zm229-424.64l-192-80A57.34 57.34 0 0 0 256.06 0H256v224h230.5a491.56 491.56 0 0 0 9.5-96 48 48 0 0 0-29.5-44.32z" />
          <path
            style={{ opacity: 0.4 }}
            d="M256 224v288a48.12 48.12 0 0 0 18.41-3.68c72.34-30.14 180.16-123 212.09-284.29zM237.59 3.67l-192 80A47.92 47.92 0 0 0 16 128a485.36 485.36 0 0 0 9.63 96H256V0a57.58 57.58 0 0 0-18.41 3.67z"
          />
        </svg>
      ),
      race: 'human',
    },
    {
      name: 'Elves',
      bonusText: '+5% Defence bonus',
      icon: () => (
        <svg
          className="fill-emerald-400"
          xmlns="http://www.w3.org/2000/svg"
          height="3rem"
          viewBox="0 0 576 512"
        >
          <path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z" />
        </svg>
      ),
      race: 'elf',
    },
    {
      name: 'Goblins',
      bonusText: '+5% Defence bonus',
      icon: () => (
        <svg
          className="fill-red-400"
          xmlns="http://www.w3.org/2000/svg"
          height="3rem"
          viewBox="0 0 384 512"
        >
          <path d="M346.74 32.44L224 52.9V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v36.9L37.26 32.44C17.76 29.19 0 44.23 0 64.01v191.98c0 19.77 17.76 34.81 37.26 31.56L192 261.77l154.74 25.79C366.25 290.81 384 275.77 384 256V64.01c0-19.78-17.76-34.82-37.26-31.57zM160 299.54V496c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V299.54l-32-5.33-32 5.33z" />
        </svg>
      ),
      race: 'goblin',
    },
    {
      name: 'Undead',
      bonusText: '+5% Offence bonus',
      icon: () => (
        <svg
          className="fill-zinc-400"
          xmlns="http://www.w3.org/2000/svg"
          height="3rem"
          viewBox="0 0 512 512"
        >
          <path d="M256 0C114.6 0 0 100.3 0 224c0 70.1 36.9 132.6 94.5 173.7 9.6 6.9 15.2 18.1 13.5 29.9l-9.4 66.2c-1.4 9.6 6 18.2 15.7 18.2H192v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h64v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h77.7c9.7 0 17.1-8.6 15.7-18.2l-9.4-66.2c-1.7-11.7 3.8-23 13.5-29.9C475.1 356.6 512 294.1 512 224 512 100.3 397.4 0 256 0zm-96 320c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm192 0c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z" />
        </svg>
      ),
      race: 'undead',
    },
  ];

  const classOptions: ClassCardProps[] = [
    {
      name: 'Fighter',
      class: 'fighter',
      bonusText: '+5% Offence bonus',
    },
    {
      name: 'Cleric',
      class: 'cleric',
      bonusText: '+5% Defence bonus',
    },
    {
      name: 'Thief',
      class: 'thief',
      bonusText: '+5% Income bonus',
    },
    {
      name: 'Assassin',
      class: 'assassin',
      bonusText: '+5% Intelligence bonus (spy defence and offence)',
    },
  ];

  async function handleCreatePlayer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !playerName ||
      !selectedRace ||
      !selectedClass ||
      currentPlayerNameStatus?.isValid !== true
    ) {
      return;
    }

    try {
      setFormErrorMessages([]);
      const createdPlayer = await props.client.players.create(
        playerName,
        selectedRace,
        selectedClass,
      );
      try {
        await props.client.auth.assumePlayer(createdPlayer.id);
        navigate('/overview');
      } catch {
        navigate('/player-select');
      }
    } catch (error) {
      const errorMessages: PossibleErrorCodes[] = isAPIError(error)
        ? error.errors
        : ['server.error'];
      const validationMessages = errorMessages.filter(
        isPlayerNameValidationError,
      );

      if (validationMessages.length > 0) {
        setPlayerNameStatus({
          validatedName: playerName,
          isValid: false,
          issues: validationMessages,
        });
      }

      setFormErrorMessages(
        errorMessages.filter(
          (message) => !isPlayerNameValidationError(message),
        ),
      );
    }
  }

  function handleCancel() {
    navigate('/player-select');
  }

  return (
    <main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center">
          <Logo variant="large" />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-120 mb-3">
        <Button
          type="button"
          variant={'ghost'}
          size={'sm'}
          onClick={handleCancel}
        >
          <ArrowLeft /> Back to Player Selection
        </Button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-120">
        <div className="bg-muted sm:rounded-lg px-6 py-12 sm:px-12">
          <form className="space-y-12" onSubmit={handleCreatePlayer}>
            {formErrorMessages.length > 0 ? (
              <Alert variant="destructive" className="text-sm [&>svg]:size-4">
                <AlertCircleIcon />
                <AlertTitle>There was a problem</AlertTitle>
                <AlertDescription>
                  <ul className="list-inside list-disc text-sm">
                    {formErrorMessages.map((code) => (
                      <li key={code}>{errorTranslations[code]}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}

            <Field
              data-invalid={
                currentPlayerNameStatus
                  ? !currentPlayerNameStatus.isValid
                  : undefined
              }
            >
              <FieldLabel htmlFor="playerName">Player Name</FieldLabel>
              <Input
                id="playerName"
                type="text"
                required
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setFormErrorMessages([]);
                }}
                onBlur={() => validatePlayerName(playerName)}
                aria-invalid={
                  currentPlayerNameStatus
                    ? !currentPlayerNameStatus.isValid
                    : undefined
                }
              />
              {currentPlayerNameStatus && !currentPlayerNameStatus.isValid ? (
                <FieldError>
                  {currentPlayerNameStatus.issues
                    .map((err) => errorTranslations[err])
                    .join(', ')}
                </FieldError>
              ) : null}
            </Field>

            <section className="space-y-2">
              <Label>Race</Label>
              <div className="grid grid-cols-2 gap-3">
                {raceOptions.map((option, optionIdx) => (
                  <button
                    type="button"
                    key={optionIdx}
                    onClick={() => setSelectedRace(option.race)}
                  >
                    <RaceCard
                      {...option}
                      selectedRace={
                        option.race === selectedRace ? selectedRace : undefined
                      }
                    />
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <Label>Class</Label>
              <div className="flex flex-col gap-3">
                {classOptions.map((option, optionIdx) => (
                  <button
                    type="button"
                    key={optionIdx}
                    onClick={() => setSelectedClass(option.class)}
                  >
                    <ClassCard
                      {...option}
                      isSelected={option.class === selectedClass}
                    />
                  </button>
                ))}
              </div>
            </section>

            <Button
              variant="default"
              type="submit"
              className="w-full py-6"
              disabled={!isFormValid}
            >
              Create Player
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
