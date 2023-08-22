import DarkThroneClient from '@darkthrone/client-library';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  client: DarkThroneClient;
}
export default function MainLayout(props: MainLayoutProps) {
  useEffect(() => {
    console.log('MainLayout', props.client.authenticatedUser);
  }, [props.client.authenticatedUser]);
  return (
    <div>
      <Outlet />
    </div>
  )
}
