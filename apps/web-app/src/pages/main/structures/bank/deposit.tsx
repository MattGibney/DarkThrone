import DarkThroneClient from '@darkthrone/client-library';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@darkthrone/shadcnui/alert';
import { Input } from '@darkthrone/shadcnui/input';
import { Button } from '@darkthrone/shadcnui/button';
import { useEffect, useRef, useState } from 'react';
import BankNavigation from './components/bankNavigation';
import {
  ExtractErrorCodesForStatuses,
  POST_deposit,
} from '@darkthrone/interfaces';
import { AlertCircleIcon } from 'lucide-react';

// TODO: Make dynamic based on structure upgrades
const MAX_DEPOSITS = 3;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

type PossibleErrorCodes = ExtractErrorCodesForStatuses<POST_deposit, 400 | 500>;

interface BankDepositPageProps {
  client: DarkThroneClient;
}
export default function BankDepositPage(props: BankDepositPageProps) {
  const errorTranslations: Record<PossibleErrorCodes, string> = {
    'banking.deposit.negativeAmount':
      'You must deposit a positive amount of gold.',
    'banking.deposit.exceedsMaxDeposit':
      'You may only deposit up to 80% of your gold at one time.',
    'banking.deposit.maxDepositsReached':
      'You have reached the maximum deposits allowed.',
    'server.error': 'An unexpected server error occurred. Please try again.',
    'banking.deposit.invalidAmount': 'The deposit amount is invalid.',
  };

  const [inputAmount, setInputAmount] = useState<number>(0);
  const [depositsRemaining, setDepositsRemaining] =
    useState<number>(MAX_DEPOSITS);
  const [nextDepositAt, setNextDepositAt] = useState<Date | null>(null);
  const [timeUntilNextDeposit, setTimeUntilNextDeposit] = useState<
    string | null
  >(null);
  const hasTriggeredRefreshRef = useRef(false);

  const [errorMessages, setErrorMessages] = useState<PossibleErrorCodes[]>([]);

  useEffect(() => {
    const player = props.client.authenticatedPlayer;
    if (!player) return;

    const now = Date.now();
    const recentDeposits = player.depositHistory
      .filter((history) => history.type === 'deposit')
      .map((history) => new Date(history.date))
      .filter((date) => !Number.isNaN(date.getTime()))
      .filter((date) => now - date.getTime() < DAY_IN_MS)
      .sort((a, b) => a.getTime() - b.getTime());

    const remaining = Math.max(0, MAX_DEPOSITS - recentDeposits.length);
    setDepositsRemaining(remaining);

    if (remaining < 1 && recentDeposits.length > 0) {
      setNextDepositAt(new Date(recentDeposits[0].getTime() + DAY_IN_MS));
    } else {
      setNextDepositAt(null);
      hasTriggeredRefreshRef.current = false;
    }
  }, [props.client.authenticatedPlayer]);

  useEffect(() => {
    if (!nextDepositAt) {
      setTimeUntilNextDeposit(null);
      return;
    }

    const updateCountdown = () => {
      const remainingMs = nextDepositAt.getTime() - Date.now();
      if (remainingMs <= 0) {
        setTimeUntilNextDeposit('00:00:00');
        if (!hasTriggeredRefreshRef.current) {
          hasTriggeredRefreshRef.current = true;
          props.client.emit('playerUpdate');
        }
        return;
      }

      const totalSeconds = Math.floor(remainingMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeUntilNextDeposit(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      );
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [nextDepositAt]);

  async function handleDeposit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    deposit(inputAmount);
  }

  function handleDepositMax() {
    const playerGold = props.client.authenticatedPlayer?.gold;
    if (!playerGold) return;

    const maxDeposit = Math.floor(playerGold * 0.8);
    deposit(maxDeposit);
  }

  async function deposit(amount: number) {
    const playerGold = props.client.authenticatedPlayer?.gold;
    if (!playerGold) return;

    if (depositsRemaining < 1) {
      setErrorMessages(['banking.deposit.maxDepositsReached']);
      return;
    }

    const maxDeposit = Math.floor(playerGold * 0.8);
    if (amount < 1) {
      setErrorMessages(['banking.deposit.negativeAmount']);
      return;
    }
    if (amount > maxDeposit) {
      setErrorMessages(['banking.deposit.exceedsMaxDeposit']);
      return;
    }

    try {
      setErrorMessages([]);
      await props.client.banking.deposit(amount);

      setInputAmount(0);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: unknown }).errors)
      ) {
        setErrorMessages(
          (error as { errors?: PossibleErrorCodes[] })
            .errors as PossibleErrorCodes[],
        );
      } else {
        setErrorMessages(['server.error']);
      }
    }
  }

  if (!props.client.authenticatedPlayer) return null;

  return (
    <main>
      <div className="my-12 w-full max-w-2xl mx-auto">
        <BankNavigation />

        <div className="rounded-lg overflow-hidden">
          <div className="bg-card p-8 flex justify-around text-card-foreground">
            <div className="flex flex-col items-center">
              <div className="text-primary text-2xl font-bold">
                {new Intl.NumberFormat().format(
                  props.client.authenticatedPlayer.gold,
                )}
              </div>
              <p>Gold on Hand</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-primary text-2xl font-bold">
                {new Intl.NumberFormat().format(
                  props.client.authenticatedPlayer.goldInBank,
                )}
              </div>
              <p>Gold in Bank</p>
            </div>
          </div>
          <form
            className="flex flex-col gap-y-6 bg-muted p-8"
            onSubmit={handleDeposit}
          >
            {errorMessages.length > 0 ? (
              <Alert variant="destructive" className="text-sm [&>svg]:size-4">
                <AlertCircleIcon />
                <AlertTitle>There was a problem</AlertTitle>
                <AlertDescription>
                  <ul className="list-inside list-disc text-sm">
                    {errorMessages.map((code) => (
                      <li key={code}>{errorTranslations[code]}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-col sm:flex-row gap-y-2 justify-between items-center text-muted-foreground">
              <div>
                Deposits Remaining:{' '}
                <span className="text-lg font-semibold text-foreground">
                  {depositsRemaining}
                </span>
                {depositsRemaining < 1 && timeUntilNextDeposit ? (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Next deposit available in {timeUntilNextDeposit}
                  </div>
                ) : null}
              </div>
              <Input
                type="number"
                value={inputAmount.toString()}
                className="w-32"
                onChange={(e) => setInputAmount(parseInt(e.target.value) || 0)}
                onFocus={() => setErrorMessages([])}
              />
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex justify-end gap-x-4">
                <Button
                  variant="outline"
                  type="button"
                  size={'lg'}
                  onClick={handleDepositMax}
                >
                  Deposit Max
                </Button>
                <Button type="submit" size={'lg'}>
                  Deposit
                </Button>
              </div>
              <p className="text-sm text-muted-foreground/80">
                You may deposit up to 80% of your gold at one time.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
