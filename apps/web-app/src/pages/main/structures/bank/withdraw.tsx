import DarkThroneClient from '@darkthrone/client-library';
import { Alert, Button, InputField } from '@darkthrone/react-components';
import { useState } from 'react';
import BankNavigation from './components/bankNavigation';
import {
  ExtractErrorCodesForStatuses,
  POST_withdraw,
} from '@darkthrone/interfaces';

type PossibleErrorCodes = ExtractErrorCodesForStatuses<
  POST_withdraw,
  400 | 500
>;

interface BankWithdrawPageProps {
  client: DarkThroneClient;
}
export default function BankWithdrawPage(props: BankWithdrawPageProps) {
  const errorTranslations: Record<PossibleErrorCodes, string> = {
    'banking.withdraw.negativeAmount':
      'You must withdraw a positive amount of gold.',
    'banking.withdraw.insufficientFunds':
      'You do not have enough gold in the bank to complete this withdrawal.',
    'server.error': 'An unexpected server error occurred. Please try again.',
  };

  const [inputAmount, setInputAmount] = useState<number>(0);
  const [errorMessages, setErrorMessages] = useState<PossibleErrorCodes[]>([]);

  async function handleWithdraw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const playerGoldInBank = props.client.authenticatedPlayer?.goldInBank;
    if (!playerGoldInBank) return;

    if (playerGoldInBank < 1 || inputAmount > playerGoldInBank) {
      setErrorMessages(['banking.withdraw.insufficientFunds']);
      return;
    }

    try {
      setErrorMessages([]);
      await props.client.banking.withdraw(inputAmount);

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
          onSubmit={handleWithdraw}
        >
          {errorMessages.length > 0 ? (
            <Alert
              messages={errorMessages.map((err) => errorTranslations[err])}
              type={'error'}
            />
          ) : null}
          <div className="flex justify-end items-center text-zinc-400">
            <InputField
              type="number"
              value={inputAmount.toString()}
              setValue={(value) => setInputAmount(parseInt(value) || 0)}
              onFocus={() => setErrorMessages([])}
            />
          </div>
          <div className="flex justify-end items-end">
            <div className="flex gap-x-4">
              <Button text={'Withdraw'} type="submit" />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
