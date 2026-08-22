import { Outlet } from 'react-router-dom';
import Header from './header';
import NavigationBar from './navigationBar';
import Footer from './footer';
import { SunsetNotice } from '@darkthrone/react-components';

export default function Layout() {
  return (
    <div>
      <Header />

      <NavigationBar />

      <SunsetNotice />

      <Outlet />

      <Footer />
    </div>
  );
}
