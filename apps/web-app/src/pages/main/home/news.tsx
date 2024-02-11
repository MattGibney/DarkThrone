import SubNavigation from '../../../components/layout/subNavigation';
import DarkThroneClient from '@darkthrone/client-library';

interface NewsPageProps {
  client: DarkThroneClient;
}
export default function NewsPage(props: NewsPageProps) {
  return (
    <div>
      <SubNavigation />

      <h1>News</h1>

    </div>
  );
}
