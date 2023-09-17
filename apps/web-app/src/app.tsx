import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AuthLayout from './authLayout';
import MainLayout from './mainLayout';
import LoginPage from './pages/auth/login';

import DarkThroneClient, { UserSessionObject } from '@darkthrone/client-library';
import RegisterPage from './pages/auth/register';
import PlayerSelectListPage from './pages/playerSelect/list';
import PlayerSelectLayout from './playerSelectLayout';
import CreatePlayerPage from './pages/playerSelect/create';
import OverviewPage from './pages/main/overview';
import AttackListPage from './pages/main/battle/attack/list';
import BattlePage from './pages/main/battle';
import AttackViewPlayerPage from './pages/main/battle/attack/viewPlayer';
import AttackPlayerPage from './pages/main/battle/attack/attackPlayer';
import WarHistoryView from './pages/main/battle/warHistory/viewHistory';

const client = new DarkThroneClient();

export function App() {
  const [currentUser, setCurrentUser] = useState<UserSessionObject | null | undefined>(undefined);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userFetch = await client.auth.getCurrentUser();

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

  return (
    <Routes>
      <Route element={<AuthLayout client={client} />}>
        <Route path="/" element={<RedirectToLogin />} />
        <Route path="/login" element={<LoginPage client={client} />} />
        <Route path="/register" element={<RegisterPage client={client} />} />
        <Route path="/forgot-password" element={<div>Forgot Password</div>} />
        {/* <Route path="/reset-password" element={<div>Reset Password</div>} />
        <Route path="/verify-email" element={<div>Verify Email</div>} /> */}
      </Route>

      <Route element={<PlayerSelectLayout client={client} />}>
        <Route path="/player-select" element={<PlayerSelectListPage client={client} />} />
        <Route path="/player-select/create" element={<CreatePlayerPage client={client} />} />
      </Route>

      <Route element={<MainLayout client={client} />}>
        {/* Home */}
        <Route path="/overview" element={<OverviewPage client={client} />} />
        {/* <Route path="/news" element={<div>News</div>} />
        <Route path="/levels" element={<div>Levels</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
        <Route path="/faq" element={<div>FAQ</div>} />
        <Route path="/support" element={<div>Support</div>} /> */}

        {/* Battle */}
        <Route element={<BattlePage />}>
          <Route path="/attack" element={<AttackListPage client={client} />} />
          <Route path="/attack/:playerID" element={<AttackPlayerPage client={client} />} />
          {/* <Route path="/training" element={<div>Training</div>} />
          <Route path="/mercenaries" element={<div>Mercenaries</div>} />
          <Route path="/upgrades" element={<div>Upgrades</div>} /> */}
          <Route path="/war-history" element={<div>War History</div>} />
          <Route path="/war-history/:historyID" element={<WarHistoryView client={client} />} />
        </Route>

        <Route path="/player/:playerID" element={<AttackViewPlayerPage client={client} />} />

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
    </Routes>
  );
}

function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null;
}

export default App;
