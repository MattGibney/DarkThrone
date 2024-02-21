import { Outlet, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/layout';
import HomePage from './page/home';
import { environment } from '../environments/environment';
import PrivacyPage from './page/legal/privacy';

export type NavigationItem = {
  name: string;
  href: string;
  element: React.FC;
};

export const screens: { [k: string]: NavigationItem } = {
  home: { name: 'Home', href: '/', element: HomePage },
  news: { name: 'News', href: '/news', element: HomePage },
  roadmap: { name: 'Roadmap', href: '/roadmap', element: HomePage },
  contact: { name: 'Contact', href: '/contact', element: HomePage },
  privacy: { name: 'Privacy', href: '/privacy', element: PrivacyPage },
  terms: { name: 'Terms & Conditions', href: '/terms', element: HomePage },

  // External Links
  github: { name: 'Github', href: environment.gitHubURL, element: Outlet },
  status: { name: 'Game Status', href: 'https://status.darkthronereborn.com/', element: Outlet },
};

export const navigation = ['home', 'news', 'roadmap'].map((item) => {
  return screens[item];
});

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {Object.values(screens).map((item) => (
          <Route key={item.name} path={item.href} element={<item.element />} />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
