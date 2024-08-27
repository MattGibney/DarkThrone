import DarkThroneClient from '@darkthrone/client-library';

interface UpgradesScreenProps {
  client: DarkThroneClient;
}
export default function UpgradesScreen(props: UpgradesScreenProps) {
  return (
    <div className="max-w-7xl mx-auto">
      Upgrades
    </div>
  );
}
