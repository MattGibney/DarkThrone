import Navigation from './navigation';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DesktopSidebarProps {}
export default function DesktopSidebar(props: DesktopSidebarProps) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=yellow&shade=500"
              alt="Your Company"
            />
          </div>

          <Navigation />
        </div>
      </div>
  );
}
