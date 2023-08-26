import { Outlet, useLocation } from 'react-router-dom';
import SubNavigation from '../../../components/layout/subNavigation';
import { navigation } from '../../../components/layout/navigation';

export default function BattlePage() {
  const location = useLocation();

  return (
    <div>
      <SubNavigation
        tabs={navigation.find((nav) => nav.children?.some((child) => child.to === location.pathname))?.children || []}
      />
      <Outlet />
    </div>
  );
}
