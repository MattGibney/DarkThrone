import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@darkthrone/react-components';
import DarkThroneClient from '@darkthrone/client-library';
import { ChevronsUpDown, LogOut, ReplaceAll } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@darkthrone/shadcnui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@darkthrone/shadcnui/dropdown-menu';
import { Avatar } from '../avatar';
import { globalNavigation } from '../../app';

function pathMatches(pattern: string, pathname: string) {
  const regexPattern = pattern.replace(/:[^/]+/g, '[^/]+');
  const regex = new RegExp(`^${regexPattern}$`);

  return regex.test(pathname);
}

interface AppSidebarProps {
  client: DarkThroneClient;
}

export default function AppSidebar(props: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  const groups = globalNavigation.filter((group) => group.shouldRender);
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const playerName = props.client.authenticatedPlayer?.name ?? 'Player';
  const userEmail = props.client.authenticatedUser?.email ?? 'Unknown';

  async function handleSwitchPlayer() {
    await props.client.auth.unassumePlayer();
    navigate('/player-select');
    handleNavClick();
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-3">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.children
                  ?.filter((child) => child.shouldRender)
                  .map((child) => (
                    <SidebarMenuItem key={child.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathMatches(child.to, location.pathname)}
                        onClick={handleNavClick}
                      >
                        <NavLink to={child.to}>
                          <span>{child.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarMenu className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={handleNavClick}>
                  <a
                    href="https://discord.gg/6rEPCvSka9"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                      className="fill-current"
                      aria-hidden="true"
                    >
                      <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
                    </svg>
                    <span>Join the Discord</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar
                    url={props.client.authenticatedPlayer?.avatarURL}
                    race={props.client.authenticatedPlayer?.race}
                    size="small"
                    variant="square"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{playerName}</span>
                    <span className="truncate text-xs">{userEmail}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar
                      url={props.client.authenticatedPlayer?.avatarURL}
                      race={props.client.authenticatedPlayer?.race}
                      size="small"
                      variant="square"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{playerName}</span>
                      <span className="truncate text-xs">{userEmail}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleSwitchPlayer}>
                    <ReplaceAll />
                    Switch Player
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    props.client.auth.logout();
                    handleNavClick();
                  }}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
