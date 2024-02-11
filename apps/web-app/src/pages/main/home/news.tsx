import { useLocation } from 'react-router-dom';
import SubNavigation from '../../../components/layout/subNavigation';
import DarkThroneClient from '@darkthrone/client-library';
import { globalNavigation } from '../../../app';

interface NewsPageProps {
  client: DarkThroneClient;
}
export default function NewsPage(props: NewsPageProps) {
  const location = useLocation();

  return (
    <div>
      <SubNavigation />

      <h1>News</h1>

    </div>
  );
}
