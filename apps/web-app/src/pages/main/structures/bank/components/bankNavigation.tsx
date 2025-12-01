import { NavLink } from 'react-router-dom';
import { classNames } from '../../../../../utils';
import { useTranslation } from 'react-i18next';

const tabKeys = [
  { name: 'bank.navigation.deposit', href: '/bank/deposit' },
  { name: 'bank.navigation.withdraw', href: '/bank/withdraw' },
  { name: 'bank.navigation.history', href: '/bank/history' },
  // { name: 'bank_nav_economy', href: '/bank/economy' },
];

export default function BankNavigation() {
  const { t } = useTranslation('structures');
  return (
    <nav
      className="isolate flex divide-x divide-zinc-700 rounded-lg shadow mb-8"
      aria-label="Tabs"
    >
      {tabKeys.map((tab, tabIdx) => (
        <NavLink
          to={tab.href}
          key={tabIdx}
          className={classNames(
            'text-zinc-200 hover:text-zinc-300',
            tabIdx === 0 ? 'rounded-l-lg' : '',
            tabIdx === tabKeys.length - 1 ? 'rounded-r-lg' : '',
            'group relative min-w-0 flex-1 overflow-hidden bg-zinc-800 py-4 px-4 text-center text-sm font-medium hover:bg-zinc-700 focus:z-10',
          )}
        >
          {({ isActive }) => (
            <>
              <span>{t(tab.name)}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  isActive ? 'bg-yellow-500' : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-0.5',
                )}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
