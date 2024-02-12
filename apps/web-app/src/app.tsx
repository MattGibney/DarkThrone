import { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import AuthLayout from './authLayout';
import MainLayout from './mainLayout';
import LoginPage from './pages/auth/login';

import DarkThroneClient, { UserSessionObject } from '@darkthrone/client-library';
import RegisterPage from './pages/auth/register';
import PlayerSelectListPage from './pages/playerSelect/list';
import PlayerSelectLayout from './playerSelectLayout';
import CreatePlayerPage from './pages/playerSelect/create';
import OverviewPage from './pages/main/home/overview';
import AttackListPage from './pages/main/battle/attack/list';
import BattlePage from './pages/main/battle';
import AttackViewPlayerPage from './pages/main/battle/attack/viewPlayer';
import AttackPlayerPage from './pages/main/battle/attack/attackPlayer';
import WarHistoryView from './pages/main/battle/warHistory/viewHistory';
import ListWarHistory from './pages/main/battle/warHistory/listHistory';
import TrainingScreen from './pages/main/battle/training';
import NewsPage from './pages/main/home/news';

export const globalNavigation = [
  {
    name: 'Home',
    href: '/overview',
    component: GenericOutlet,
    shouldRender: true,
    children: [
      { name: 'Overview', to: '/overview', shouldRender: true, component: OverviewPage },
      // { name: 'News', to: '/news', shouldRender: true, component: NewsPage },
      // { name: 'Levels', to: '/levels' },
      // { name: 'Settings', to: '/settings' },
      // { name: 'FAQ', to: '/faq' },
      // { name: 'Support', to: '/support' },
    ]
  },
  {
    name: 'Battle',
    href: '/attack',
    shouldRender: true,
    component: BattlePage,
    children: [
      { name: 'Attack', to: '/attack', shouldRender: true, component: AttackListPage },
      { name: 'Attack Player', to: '/attack/:playerID', shouldRender: false, component: AttackPlayerPage },
      { name: 'Training', to: '/training', shouldRender: true, component: TrainingScreen },
      // { name: 'Mercenaries', to: '/mercenaries' },
      // { name: 'Upgrades', to: '/upgrades' },
      { name: 'War History', to: '/war-history', shouldRender: true, component: ListWarHistory },
      { name: 'View War History', to: '/war-history/:historyID', shouldRender: false, component: WarHistoryView },
    ]
  },
  {
    name: 'View Player',
    href: '/player/:playerID',
    shouldRender: false,
    component: AttackViewPlayerPage,
  }
  // {
  //   name: 'Structures',
  //   href: '/bank'
  // },
  // {
  //   name: 'Alliances',
  //   href: '/my-alliances'
  // },
  // {
  //   name: 'Community',
  //   href: '/friends'
  // },
];

const client = new DarkThroneClient();

export function App() {
  const [currentUser, setCurrentUser] = useState<UserSessionObject | null | undefined>(undefined);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userFetch = await client.auth.getCurrentUser();

      client.on('userLogin', (user) => {
        setCurrentUser(user);
      });
      client.on('userLogout', () => {
        setCurrentUser(null);
      });
      client.on('playerChange', (UserSessionObject) => {
        setCurrentUser(UserSessionObject);
      });

      if (userFetch.status === 'fail') {
        setCurrentUser(null);
        return;
      }
      setCurrentUser(userFetch.data);
    }

    fetchCurrentUser();
  }, []);

  if (currentUser === undefined) return null;

  if (currentUser === null) {
    return (
      <Routes>
        <Route element={<AuthLayout client={client} />}>
          {/* <Route path="/" element={<RedirectTo path />} /> */}
          <Route path="/login" element={<LoginPage client={client} />} />
          <Route path="/register" element={<RegisterPage client={client} />} />
          <Route path="/forgot-password" element={<div>Forgot Password</div>} />
          {/* <Route path="/reset-password" element={<div>Reset Password</div>} />
          <Route path="/verify-email" element={<div>Verify Email</div>} /> */}
        </Route>

        <Route path="*" element={<RedirectTo path={'/login'} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<PlayerSelectLayout client={client} />}>
        <Route path="/player-select" element={<PlayerSelectListPage client={client} />} />
        <Route path="/player-select/create" element={<CreatePlayerPage client={client} />} />
      </Route>

      <Route element={<MainLayout client={client} />}>
        {globalNavigation.map((nav) => (
          <Route key={nav.name} path={nav.children ? undefined : nav.href} element={<nav.component client={client} />}>
            {nav.children?.map((child) => (
              <Route key={child.name} path={child.to} element={<child.component client={client} />} />
            ))}
          </Route>
        ))}


        {/* Home */}
        {/* <Route path="/overview" element={<OverviewPage client={client} />} /> */}
        {/* <Route path="/news" element={<NewsPage client={client} />} /> */}
        {/* <Route path="/levels" element={<div>Levels</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
        <Route path="/faq" element={<div>FAQ</div>} />
        <Route path="/support" element={<div>Support</div>} /> */}

        {/* Battle */}
        {/* <Route element={<BattlePage />}>
          <Route path="/attack" element={<AttackListPage client={client} />} />
          <Route path="/attack/:playerID" element={<AttackPlayerPage client={client} />} />
          <Route path="/training" element={<TrainingScreen client={client} />} />
          <Route path="/mercenaries" element={<div>Mercenaries</div>} />
          <Route path="/upgrades" element={<div>Upgrades</div>} />
          <Route path="/war-history" element={<ListWarHistory client={client} />} />
          <Route path="/war-history/:historyID" element={<WarHistoryView client={client} />} />
        </Route> */}

        {/* <Route path="/player/:playerID" element={<AttackViewPlayerPage client={client} />} /> */}

        {/* Structures */}
        {/* <Route path="/bank" element={<div>Bank</div>} />
        <Route path="/armory" element={<div>Armory</div>} />
        <Route path="/upgrades" element={<div>Upgrades</div>} />
        <Route path="/housing" element={<div>Housing</div>} />
        <Route path="/repair" element={<div>Repair</div>} /> */}

        {/* Alliances */}
        {/* <Route path="/my-alliances" element={<div>My Alliances</div>} />
        <Route path="/alliance-listing" element={<div>Alliance Listing</div>} /> */}

        {/* Community */}
        {/* <Route path="/downloads" element={<div>Downloads</div>} />
        <Route path="/friends" element={<div>Friends</div>} />
        <Route path="/rankings" element={<div>Rankings</div>} />
        <Route path="/forum" element={<div>Forum</div>} />
        <Route path="/messaging" element={<div>Messaging</div>} />
        <Route path="/recruiter" element={<div>Recruiter</div>} /> */}



      </Route>

      <Route path="*" element={<RedirectTo path={'/overview'} />} />
    </Routes>
  );
}

function RedirectTo(props: { path: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(props.path);
  }, [navigate, props.path]);

  return null;
}

interface GenericOutletProps {
  client: DarkThroneClient;
}
function GenericOutlet(props: GenericOutletProps) {
  return <Outlet />
}

export default App;
