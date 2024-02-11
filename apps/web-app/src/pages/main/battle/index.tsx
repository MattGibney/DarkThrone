import { Outlet, useLocation } from 'react-router-dom';
// import SubNavigation from '../../../components/layout/subNavigation';
// import { navigation } from '../../../components/layout/navigation';

export default function BattlePage() {
  const location = useLocation();

  // const tabs = navigation.find((nav) => nav.children?.some((child) => child.to.split('/')[1] === location.pathname.split('/')[1]))?.children;


  return (
    <div>
      {/* {tabs ? (
        <SubNavigation
          tabs={tabs}
        />
      ) : null} */}
      <Outlet />
    </div>
  );
}
