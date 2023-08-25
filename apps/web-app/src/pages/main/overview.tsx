import { useLocation } from 'react-router-dom';
import SubNavigation from '../../components/layout/subNavigation';
import { navigation } from '../../components/layout/navigation';

export default function OverviewPage() {
  const location = useLocation();

  return (
    <div>
      <SubNavigation
        tabs={navigation.find((nav) => nav.children?.some((child) => child.to === location.pathname))?.children || []}
      />
    </div>
  );
}
