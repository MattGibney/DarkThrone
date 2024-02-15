import { Outlet } from 'react-router-dom';
import Header from './header';
import NavigationBar from './navigationBar';
import Footer from './footer';

export default function Layout() {
  return (
    <div>
      <Header />

      <NavigationBar />

      <Outlet />

      <Footer />
    </div>
  );
}
