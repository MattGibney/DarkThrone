import { NavLink } from 'react-router-dom';
import { classNames } from '../../../../../utils';
import { Trans } from 'react-i18next';

const tabs = [
  { name: 'deposit', href: '/bank/deposit' },
  { name: 'withdraw', href: '/bank/withdraw' },
  { name: 'bankHistory', href: '/bank/history' },
  // { name: 'Economy', href: '/bank/economy' },
];

export default function BankNavigation() {
  return (
    <nav
      className="isolate flex divide-x divide-zinc-700 rounded-lg shadow mb-8"
      aria-label="Tabs"
    >
      {tabs.map((tab, tabIdx) => (
        <NavLink
          to={tab.href}
          key={tabIdx}
          className={classNames(
            'text-zinc-200 hover:text-zinc-300',
            tabIdx === 0 ? 'rounded-l-lg' : '',
            tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
            'group relative min-w-0 flex-1 overflow-hidden bg-zinc-800 py-4 px-4 text-center text-sm font-medium hover:bg-zinc-700 focus:z-10',
          )}
        >
          {({ isActive }) => (
            <>
              <span>
                <Trans i18nKey={tab.name} ns="bank" />
              </span>
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
