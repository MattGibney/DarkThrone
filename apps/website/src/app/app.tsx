import { Route, Routes, Link } from 'react-router-dom';
import Layout from '../components/layout/layout';
import HomePage from './page/home';

export const navigation = [
  { name: 'Home', href: '/', element: HomePage },
  // { name: 'Features', href: '/features' },
  // { name: 'News', href: '/news' },
  // { name: 'Social', href: '/social' },
  // { name: 'Media', href: '/media' },
];

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {navigation.map((item) => (
          <Route key={item.name} path={item.href} element={<item.element />} />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
