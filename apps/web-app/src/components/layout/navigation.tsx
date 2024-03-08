import { Link, NavLink, useLocation } from 'react-router-dom';
import { classNames } from '../../utils';
import { globalNavigation } from '../../app';
import { useEffect, useState } from 'react';

interface NavigationProps {
  closeSidebar?: () => void;
}
export default function Navigation(props: NavigationProps) {
  const location = useLocation();
  const [activeParentHref, setActiveParentHref] = useState<
    string | undefined
  >();

  useEffect(() => {
    const activeParent = globalNavigation.find((nav) =>
      nav.children?.some((child) => {
        const regexPattern = child.to.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${regexPattern}$`);

        return regex.test(location.pathname);
      }),
    );
    setActiveParentHref(activeParent?.href);
  }, [location]);

  return (
    <nav className="flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li className="flex-1">
          <ul className="-mx-2 space-y-1">
            {globalNavigation
              .filter((tab) => tab.shouldRender)
              .map((item, itemIdx) => (
                <li key={itemIdx}>
                  <NavLink
                    className={({ isActive }) =>
                      classNames(
                        isActive || item.href === activeParentHref
                          ? 'bg-yellow-700/25 text-yellow-600'
                          : 'text-zinc-300 hover:text-primary-600 hover:bg-zinc-700/50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                      )
                    }
                    to={item.href}
                    onClick={props.closeSidebar}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
          </ul>
        </li>
        <li>
          <ul className="-mx-2 space-y-1">
            <li>
              <Link
                to="https://discord.gg/6rEPCvSka9"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-zinc-300 hover:text-primary-600 hover:bg-zinc-700/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-6 w-6 fill-zinc-200"
                >
                  <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
                </svg>
                Join the Discord
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
