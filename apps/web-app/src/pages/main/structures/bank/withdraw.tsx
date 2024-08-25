import DarkThroneClient from '@darkthrone/client-library';
import { Alert, Button, InputField } from '@darkthrone/react-components';
import SubNavigation from '../../../../components/layout/subNavigation';
import { useState } from 'react';
import BankNavigation from './components/bankNavigation';

interface BankWithdrawPageProps {
  client: DarkThroneClient;
}
export default function BankWithdrawPage(props: BankWithdrawPageProps) {
  const [inputAmount, setInputAmount] = useState<number>(0);

  const [invalidMessages, setInvalidMessages] = useState<string[]>([]);

  async function handleWithdraw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const playerGoldInBank = props.client.authenticatedPlayer?.goldInBank;
    if (!playerGoldInBank) return;

    if (playerGoldInBank < 1) {
      setInvalidMessages(['You do not have any gold in the bank to withdraw.']);
      return;
    }

    if (inputAmount > playerGoldInBank) {
      setInvalidMessages([
        'You cannot withdraw more gold than you have in the bank',
      ]);
      return;
    }

    const withdrawRequest = await props.client.banking.withdraw(inputAmount);

    if (withdrawRequest.status === 'fail') {
      console.error(withdrawRequest.data);
      return;
    }

    setInputAmount(0);
  }

  if (!props.client.authenticatedPlayer) return null;

  return (
    <main>
      <SubNavigation />

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
          {invalidMessages.length > 0 ? (
            <Alert messages={invalidMessages} type={'error'} />
          ) : null}
          <div className="flex justify-end items-center text-zinc-400">
            <InputField
              type="number"
              value={inputAmount.toString()}
              setValue={(value) => setInputAmount(parseInt(value) || 0)}
              onFocus={() => setInvalidMessages([])}
            />
            {/* <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(parseInt(e.target.value) || 0)}
              onFocus={() => setInvalidMessages([])}
              className="rounded-md border-0 py-1.5 bg-zinc-700 text-zinc-200 ring-1 ring-inset ring-zinc-500 focus:ring-2 focus:ring-inset focus:ring-yellow-600 invalid:ring-red-600 sm:text-sm sm:leading-6 min-w-48"
              min={0}
              max={props.client.authenticatedPlayer.goldInBank}
            /> */}
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
