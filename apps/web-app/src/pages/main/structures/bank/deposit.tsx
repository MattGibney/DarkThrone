import DarkThroneClient from '@darkthrone/client-library';
import { Alert, Button, InputField } from '@darkthrone/react-components';
import SubNavigation from '../../../../components/layout/subNavigation';
import { useEffect, useState } from 'react';
import BankNavigation from './components/bankNavigation';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

// TODO: Make dynamic based on structure upgrades
const MAX_DEPOSITS = 3;

interface BankDepositPageProps {
  client: DarkThroneClient;
}
export default function BankDepositPage(props: BankDepositPageProps) {
  const [inputAmount, setInputAmount] = useState<number>(0);
  // const [maxDepositAmount, setMaxDepositAmount] = useState<number>(0);
  const [depositsRemaining, setDepositsRemaining] =
    useState<number>(MAX_DEPOSITS);

  const [invalidMessages, setInvalidMessages] = useState<string[]>([]);

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
      setInvalidMessages([t('errors.depositLimitReached', { ns: 'bank' })]);
      return;
    }

    const maxDeposit = Math.floor(playerGold * 0.8);
    if (amount < 1) {
      setInvalidMessages([t('errors.minDeposit', { ns: 'bank' })]);
      return;
    }
    if (amount > maxDeposit) {
      setInvalidMessages([
        t('errors.maxDeposit', { ns: 'bank' }),
        t('errors.maxDepositAmount', {
          ns: 'bank',
          max: maxDeposit,
        }),
      ]);
      return;
    }

    const depositRequest = await props.client.banking.deposit(amount);

    if (depositRequest.status === 'fail') {
      console.error(depositRequest.data);
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
            <p>
              <Trans i18nKey="goldOnHand" ns="bank" />
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-yellow-500 text-2xl font-bold">
              {new Intl.NumberFormat().format(
                props.client.authenticatedPlayer.goldInBank,
              )}
            </div>
            <p>
              <Trans i18nKey="goldInBank" ns="bank" />
            </p>
          </div>
        </div>
        <form
          className="flex flex-col gap-y-6 bg-zinc-800 p-8"
          onSubmit={handleDeposit}
        >
          {invalidMessages.length > 0 ? (
            <Alert messages={invalidMessages} type={'error'} />
          ) : null}
          <div className="flex flex-col sm:flex-row gap-y-2 justify-between items-center text-zinc-400">
            <div>
              <Trans i18nKey="depositsRemaining" ns="bank" />:{' '}
              <span className="text-lg font-semibold text-white">
                {depositsRemaining}
              </span>
            </div>
            <InputField
              type="number"
              value={inputAmount.toString()}
              setValue={(value) => setInputAmount(parseInt(value) || 0)}
              onFocus={() => setInvalidMessages([])}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <div className="flex gap-x-4">
              <Button
                text={t('depositMax', { ns: 'bank' })}
                variant="primary-outline"
                type="button"
                onClick={handleDepositMax}
              />
              <Button text={t('deposit', { ns: 'bank' })} type="submit" />
            </div>
            <p className="text-sm text-zinc-300/50">
              <Trans i18nKey="bankHelp" ns="bank" />
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
