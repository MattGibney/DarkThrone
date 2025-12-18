import { Logo } from '@darkthrone/react-components';
import Navigation from './navigation';

export default function DesktopSidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-2 overflow-y-auto bg-muted border-r border-foreground/10 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Logo />
        </div>

        <Navigation />
      </div>
    </div>
  );
}
