import { NavLink, useLocation } from 'react-router-dom';
import { classNames } from '../../utils';
import { globalNavigation } from '../../app';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const location = useLocation();
  const [activeParentHref, setActiveParentHref] = useState<string | undefined>();

  useEffect(() => {
    const activeParent = globalNavigation.find((nav) => nav.children?.some((child) => child.to === location.pathname));
    setActiveParentHref(activeParent?.href);
  }, [location]);

  return (
    <nav className="flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul className="-mx-2 space-y-1">
            {globalNavigation.filter((tab) => tab.shouldRender).map((item, itemIdx) => (
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
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
