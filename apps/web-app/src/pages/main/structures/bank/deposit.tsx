import DarkThroneClient from '@darkthrone/client-library';
import { Alert, Button, InputField } from '@darkthrone/react-components';
import { useEffect, useState } from 'react';
import BankNavigation from './components/bankNavigation';
import {
  ExtractErrorCodesForStatuses,
  POST_deposit,
} from '@darkthrone/interfaces';

// TODO: Make dynamic based on structure upgrades
const MAX_DEPOSITS = 3;

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
  };

  const [inputAmount, setInputAmount] = useState<number>(0);
  const [depositsRemaining, setDepositsRemaining] =
    useState<number>(MAX_DEPOSITS);

  const [errorMessages, setErrorMessages] = useState<PossibleErrorCodes[]>([]);

  useEffect(() => {
    const player = props.client.authenticatedPlayer;
    if (!player) return;

    const depositsMade = player.depositHistory.filter(
      (history) => history.type === 'deposit',
    ).length;
    setDepositsRemaining(MAX_DEPOSITS - depositsMade);
  }, [props.client.authenticatedPlayer]);

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
      <div className="my-12 w-full max-w-2xl mx-auto rounded-md overflow-hidden">
        <BankNavigation />

        <div className="bg-zinc-800/50 p-8 flex justify-around text-zinc-300">
          <div className="flex flex-col items-center">
            <div className="text-yellow-500 text-2xl font-bold">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.gold,
              )}
            </div>
            <p>Gold on Hand</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-yellow-500 text-2xl font-bold">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.goldInBank,
              )}
            </div>
            <p>Gold in Bank</p>
          </div>
        </div>
        <form
          className="flex flex-col gap-y-6 bg-zinc-800 p-8"
          onSubmit={handleDeposit}
        >
          {errorMessages.length > 0 ? (
            <Alert
              messages={errorMessages.map((err) => errorTranslations[err])}
              type={'error'}
            />
          ) : null}
          <div className="flex flex-col sm:flex-row gap-y-2 justify-between items-center text-zinc-400">
            <div>
              Deposits Remaining:{' '}
              <span className="text-lg font-semibold text-white">
                {depositsRemaining}
              </span>
            </div>
            <InputField
              type="number"
              value={inputAmount.toString()}
              setValue={(value) => setInputAmount(parseInt(value) || 0)}
              onFocus={() => setErrorMessages([])}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <div className="flex gap-x-4">
              <Button
                text={'Deposit Max'}
                variant="primary-outline"
                type="button"
                onClick={handleDepositMax}
              />
              <Button text={'Deposit'} type="submit" />
            </div>
            <p className="text-sm text-zinc-300/50">
              You may deposit up to 80% of your gold at one time.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
