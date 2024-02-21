import DarkThroneClient from '@darkthrone/client-library';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MobileSidebar from './components/layout/mobileSidebar';
import DesktopSidebar from './components/layout/desktopSidebar';
import HeaderBar from './components/layout/headerBar';
import Footer from './components/layout/footer';

interface MainLayoutProps {
  client: DarkThroneClient;
}
export default function MainLayout(props: MainLayoutProps) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (props.client.authenticatedUser && !props.client.authenticatedUser.playerID) {
      navigate('/player-select');
    }
  }, [navigate, props.client.authenticatedUser]);

  return (
    <div>
      <MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Static sidebar for desktop */}
      <DesktopSidebar />

      <div className="lg:pl-72">
        <HeaderBar setSidebarOpen={setSidebarOpen} client={props.client} />

        <main className="px-4 sm:px-6 lg:px-8 lg:py-4">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}
