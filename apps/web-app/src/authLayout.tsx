import DarkThroneClient from '@darkthrone/client-library';
import { Outlet } from 'react-router-dom';

interface AuthLayoutProps {
  client: DarkThroneClient;
}
export default function AuthLayout(props: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  )
}
