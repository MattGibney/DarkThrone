import { Outlet, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/layout';
import HomePage from './page/home';
import PrivacyPage from './page/legal/privacy';
import NewsPage from './page/news/news';
import ContactPage from './page/contact/contact';
import TermsPage from './page/legal/terms';
import { environment } from '../environments/environment';

export type NavigationItem = {
  name: string;
  href: string;
  element: React.FC;
  isExternal?: boolean;
};

export const screens: { [k: string]: NavigationItem } = {
  home: { name: 'Home', href: '/', element: HomePage },
  news: { name: 'News', href: '/news', element: NewsPage },
  contact: { name: 'Contact', href: '/contact', element: ContactPage },
  privacy: { name: 'Privacy', href: '/privacy', element: PrivacyPage },
  terms: { name: 'Terms & Conditions', href: '/terms', element: TermsPage },

  // External Links
  play: {
    name: 'Play Now',
    href: environment.webAppUrl,
    element: Outlet,
    isExternal: true,
  },
  github: {
    name: 'Github',
    href: 'https://github.com/MattGibney/DarkThrone',
    element: Outlet,
    isExternal: true,
  },
  discord: {
    name: 'Discord',
    href: 'https://discord.gg/ygYCytkx7Y',
    element: Outlet,
    isExternal: true,
  },
  status: {
    name: 'Game Status',
    href: 'https://status.darkthronereborn.com/',
    element: Outlet,
    isExternal: true,
  },
  bugReport: {
    name: 'Bug Report',
    href: 'https://github.com/MattGibney/DarkThrone/issues/new/choose',
    element: Outlet,
    isExternal: true,
  },
  contributors: {
    name: 'Contributors',
    href: 'https://github.com/MattGibney/DarkThrone/graphs/contributors',
    element: Outlet,
    isExternal: true,
  },
};

export const navigation = ['home', 'news', 'play'].map((item) => {
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
