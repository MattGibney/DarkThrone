import DarkThroneClient from '@darkthrone/client-library';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  client: DarkThroneClient;
}
export default function MainLayout(props: MainLayoutProps) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.client.authenticatedUser) {
      navigate('/login');
    }
    if (props.client.authenticatedUser && !props.client.authenticatedUser.playerID) {
      navigate('/player-select');
    }
  }, [navigate, props.client.authenticatedUser]);
  return (
    <Outlet />
  )
}
