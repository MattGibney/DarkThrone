import DarkThroneClient from '@darkthrone/client-library';
import SubNavigation from '../../../../components/layout/subNavigation';
import BankNavigation from './components/bankNavigation';

interface BankDepositPageProps {
  client: DarkThroneClient;
}
export default function BankHistoryPage(props: BankDepositPageProps) {
  if (!props.client.authenticatedPlayer) return null;

  return (
    <main>
      <SubNavigation />

      <div className="my-12 w-full max-w-2xl mx-auto rounded-md overflow-hidden">
        <BankNavigation />

        <h1>HISTORY</h1>
      </div>
    </main>
  );
}
