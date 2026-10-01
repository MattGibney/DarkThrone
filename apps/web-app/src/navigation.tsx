import { Outlet } from 'react-router-dom';
import type DarkThroneClient from '@darkthrone/client-library';
import OverviewPage from './pages/main/home/overview';
import AttackListPage from './pages/main/battle/attack/list';
import AttackViewPlayerPage from './pages/main/battle/attack/viewPlayer';
import AttackPlayerPage from './pages/main/battle/attack/attackPlayer';
import WarHistoryView from './pages/main/battle/warHistory/viewHistory';
import ListWarHistory from './pages/main/battle/warHistory/listHistory';
import TrainingScreen from './pages/main/battle/training';
import NewsPage from './pages/main/home/news';
import BankDepositPage from './pages/main/structures/bank/deposit';
import BankHistoryPage from './pages/main/structures/bank/history';
import BankWithdrawPage from './pages/main/structures/bank/withdraw';
import UpgradesScreen from './pages/main/structures/upgrades/upgrades';
import ArmouryScreen from './pages/main/structures/armoury/armoury';

interface GenericOutletProps {
  client: DarkThroneClient;
}

export type SubNavigationItem = {
  name: string;
  to: string;
  shouldRender: boolean;
  component: React.ComponentType<GenericOutletProps>;
};

export type NavigationItem = {
  name: string;
  href: string;
  shouldRender: boolean;
  component: React.ComponentType<GenericOutletProps>;
  children?: SubNavigationItem[];
};

export const globalNavigation: NavigationItem[] = [
  {
    name: 'Home',
    href: '/overview',
    component: GenericOutlet,
    shouldRender: true,
    children: [
      {
        name: 'Overview',
        to: '/overview',
        shouldRender: true,
        component: OverviewPage,
      },
      { name: 'News', to: '/news', shouldRender: true, component: NewsPage },
    ],
  },
  {
    name: 'Battle',
    href: '/attack',
    shouldRender: true,
    component: GenericOutlet,
    children: [
      {
        name: 'Attack',
        to: '/attack',
        shouldRender: true,
        component: AttackListPage,
      },
      {
        name: 'Attack Player',
        to: '/attack/:playerID',
        shouldRender: false,
        component: AttackPlayerPage,
      },
      {
        name: 'Training',
        to: '/training',
        shouldRender: true,
        component: TrainingScreen,
      },
      {
        name: 'War History',
        to: '/war-history',
        shouldRender: true,
        component: ListWarHistory,
      },
      {
        name: 'View War History',
        to: '/war-history/:historyID',
        shouldRender: false,
        component: WarHistoryView,
      },
      {
        name: 'View Player',
        to: '/player/:playerID',
        shouldRender: false,
        component: AttackViewPlayerPage,
      },
    ],
  },
  {
    name: 'Structures',
    href: '/bank/deposit',
    shouldRender: true,
    component: GenericOutlet,
    children: [
      {
        name: 'Bank',
        to: '/bank/deposit',
        shouldRender: true,
        component: BankDepositPage,
      },
      {
        name: 'Bank',
        to: '/bank/withdraw',
        shouldRender: false,
        component: BankWithdrawPage,
      },
      {
        name: 'History',
        to: '/bank/history',
        shouldRender: false,
        component: BankHistoryPage,
      },
      {
        name: 'Upgrades',
        to: '/upgrades',
        shouldRender: true,
        component: UpgradesScreen,
      },
      {
        name: 'Armoury',
        to: '/armoury',
        shouldRender: true,
        component: ArmouryScreen,
      },
    ],
  },
];

function GenericOutlet() {
  return <Outlet />;
}
