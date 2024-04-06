import DarkThroneClient from '@darkthrone/client-library';
import { Button } from '@darkthrone/react-components';
import SubNavigation from '../../../../components/layout/subNavigation';
import { useEffect, useState } from 'react';
// import BankNavigation from './components/bankNavigation';

interface BankDepositPageProps {
  client: DarkThroneClient;
}
export default function BankDepositPage(props: BankDepositPageProps) {
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [maxDepositAmount, setMaxDepositAmount] = useState<number>(0);

  useEffect(() => {
    const maxDeposit = Math.floor(
      props.client.authenticatedPlayer?.gold || 0 * 0.8,
    );
    setMaxDepositAmount(maxDeposit);
  }, [props.client.authenticatedPlayer?.gold]);

  async function handleDeposit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const depositRequest = await props.client.banking.deposit(depositAmount);

    if (depositRequest.status === 'fail') {
      console.error(depositRequest.data);
      return;
    }

    setDepositAmount(0);
  }

  if (!props.client.authenticatedPlayer) return null;

  return (
    <main>
      <SubNavigation />

      <div className="my-12 w-full max-w-2xl mx-auto rounded-md overflow-hidden">
        {/* <BankNavigation /> */}

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
          {/* {invalidMessages.length > 0 ? (
            <Alert messages={invalidMessages} type={'error'} />
          ) : null} */}
          <div className="flex justify-between items-center text-zinc-400">
            <div>
              Deposits Remaining:{' '}
              <span className="text-lg font-semibold text-white">3</span>
            </div>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
              // onFocus={() => setInvalidMessages([])}
              className="rounded-md border-0 py-1.5 bg-zinc-700 text-zinc-200 ring-1 ring-inset ring-zinc-500 focus:ring-2 focus:ring-inset focus:ring-yellow-600 invalid:ring-red-600 sm:text-sm sm:leading-6"
              min={0}
              max={maxDepositAmount}
            />
          </div>
          <div className="flex justify-between items-end">
            <p className="text-sm text-zinc-300/50">
              You may deposit up to 80% of your gold at one time.
            </p>
            <div>
              <Button text={'Deposit'} type="submit" />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
