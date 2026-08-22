import DarkThroneClient from '@darkthrone/client-library';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderBar from './components/layout/headerBar';
import Footer from './components/layout/footer';
import AppSidebar from './components/layout/appSidebar';
import { SidebarInset, SidebarProvider } from '@darkthrone/shadcnui/sidebar';
import { SunsetNotice } from '@darkthrone/react-components';

interface MainLayoutProps {
  client: DarkThroneClient;
}
export default function MainLayout(props: MainLayoutProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      props.client.authenticatedUser &&
      !props.client.authenticatedUser.playerID
    ) {
      navigate('/player-select');
    }
  }, [navigate, props.client.authenticatedUser]);

  return (
    <SidebarProvider>
      <AppSidebar client={props.client} />
      <SidebarInset>
        <HeaderBar client={props.client} />
        <SunsetNotice className="mx-4 mt-4 rounded-lg sm:mx-6 lg:mx-8" />

        <div className="p-4 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
