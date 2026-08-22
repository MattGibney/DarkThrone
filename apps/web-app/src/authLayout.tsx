import { SunsetNotice } from '@darkthrone/react-components';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SunsetNotice className="mx-4 mt-4 rounded-lg sm:mx-6 lg:mx-8" />
      <div className="flex flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}
