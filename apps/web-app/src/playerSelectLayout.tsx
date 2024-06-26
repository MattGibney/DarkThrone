import DarkThroneClient from '@darkthrone/client-library';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

interface PlayerSelectLayoutProps {
  client: DarkThroneClient;
}
export default function PlayerSelectLayout(props: PlayerSelectLayoutProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.client.authenticatedUser) {
      navigate('/login');
    }
    if (props.client.authenticatedUser?.playerID) {
      navigate('/overview');
    }
  }, [navigate, props.client.authenticatedUser]);
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  );
}
