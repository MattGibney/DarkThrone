import DarkThroneClient from '@darkthrone/client-library';
import BankNavigation from './components/bankNavigation';

interface BankDepositPageProps {
  client: DarkThroneClient;
}
export default function BankHistoryPage(props: BankDepositPageProps) {
  if (!props.client.authenticatedPlayer) return null;

  return (
    <main>
      <div className="my-12 w-full max-w-2xl mx-auto overflow-hidden">
        <BankNavigation />

        <div className="px-0 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full sm:py-2 align-middle">
                <table className="min-w-full border border-card-border border-separate border-spacing-0 rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-right text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border"
                      >
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.client.authenticatedPlayer.depositHistory
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .map((history, historyIdx) => (
                        <tr key={historyIdx} className="hover:bg-accent/50">
                          <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                            <span className="block sm:hidden">
                              {new Intl.DateTimeFormat(undefined, {
                                dateStyle: 'short',
                              }).format(new Date(history.date))}
                            </span>
                            <span className="hidden sm:block">
                              {new Date(history.date).toLocaleString()}
                            </span>
                          </td>
                          <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-right text-foreground/75">
                            {new Intl.NumberFormat().format(history.amount)}
                          </td>
                          <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                            {history.type === 'deposit'
                              ? 'Deposit'
                              : 'Withdrawal'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 mt-8 rounded-md text-card-foreground/70 text-sm font-semibold">
          Only transactions within the last 24 hours are currently visible.
        </div>
      </div>
    </main>
  );
}
