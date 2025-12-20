import { useState } from 'react';
import DarkThroneClient from '@darkthrone/client-library';
import BankNavigation from './components/bankNavigation';
import {
  ExtractErrorCodesForStatuses,
  POST_withdraw,
} from '@darkthrone/interfaces';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@darkthrone/shadcnui/alert';
import { Input } from '@darkthrone/shadcnui/input';
import { Button } from '@darkthrone/shadcnui/button';
import { AlertCircleIcon } from 'lucide-react';

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
            onSubmit={handleWithdraw}
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
            <div className="flex justify-end items-center text-muted-foreground">
              <Input
                type="number"
                value={inputAmount.toString()}
                className="w-32"
                onChange={(e) => setInputAmount(parseInt(e.target.value) || 0)}
                onFocus={() => setErrorMessages([])}
              />
            </div>
            <div className="flex justify-end items-end">
              <div className="flex gap-x-4">
                <Button type="submit" size={'lg'}>
                  Withdraw
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
