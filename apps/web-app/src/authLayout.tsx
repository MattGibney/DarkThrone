import DarkThroneClient from '@darkthrone/client-library';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  client: DarkThroneClient;
}
export default function AuthLayout(props: AuthLayoutProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.client.authenticatedUser) {
      if (!props.client.authenticatedUser.playerID) {
        navigate('/player-select');
        return;
      }
      navigate('/overview');
    }
  }, [navigate, props.client.authenticatedUser]);
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  )
}
